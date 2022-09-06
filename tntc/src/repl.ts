/*
 * REPL for tntc.
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import * as readline from 'readline'
import chalk from 'chalk'

import { just, none } from '@sweet-monads/maybe'

import { TntEx } from './tntIr'
import { compile } from './runtime/compile'
import { ExecError } from './runtime/runtime'
import { probeParse, ErrorMessage } from './tntParserFrontend'

// tunable settings
export const settings = {
  prompt: '>>> ',
  continuePrompt: '... ',
}

// the entry point to the REPL
export function tntRepl () {
  const out = console.log
  out(chalk.gray('TNT REPL v0.0.1'))
  out(chalk.gray('Type ".exit" to exit, or ".help" for more information'))
  // create a readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: settings.prompt,
  })

  rl.prompt()

  // input history
  let history = ''
  // we let the user type a multiline string, which is collected here:
  let multilineText = ''
  // when the number of open braces or parentheses is positive,
  // we enter the multiline mode
  let nOpenBraces = 0
  let nOpenParen = 0

  // Ctrl-C handler
  rl.on('SIGINT', () => {
    // if the user is stuck and presses Ctrl-C, reset the multiline mode
    multilineText = ''
    nOpenBraces = 0
    nOpenParen = 0
    rl.setPrompt(settings.prompt)
    out(chalk.yellow('<cancelled>'))
    rl.prompt()
  })

  // next line handler
  function nextLine (line: string) {
    const [nob, nop] = countBraces(line)
    nOpenBraces += nob
    nOpenParen += nop
    if (multilineText === '') {
      if (nOpenBraces > 0 || nOpenParen > 0) {
        // enter a multiline mode
        multilineText += '\n' + line
        rl.setPrompt(settings.continuePrompt)
      } else {
        line.trim() === '' || (history = tryEval(history, line))
      }
    } else {
      if (line.trim() === '' && nOpenBraces <= 0 && nOpenParen <= 0) {
        // end the multiline mode
        history = tryEval(history, multilineText)
        multilineText = ''
        rl.setPrompt(settings.prompt)
      } else {
        // continue the multiline mode
        multilineText += '\n' + line
      }
    }
  }

  // the read-eval-print loop
  rl.on('line', (line) => {
    switch (line.trim()) {
      case '.help':
        out('.exit\tExit the REPL')
        out('.help\tPrint this help message')
        out('.clear\tClear the history')
        out('\nType an expression and press Enter to evaluate it.')
        out('When the REPL switches to multiline mode "...", finish it with an empty line.')
        out('\nPress Ctrl+C to abort current expression, Ctrl+D to exit the REPL')
        break

      case '.exit':
        process.exit(0)

      case '.clear':
        history = ''
        break

      default:
        nextLine(line)
        break
    }
    rl.prompt()
  }).on('close', () => {
    console.log('')
    process.exit(0)
  })
}

// private definitions

// convert a TNT expression to a colored string, tuned for REPL
function chalkTntEx (ex: TntEx): string {
  switch (ex.kind) {
    case 'bool':
      return chalk.yellow(`${ex.value}`)

    case 'int':
      return chalk.yellow(`${ex.value}`)

    case 'app':
      if (ex.opcode !== 'set') {
        // instead of throwing, show it in red
        return chalk.red(`unsupported operator: ${ex.opcode}(...))`)
      } else {
        const as = ex.args.map(chalkTntEx).join(', ')
        return chalk.green('set') + chalk.black(`(${as})`)
      }

    default:
      return chalk.red(`unsupported operator: ${ex.kind}`)
  }
}

// try to evaluate the expression in a string and print it, if successful
function tryEval (history: string, newInput: string): string {
  let newHistory = history
  const probeResult = probeParse(newInput, '<input>')
  if (probeResult.kind === 'error') {
    printErrorMessages(newInput, probeResult.messages)
  }
  if (probeResult.kind === 'expr') {
    // embed expression text into a value definition inside a module
    const moduleText = `module __REPL {
${history}
  val __input =
${newInput}
}`
    // compile the expression or definition and evaluate it
    const computable = compile(moduleText, chalkHandler).get('__input')
    const resultDefined =
      (computable)
        ? computable
          .eval()
          .map(value => console.log(chalkTntEx(value.toTntEx())))
        : none()
    if (resultDefined.isNone()) {
      console.error(chalk.red('<result undefined>'))
    }
  }
  if (probeResult.kind === 'unit') {
    // embed expression text into a module at the top level
    const moduleText = `module __REPL {
${history}
${newInput}
}`
    // compile the module and add it to history if everything worked
    const context = compile(moduleText, chalkHandler)
    if (context.size === 0) {
      console.error(chalk.red('<compilation failed>'))
    } else {
      // add the new input to the history
      newHistory = history + '\n' + newInput
    }
  }

  return newHistory
}

// output errors to the console in red
function chalkHandler (err: ExecError) {
  console.error(chalk.red(`${err.sourceAndLoc}: ${err.msg}`))
}

// print error messages with proper colors
function printErrorMessages (text: string, messages: ErrorMessage[]) {
  // display the error messages and highlight the error places
  for (const e of messages) {
    console.error(`Syntax error: ${chalk.red(e.explanation)}`)
    const lines = text.split('\n')
    let lineno = 0
    for (const line of lines) {
      // try highlighting the first error location
      if (e.locs[0]) {
        const loc = e.locs[0]
        if (lineno < loc.start.line) {
          // outside of the error region, no highlighting
          console.error(line)
        } else {
          // starting or continuing the error region
          let col1 = (loc.start.line === lineno) ? loc.start.col : 0
          let col2 = line.length
          if (loc.end) {
            if (lineno <= loc.end.line) {
              // inside the region, maybe part of the string to highlight
              col2 = (loc.end.line === lineno) ? loc.end.col + 1 : line.length
            } else {
              // outside of the error region, no highlighting
              col1 = line.length
              col2 = line.length
            }
          } else {
            // the region end is not defined, highlight the rest of the line
            col2 = line.length
          }
          const before = line.slice(0, col1)
          const error = chalk.red(line.slice(col1, col2))
          const after = line.slice(col2)
          console.error(`${before}${error}${after}`)
        }
      }
      lineno += 1
    }
  }
}

// count the difference between the number of '{' and '}'
// as well as the difference between the number of '(' and ')' in a string
function countBraces (str: string): [number, number] {
  let nOpenBraces = 0
  let nOpenParen = 0
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

      default:
    }
  }

  return [nOpenBraces, nOpenParen]
}
