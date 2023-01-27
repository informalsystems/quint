/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2021. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

import { CharStreams, CommonTokenStream } from 'antlr4ts'

import { QuintLexer } from './generated/QuintLexer'
import * as p from './generated/QuintParser'
import { QuintListener } from './generated/QuintListener'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

import { QuintModule } from './quintIr'
import { ToIrListener } from './ToIrListener'
import { collectDefinitions } from './definitionsCollector'
import { resolveNames } from './nameResolver'
import { resolveImports } from './importResolver'
import { treeFromModule } from './scoping'
import { scanConflicts } from './definitionsScanner'
import { LookupTable, LookupTableByModule } from './lookupTable'
import { Either, left, mergeInMany, right } from '@sweet-monads/either'

export interface Loc {
  source: string;
  start: { line: number; col: number; index: number; }
  end?: { line: number; col: number; index: number; }
}

// the default error location that usually indicates a bug in our code
const unknownLoc: Loc = {
  source: '<unknown>',
  start: { line: 0, col: 0, index: 0 },
}

/**
 * An error message whose locations have been resolved.
 */
export interface ErrorMessage {
  explanation: string;
  locs: Loc[];
}

export type ParseResult<T> = Either<ErrorMessage[], T>

export interface ParserPhase1 {
  modules: QuintModule[],
  sourceMap: Map<bigint, Loc>
}

export interface ParserPhase2 extends ParserPhase1 {
  table: LookupTableByModule
}

/**
 * The result of probing.
 */
export type ParseProbeResult =
  | { kind: 'toplevel' }
  | { kind: 'expr' }
  | { kind: 'error', messages: ErrorMessage[] }

/**
 * Try parsing text as an expression or a top-level declaration.
 *
 * @param text input text
 * @param sourceLocation a textual description of the source
 * @returns the result of probing
 */
export function
  probeParse(text: string, sourceLocation: string): ParseProbeResult {
  const errorMessages: ErrorMessage[] = []
  const parser = setupParser(text, sourceLocation, errorMessages)
  const tree = parser.unitOrExpr()
  if (errorMessages.length > 0) {
    return { kind: 'error', messages: errorMessages }
  } else {
    const listener = new ProbeListener()
    ParseTreeWalker.DEFAULT.walk(listener as QuintListener, tree)
    return listener.result
  }
}

/**
 * Phase 1 of the Quint parser. Read a string in the Quint syntax and produce the IR.
 * Note that the IR may be ill-typed and some names may be unresolved.
 * The main goal of this pass is to translate a sequence of characters into IR.
 */
export function parsePhase1(text: string, sourceLocation: string): ParseResult<ParserPhase1> {
  const errorMessages: ErrorMessage[] = []
  const parser = setupParser(text, sourceLocation, errorMessages)
  // run the parser
  const tree = parser.modules()
  if (errorMessages.length > 0) {
    // report the errors
    return left(errorMessages)
  } else {
    // walk through the AST and construct the IR
    const listener = new ToIrListener(sourceLocation)
    ParseTreeWalker.DEFAULT.walk(listener as QuintListener, tree)

    if (listener.errors.length > 0) {
      return left(listener.errors)
    } else if (listener.topModules.length > 0) {
      return right({ modules: listener.topModules, sourceMap: listener.sourceMap })
    } else {
      // istanbul ignore next
      throw new Error('Illegal state: root module is undefined. Please report a bug.')
    }
  }
}

/**
 * Phase 2 of the Quint parser. Read the IR and check that all names are defined.
 * Note that the IR may be ill-typed.
 */
export function parsePhase2(phase1Data: ParserPhase1): ParseResult<ParserPhase2> {
  const sourceMap: Map<bigint, Loc> = phase1Data.sourceMap

  return phase1Data.modules.reduce((result: ParseResult<ParserPhase2>, module) => {
    const scopeTree = treeFromModule(module)
    let definitions = collectDefinitions(module)
    result.map(r => definitions = new Map([...r.table.entries(), ...definitions.entries()]))

    const importResult: Either<ErrorMessage[], LookupTableByModule> = resolveImports(module, definitions)
      .map(defs => definitions = defs)
      .mapLeft((errors): ErrorMessage[] => {
        const messages = errors.map(error => {
          const sourceLoc = sourceMap.get(error.reference)
          if (!sourceLoc) {
            console.error(`No source location found for ${error.reference}. Please report a bug.`)
          }
          const loc = sourceLoc ?? unknownLoc

          if (error.defName) {
            const e = `Failed to import definition ${error.defName} from module ${error.moduleName}`
            return { explanation: e, locs: [loc] }
          } else {
            return { explanation: `Failed to import module ${error.moduleName}`, locs: [loc] }
          }
        })

        return messages
      })

    const conflictResult: Either<ErrorMessage[], void[]> =
      mergeInMany([...definitions.entries()].map(([moduleName, defs]) => {
        return scanConflicts(defs, scopeTree).mapLeft((conflicts): ErrorMessage[] => {
          return conflicts.map(conflict => {
            let msg, sources
            if (conflict.sources.some(source => source.kind === 'builtin')) {
              msg = `Built-in name ${conflict.identifier} is redefined in module ${moduleName}`
              sources = conflict.sources.filter(source => source.kind === 'user')
            } else {
              msg = `Conflicting definitions found for name ${conflict.identifier} in module ${moduleName}`
              sources = conflict.sources
            }

            const locs = sources.map(source => {
              const id = source.kind === 'user' ? source.reference : 0n // Impossible case, but TS requires the check
              let sourceLoc = sourceMap.get(id)
              if (!sourceLoc) {
                console.error(`No source location found for ${id}. Please report a bug.`)
                return unknownLoc
              } else {
                return sourceLoc
              }
            })

            return { explanation: msg, locs }
          })
        })
      })).mapLeft(errors => errors.flat())

    const resolutionResult: Either<ErrorMessage[], void> =
      resolveNames(module, definitions, scopeTree).mapLeft(errors => {
        // Build error message with resolution explanation and the location obtained from sourceMap
        return errors.map(error => {
          const msg = `Failed to resolve ` +
            (error.kind === 'type' ? 'type alias' : 'name') +
            ` ${error.name} in definition for ${error.definitionName}, ` +
            `in module ${error.moduleName}`
          const id = error.reference
          if (id) {
            const sourceLoc = sourceMap.get(id)
            if (!sourceLoc) {
              console.error(`No source location found for ${id}. Please report a bug.`)
            }
            const loc = sourceLoc ?? unknownLoc
            return { explanation: msg, locs: [loc] }
          } else {
            return { explanation: msg, locs: [] }
          }
        })
      })

    return mergeInMany([importResult, conflictResult, resolutionResult])
      .chain(([table, _, __]) => result.map(r => ({ ...phase1Data, table: new Map([...r.table, ...table]) })))
      .mapLeft(errors => errors.flat())
  }, right({ table: new Map<string, LookupTable>(), ...phase1Data }))
}

export function compactSourceMap(sourceMap: Map<bigint, Loc>): { sourceIndex: any, map: any } {
  // Collect all sources in order to index them
  const sources: string[] = Array.from(sourceMap.values()).map(loc => loc.source)

  // Initialized two structures to be outputed
  const compactedSourceMap: Map<bigint, any[]> = new Map<bigint, number[]>()
  const sourcesIndex: Map<number, string> = new Map<number, string>()

  // Build a compacted version of the source map with array elements
  sourceMap.forEach((value, key) => {
    compactedSourceMap.set(key, [sources.indexOf(value.source), value.start, value.end ? value.end : {}])
  })

  // Build an index from ids to source
  sources.forEach((source) => {
    sourcesIndex.set(sources.indexOf(source), source)
  })

  return { sourceIndex: Object.fromEntries(sourcesIndex), map: Object.fromEntries(compactedSourceMap) }
}

// setup a Quint parser, so it can be used to parse from various non-terminals
function setupParser(text: string,
  sourceLocation: string, errorMessages: ErrorMessage[]): p.QuintParser {
  // error listener to report lexical and syntax errors
  const errorListener: any = {
    syntaxError: (recognizer: any,
      offendingSymbol: any,
      line: number,
      charPositionInLine: number,
      msg: string) => {
      const len = offendingSymbol
        ? offendingSymbol.stopIndex - offendingSymbol.startIndex
        : 0
      const index = offendingSymbol ? offendingSymbol.startIndex : 0
      const start = { line: line - 1, col: charPositionInLine, index }
      const end = { line: line - 1, col: charPositionInLine + len, index: index + len }
      errorMessages.push({ explanation: msg, locs: [{ source: sourceLocation, start, end }] })
    },
  }

  // Create the lexer and parser
  const inputStream = CharStreams.fromString(text)
  const lexer = new QuintLexer(inputStream)
  // remove the console listener and add our listener
  lexer.removeErrorListeners()
  lexer.addErrorListener(errorListener)

  const tokenStream = new CommonTokenStream(lexer)
  const parser = new p.QuintParser(tokenStream)

  // remove the console listener and add our listener
  parser.removeErrorListeners()
  parser.addErrorListener(errorListener)

  return parser
}

// a simple listener to figure out what has been parsed
class ProbeListener implements QuintListener {
  result: ParseProbeResult = {
    kind: 'error',
    messages: [{
      explanation: 'unknown parse result',
      locs: [],
    }],
  }

  exitUnitOrExpr(ctx: p.UnitOrExprContext) {
    if (ctx.unit()) {
      this.result = { kind: 'toplevel' }
    } else {
      this.result = { kind: 'expr' }
    }
  }
}
