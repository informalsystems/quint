/*
 * REPL for quint.
 *
 * Igor Konnov, Gabriela Moreira, 2022-2023.
 *
 * Copyright (c) Informal Systems 2022-2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import * as readline from 'readline'
import { Readable, Writable } from 'stream'
import { readFileSync, writeFileSync } from 'fs'
import lineColumn from 'line-column'
import { Maybe, just, none } from '@sweet-monads/maybe'
import { Either, left, right } from '@sweet-monads/either'
import chalk from 'chalk'
import { format } from './prettierimp'

import { FlatDef, QuintEx, isFlat } from './quintIr'
import {
  CompilationContext,
  CompilationState,
  compileDef,
  compileExpr,
  compileFromCode,
  contextNameLookup,
  lastTraceName,
  newCompilationState,
} from './runtime/compile'
import { formatError } from './errorReporter'
import { Register } from './runtime/runtime'
import { TraceRecorder, newTraceRecorder } from './runtime/trace'
import { ErrorMessage, parseExpressionOrUnit } from './parsing/quintParserFrontend'
import { prettyQuintEx, printExecutionFrameRec, terminalWidth } from './graphics'
import { verbosity } from './verbosity'
import { Rng, newRng } from './rng'
import { version } from './version'
import { fileSourceResolver } from './parsing/sourceResolver'
import { cwd } from 'process'
import { newIdGenerator } from './idGenerator'
import { definitionToString } from './IRprinting'
import { EvaluationState, newEvaluationState } from './runtime/impl/compilerImpl'

// tunable settings
export const settings = {
  prompt: '>>> ',
  continuePrompt: '... ',
}

type writer = (_text: string) => void

/**
 * The internal state of the REPL.
 */
class ReplState {
  // the history of module definitions loaded from external sources
  moduleHist: string
  // definitions history
  defsHist: string
  // expressions history (for saving and loading)
  exprHist: string[]
  // filename and module name that were loaded with .load filename module
  lastLoadedFileAndModule: [string?, string?]
  // The state of pre-compilation phases
  compilationState: CompilationState
  // The state of the compiler visitor
  evaluationState: EvaluationState

  constructor(verbosityLevel: number, rng: Rng) {
    this.moduleHist = ''
    this.defsHist = ''
    this.exprHist = []
    this.lastLoadedFileAndModule = [undefined, undefined]
    this.compilationState = this.newCompilationState()
    this.evaluationState = newEvaluationState(newTraceRecorder(verbosityLevel, rng))
  }

  clone() {
    const copy = new ReplState(this.verbosity, newRng(this.rng.getState()))
    copy.moduleHist = this.moduleHist
    copy.defsHist = this.defsHist
    copy.exprHist = this.exprHist
    copy.lastLoadedFileAndModule = this.lastLoadedFileAndModule
    copy.compilationState = this.compilationState
    return copy
  }

  clear() {
    this.moduleHist = ''
    this.defsHist = ''
    this.exprHist = []
    this.compilationState = this.newCompilationState()
    this.evaluationState = newEvaluationState(newTraceRecorder(this.verbosity, this.rng))
  }

  get recorder(): TraceRecorder {
    // ReplState always passes TraceRecorder in the evaluation state
    return this.evaluationState.listener as TraceRecorder
  }

  get rng(): Rng {
    return this.recorder.rng
  }

  get verbosity(): number {
    return this.recorder.verbosityLevel
  }

  set verbosity(level: number) {
    this.recorder.verbosityLevel = level
  }

  get seed(): bigint {
    return this.rng.getState()
  }

  set seed(newSeed: bigint) {
    this.rng.setState(newSeed)
  }

  private newCompilationState(): CompilationState {
    // Introduce the __repl__ module to the compilation state so new expressions
    // are pushed to it.
    const state = newCompilationState()
    return { ...state, modules: [{ name: '__repl__', defs: simulatorBuiltins(state), id: 0n }] }
  }
}

// The default exit terminates the process.
// Since it is inconvenient for testing, do not use it in tests :)
function defaultExit() {
  process.exit(0)
}

// Additional options that can be passed to REPL
export interface ReplOptions {
  preloadFilename?: string
  importModule?: string
  verbosity: number
}

// the entry point to the REPL
export function quintRepl(
  input: Readable,
  output: Writable,
  options: ReplOptions = {
    verbosity: verbosity.defaultLevel,
  },
  exit: () => void = defaultExit
) {
  // output a line of text, no line feed is introduced
  const out = (text: string) => output.write(text)
  const prompt = (text: string) => {
    return verbosity.hasReplPrompt(options.verbosity) ? text : ''
  }
  if (verbosity.hasReplBanners(options.verbosity)) {
    out(chalk.gray(`Quint REPL ${version}\n`))
    out(chalk.gray('Type ".exit" to exit, or ".help" for more information\n'))
  }
  // create a readline interface
  const rl = readline.createInterface({
    input,
    output,
    prompt: prompt(settings.prompt),
  })

  // the state
  const state: ReplState = new ReplState(options.verbosity, newRng())

  // Add the builtins to the text history as well
  state.defsHist = state.compilationState.modules[0].defs.map(def => definitionToString(def)).join('\n')

  tryEvalHistory(out, state)
  // we let the user type a multiline string, which is collected here:
  let multilineText = ''
  // when recyclingOwnOutput is true, REPL is receiving its older output
  let recyclingOwnOutput = false
  // when the number of open braces or parentheses is positive,
  // we enter the multiline mode
  let nOpenBraces = 0
  let nOpenParen = 0
  let nOpenComments = 0

  // Ctrl-C handler
  rl.on('SIGINT', () => {
    // if the user is stuck and presses Ctrl-C, reset the multiline mode
    multilineText = ''
    nOpenBraces = 0
    nOpenParen = 0
    nOpenComments = 0
    rl.setPrompt(prompt(settings.prompt))
    out(chalk.yellow(' <cancelled>\n'))
    // clear the line and show the prompt
    rl.write(null, { ctrl: true, name: 'u' })
    rl.prompt()
  })

  // next line handler
  function nextLine(line: string) {
    const [nob, nop, noc] = countBraces(line)
    nOpenBraces += nob
    nOpenParen += nop
    nOpenComments += noc

    if (multilineText === '') {
      // if the line starts with a non-empty prompt,
      // we assume it is multiline code that was copied from a REPL prompt
      recyclingOwnOutput = settings.prompt !== '' && line.trim().indexOf(settings.prompt) === 0
      if (nOpenBraces > 0 || nOpenParen > 0 || nOpenComments > 0 || recyclingOwnOutput) {
        // Enter a multiline mode.
        // If the text is copy-pasted from the REPL output,
        // trim the REPL decorations.
        multilineText = trimReplDecorations(line)
        rl.setPrompt(prompt(settings.continuePrompt))
      } else {
        if (line.trim() !== '') {
          tryEvalAndClearRecorder(out, state, line + '\n')
        }
      }
    } else {
      const trimmedLine = line.trim()
      const continueOwnOutput = settings.continuePrompt !== '' && trimmedLine.indexOf(settings.continuePrompt) === 0
      if (
        (trimmedLine.length === 0 && nOpenBraces <= 0 && nOpenParen <= 0 && nOpenComments <= 0) ||
        (recyclingOwnOutput && !continueOwnOutput)
      ) {
        // End the multiline mode.
        // If recycle own output, then the current line is, most likely,
        // older input. Ignore it.
        tryEvalAndClearRecorder(out, state, multilineText)
        multilineText = ''
        recyclingOwnOutput = false
        rl.setPrompt(prompt(settings.prompt))
      } else {
        // Continue the multiline mode.
        // It may happen that the text is copy-pasted from the REPL output.
        // In this case, we have to trim the leading '... '.
        multilineText += '\n' + trimReplDecorations(trimmedLine)
      }
    }
  }

  // load the code from a filename and optionally import a module
  function load(filename: string, moduleName: string | undefined) {
    state.clear()
    if (loadFromFile(out, state, filename)) {
      state.lastLoadedFileAndModule[0] = filename
      if (moduleName !== undefined) {
        if (tryEvalAndClearRecorder(out, state, `import ${moduleName}.*`)) {
          state.lastLoadedFileAndModule[1] = moduleName
        } else {
          out(chalk.yellow('Pick the right module name and import it (the file has been loaded)\n'))
        }
      }
    }
  }

  // the read-eval-print loop
  rl.on('line', line => {
    const r = (s: string): string => {
      return chalk.red(s)
    }
    const g = (s: string): string => {
      return chalk.gray(s)
    }
    if (!line.startsWith('.')) {
      // an input to evaluate
      nextLine(line)
    } else {
      // a special command to REPL, extract the command name
      const m = line.match(/^\s*\.(\w+)/)
      if (m === null) {
        out(r(`Unexpected command: ${line}\n`))
        out(g(`Type .help to see the list of commands\n`))
      } else {
        switch (m[1]) {
          case 'help':
            out(`${r('.clear')}\tClear the history\n`)
            out(`${r('.exit')}\tExit the REPL\n`)
            out(`${r('.help')}\tPrint this help message\n`)
            out(`${r('.load')} <filename> ${g('[<module>]')}\tClear the history,\n`)
            out('     \tload the code from a file into the REPL session\n')
            out('     \tand optionally import all definitions from <module>\n')
            out(`${r('.reload')}\tClear the history, load and (optionally) import the last loaded file.\n`)
            out('     \t^ a productivity hack\n')
            out(`${r('.save')} <filename>\tSave the accumulated definitions to a file\n`)
            out(`${r('.verbosity')}=[0-5]\tSet the output level (0 = quiet, 5 = very detailed).\n`)
            out(`${r('.seed')}[=<number>]\tSet or get the random seed.\n`)
            out('\nType an expression and press Enter to evaluate it.\n')
            out('When the REPL switches to multiline mode "...", finish it with an empty line.\n')
            out('\nPress Ctrl+C to abort current expression, Ctrl+D to exit the REPL\n')
            break

          case 'exit':
            exit()
            break

          case 'clear':
            out('\n') // be nice to external programs
            state.clear()
            break

          case 'load':
            {
              const args = line.trim().split(/\s+/)
              const [filename, moduleName] = [args[1], args[2]]
              if (!filename) {
                out(r('.load requires a filename\n'))
              } else {
                load(filename, moduleName)
              }
              rl.prompt()
            }
            break

          case 'reload':
            if (state.lastLoadedFileAndModule[0] !== undefined) {
              load(state.lastLoadedFileAndModule[0], state.lastLoadedFileAndModule[1])
            } else {
              out(r('Nothing to reload. Use: .load filename [moduleName].\n'))
            }
            break

          case 'save':
            {
              const args = line.trim().split(/\s+/)
              if (!args[1]) {
                out(r('.save requires a filename\n'))
              } else {
                saveToFile(out, state, args[1])
              }
              rl.prompt()
            }
            break

          case 'verbosity':
            {
              // similar to yargs, accept: .verbosity n, .verbosity=n, .verbosity = n
              const m = line.match(/^\.verbosity\s*=?\s*([0-5])$/)
              if (m === null) {
                out(r('.verbosity requires a level from 0 to 5\n'))
              } else {
                state.verbosity = Number(m[1])
                if (verbosity.hasReplPrompt(state.verbosity)) {
                  out(g(`.verbosity=${state.verbosity}\n`))
                }
                rl.setPrompt(prompt(settings.prompt))
              }
            }
            break

          case 'seed':
            {
              // accept: .seed n, .seed=n, .seed = n
              const m = line.match(/^\.seed\s*=?\s*((0x[0-9a-f]+|[0-9]*))$/)
              if (m === null) {
                out(r('.seed requires an integer, or no argument\n'))
              } else {
                if (m[1].trim() === '') {
                  out(g(`.seed=${state.seed}\n`))
                } else {
                  state.seed = BigInt(m[1])
                  if (verbosity.hasReplPrompt(state.verbosity)) {
                    out(g(`.seed=${state.seed}\n`))
                  }
                }
              }
            }
            break

          default:
            out(r(`Unexpected command: ${line}\n`))
            out(g(`Type .help to see the list of commands\n`))
            break
        }
      }
    }
    rl.prompt()
  }).on('close', () => {
    out('\n')
    exit()
  })

  // Everything is registered. Optionally, load a module.
  if (options.preloadFilename) {
    load(options.preloadFilename, options.importModule)
  }

  rl.prompt()

  return rl
}

// private definitions
const replBegin = 'module __repl__ {'
const replEnd = '} //-- __repl__'

function saveToFile(out: writer, state: ReplState, filename: string) {
  // 1. Write the previously loaded modules.
  // 2. Write the definitions in the special module called __repl__.
  // 3. Wrap expressions into special comments.
  try {
    const text =
      `${state.moduleHist}
${replBegin}
${state.defsHist}
${replEnd}\n` + state.exprHist.map(s => `/*! ${s} !*/\n`).join('\n')
    writeFileSync(filename, text)
    out(`Session saved to: ${filename}\n`)
  } catch (error) {
    out(chalk.red(error))
    out('\n')
  }
}

function loadFromFile(out: writer, state: ReplState, filename: string): boolean {
  try {
    const data = readFileSync(filename, 'utf8')
    const newState: ReplState = state.clone()
    const modulesAndRepl = data.split(replBegin)
    // whether an error occurred at some step
    newState.moduleHist = modulesAndRepl[0]
    if (modulesAndRepl.length > 1) {
      // found a REPL session
      const defsAndExprs = modulesAndRepl[1].split(replEnd)

      // save the definition history
      newState.defsHist = defsAndExprs[0]
      const isError = !tryEvalHistory(out, newState)
      if (isError) {
        return false
      }

      if (defsAndExprs.length > 1) {
        // unwrap the expressions from the specially crafted comments
        const exprs = (defsAndExprs[1] ?? '').matchAll(/\/\*! (.*?) !\*\//gms) ?? []
        // and replay them one by one

        for (const groups of exprs) {
          if (!tryEvalAndClearRecorder(out, newState, groups[1])) {
            return false
          }
        }
      }
    } else {
      const isError = !tryEvalHistory(out, newState)
      if (isError) {
        return false
      }
    }

    state.moduleHist = newState.moduleHist
    state.defsHist = newState.defsHist
    state.exprHist = newState.exprHist
    state.compilationState = newState.compilationState
    state.evaluationState = newState.evaluationState

    return true
  } catch (error) {
    out(chalk.red(error))
    out('\n')
    return false
  }
}

/**
 * Moves the nextvars register values into the vars, and clears the nextvars.
 * Returns an array of variable names that were not updated.
 * @param vars An array of Register objects representing the current state of the variables.
 * @param nextvars An array of Register objects representing the next state of the variables.
 * @returns An array of variable names that were not updated, or none if all variables were updated.
 */
function saveVars(vars: Register[], nextvars: Register[]): Maybe<string[]> {
  let isAction = false

  const nonUpdated = vars.reduce((acc, varRegister) => {
    const nextVarRegister = nextvars.find(v => v.name === varRegister.name)
    if (nextVarRegister && nextVarRegister.registerValue.isJust()) {
      varRegister.registerValue = nextVarRegister.registerValue
      nextVarRegister.registerValue = none()
      isAction = true
    } else {
      // No nextvar for this variable, so it was not updated
      acc.push(varRegister.name)
    }

    return acc
  }, [] as string[])

  if (isAction) {
    // return the names of the variables that have not been updated
    return just(nonUpdated)
  } else {
    return none()
  }
}

// Declarations that are overloaded by the simulator.
// In the future, we will declare them in a separate module.
function simulatorBuiltins(compilationState: CompilationState): FlatDef[] {
  return [
    parseDefOrThrow(compilationState, `val ${lastTraceName} = []`),
    parseDefOrThrow(compilationState, `def q::test = (q::nruns, q::nsteps, q::init, q::next, q::inv) => false`),
    parseDefOrThrow(compilationState, `def q::testOnce = (q::nsteps, q::init, q::next, q::inv) => false`),
  ]
}

function parseDefOrThrow(compilationState: CompilationState, text: string): FlatDef {
  const result = parseExpressionOrUnit(text, '<builtins>', compilationState.idGen, compilationState.sourceMap)
  if (result.kind === 'toplevel' && isFlat(result.def)) {
    return result.def
  } else {
    throw new Error(`Expected a flat definition, got ${result.kind}, parsing ${text}`)
  }
}

// Compose the text input. This is not evaluated, it's only used to
// report errors, as the error locs are relative to the input.
function prepareModulesText(state: ReplState, textToAdd: string): string {
  return `${state.moduleHist}
module __repl__ {
${state.defsHist}
${textToAdd}
}`
}

function tryEvalHistory(out: writer, state: ReplState): boolean {
  const modulesText = prepareModulesText(state, '')
  const mainPath = fileSourceResolver().lookupPath(cwd(), 'repl.ts')

  const context = compileFromCode(
    newIdGenerator(),
    modulesText,
    '__repl__',
    mainPath,
    state.evaluationState.listener,
    state.rng.next
  )
  if (
    context.evaluationState?.context.size === 0 ||
    context.compileErrors.length > 0 ||
    context.syntaxErrors.length > 0
  ) {
    printErrors(out, state, context)
    return false
  }

  if (context.analysisErrors.length > 0) {
    printErrors(out, state, context)
    // provisionally, continue on type & effects errors
  }

  // Save compilation state
  state.compilationState = context.compilationState
  state.evaluationState = context.evaluationState

  return true
}

// Try to evaluate the expression in a string and print it, if successful.
// After that, clear the recorded stack.
function tryEvalAndClearRecorder(out: writer, state: ReplState, newInput: string): boolean {
  const result = tryEval(out, state, newInput)
  state.recorder.clear()
  return result
}

// try to evaluate the expression in a string and print it, if successful
function tryEval(out: writer, state: ReplState, newInput: string): boolean {
  const parseResult = parseExpressionOrUnit(
    newInput,
    '<input>',
    state.compilationState.idGen,
    state.compilationState.sourceMap
  )
  if (parseResult.kind === 'error') {
    printErrorMessages(out, state, 'syntax error', newInput, parseResult.messages)
    out('\n') // be nice to external programs
    return false
  }
  if (parseResult.kind === 'none') {
    // a comment or whitespaces
    return true
  }
  // evaluate the input, depending on its type
  if (parseResult.kind === 'expr') {
    const context = compileExpr(state.compilationState, state.evaluationState, state.rng, parseResult.expr)

    if (context.syntaxErrors.length > 0 || context.compileErrors.length > 0 || context.analysisErrors.length > 0) {
      printErrors(out, state, context, newInput)
      if (context.syntaxErrors.length > 0 || context.compileErrors.length > 0) {
        return false
      } // else: provisionally, continue on type & effects errors
    }

    state.exprHist.push(newInput.trim())
    // Save the evaluation state only, as state vars changes should persist
    state.evaluationState = context.evaluationState

    return evalExpr(state, out)
      .mapLeft(msg => {
        // when #618 is implemented, we should remove this
        printErrorMessages(out, state, 'runtime error', newInput, context.getRuntimeErrors())
        // print the error message produced by the lookup
        out(chalk.red(msg))
        out('\n') // be nice to external programs
      })
      .isRight()
  }
  if (parseResult.kind === 'toplevel') {
    // compile the module and add it to history if everything worked
    const context = compileDef(state.compilationState, state.evaluationState, state.rng, parseResult.def)

    if (
      context.evaluationState.context.size === 0 ||
      context.compileErrors.length > 0 ||
      context.syntaxErrors.length > 0
    ) {
      printErrors(out, state, context, newInput)
      return false
    }

    if (context.analysisErrors.length > 0) {
      printErrors(out, state, context, newInput)
      // provisionally, continue on type & effects errors
    }

    out('\n') // be nice to external programs
    state.defsHist = state.defsHist + '\n' + newInput // update the history

    // Save compilation state
    state.compilationState = context.compilationState
    state.evaluationState = context.evaluationState
  }

  return true
}

// output errors to the console in red
function printErrors(out: writer, state: ReplState, context: CompilationContext, newInput: string = '') {
  printErrorMessages(out, state, 'syntax error', newInput, context.syntaxErrors)
  printErrorMessages(out, state, 'static analysis error', newInput, context.analysisErrors, chalk.yellow)
  printErrorMessages(out, state, 'compile error', newInput, context.compileErrors)
  out('\n') // be nice to external programs
}

// print error messages with proper colors
function printErrorMessages(
  out: writer,
  state: ReplState,
  kind: string,
  inputText: string,
  messages: ErrorMessage[],
  color: (_text: string) => string = chalk.red
) {
  const modulesText = prepareModulesText(state, inputText)
  // display the error messages and highlight the error places
  messages.forEach(e => {
    const text = e.locs[0].source === '<input>' ? inputText : modulesText
    const finder = lineColumn(text)
    const msg = formatError(text, finder, e, none())
    out(color(`${kind}: ${msg}\n`))
  })
}

// if a line start with '>>> ' or '... ', trim these markers
function trimReplDecorations(line: string) {
  // we are not using settings.prompt and settings.continuePrompt,
  // as ... are interpreted as three characters.
  const match = /^\s*(>>> |\.\.\. )(.*)/.exec(line)
  if (match && match[2] !== undefined) {
    return match[2]
  } else {
    return line
  }
}

// count the difference between the number of:
//  - '{' and '}'
//  - '(' and ')'
//  - '/*' and '*/'
function countBraces(str: string): [number, number, number] {
  let nOpenBraces = 0
  let nOpenParen = 0
  let nOpenComments = 0
  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case '{':
        nOpenBraces++
        break

      case '}':
        nOpenBraces--
        break

      case '(':
        nOpenParen++
        break

      case ')':
        nOpenParen--
        break

      case '/':
        if (i + 1 < str.length && str[i + 1] === '*') {
          nOpenComments++
          i++
        }
        break

      case '*':
        if (i + 1 < str.length && str[i + 1] === '/') {
          nOpenComments--
          i++
        }
        break

      default:
    }
  }

  return [nOpenBraces, nOpenParen, nOpenComments]
}

function evalExpr(state: ReplState, out: writer): Either<string, QuintEx> {
  const computable = contextNameLookup(state.evaluationState.context, 'q::input', 'callable')
  const columns = terminalWidth()
  return computable
    .mapRight(comp => {
      return comp
        .eval()
        .map(value => {
          const ex = value.toQuintEx(state.compilationState.idGen)
          out(format(columns, 0, prettyQuintEx(ex)))
          out('\n')

          if (verbosity.hasUserOpTracking(state.verbosity)) {
            const trace = state.recorder.getBestTrace()
            if (trace.subframes.length > 0) {
              out('\n')
              trace.subframes.forEach((f, i) => {
                out(`[Frame ${i}]\n`)
                printExecutionFrameRec({ width: columns, out }, f, [])
                out('\n')
              })
            }
          }

          if (ex.kind === 'bool' && ex.value) {
            // A Boolean expression may be an action or a run.
            // Save the state, if there were any updates to variables.
            saveVars(state.evaluationState.vars, state.evaluationState.nextVars).map(missing => {
              if (missing.length > 0) {
                out(chalk.yellow('[warning] some variables are undefined: ' + missing.join(', ') + '\n'))
              }
            })
          }
          return right<string, QuintEx>(ex)
        })
        .or(just(left<string, QuintEx>('<undefined value>')))
        .unwrap()
    })
    .join()
}
