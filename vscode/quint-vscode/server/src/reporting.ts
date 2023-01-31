/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Formating of errors and results to LSP-friendly structures
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { ErrorTree, Loc, QuintModule, errorTreeToString, findExpressionWithId } from "@informalsystems/quint"
import { Diagnostic, DiagnosticSeverity, Position, Range } from "vscode-languageserver"
import { compact } from "lodash"

/**
 * Assembles a list of diagnostics from pairs of expression ids and their errors
 * using a source map
 *
 * @param errors the errors to be transformed
 * @param sourceMap the source map for the document in which the errors occured
 *
 * @returns a list of diagnostics with the proper error messages and locations
 */
export function diagnosticsFromErrors(errors: [bigint, ErrorTree][], sourceMap: Map<bigint, Loc>): Diagnostic[] {
  const diagnostics = errors.map(([id, error]) => {
    const loc = sourceMap.get(id)!
    if (!loc) {
      console.log(`loc for ${id} not found in source map`)
    } else {
      return assembleDiagnostic(errorTreeToString(error), loc)
    }
  })

  return compact(diagnostics)
}

/**
 * Assembles a diagnostic object from an error message and its location
 * @param explanation the diagnostic message
 * @param loc the location in which to report the diagnostic
 *
 * @returns a diagnostic object with the provided information
 */
export function assembleDiagnostic(explanation: string, loc: Loc): Diagnostic {
  return {
    severity: DiagnosticSeverity.Error,
    range: locToRange(loc),
    message: explanation,
    source: 'parser',
  }
}

/** Finds the name of the expression at a given position in a module
 *
 * @param module the module in which to search for the expression
 * @param sources the source map for the module in the form of a list of tuples
 * @param position the position for which to find the expression
 *
 * @returns the name of the expression at the given position, or undefined if
 * the position is not under a name expression or an operator application
 */
export function findName(
  modules: QuintModule[], sources: [Loc, bigint][], position: Position
): [QuintModule, string, bigint] | undefined {
  const ids = resultsOnPosition(sources, position)
  const names = ids.flatMap(([_loc, id]) => {
    return modules.filter(module => module.id > id).map((module): ([QuintModule, string, bigint] | undefined) => {
      const expr = findExpressionWithId(module, id)

      switch (expr?.kind) {
        case 'name':
          return [module, expr.name, expr.id]
        case 'app':
          return [module, expr.opcode, expr.id]
      }
    })
  })

  return compact(names)[0]
}

/**
 * Finds the result that better matches a given position. That is, the result
 * for which the loc is the smallest loc that contains the position.
 *
 * @param sourceMap the source map with the locs for the results
 * @param results the list of tuples of ids from the source map and a result
 * computed for it
 * @param position the position for which to find the result
 *
 * @returns a tuple with the location and the result from the list that better
 * matches the position, or undefined if none is found
 */
export function findBestMatchingResult<T>(
  sourceMap: Map<bigint, Loc>, results: [bigint, T][], position: Position
): [Loc, T] {
  const resultsByLoc: [Loc, T][] = results.map(([id, result]) => [sourceMap.get(id)!, result])
  return resultsOnPosition(resultsByLoc, position)[0]
}

/**
 * Converts a Quint location to a LSP range
 *
 * @param loc the quint location to be converted
 *
 * @returns a LSP range with corresponding start and end positions
 */
export function locToRange(loc: Loc): Range {
  return {
    start: { line: loc.start.line, character: loc.start.col },
    end: {
      line: loc.end ? loc.end.line : loc.start.line,
      character: loc.end ? loc.end.col + 1 : loc.start.col,
    },
  }
}

function resultsOnPosition<T>(results: [Loc, T][], position: Position): [Loc, T][] {
  const filteredResults = results.filter(([loc, _result]) => {
    // Position is part of effect's expression range
    return (position.line >= loc.start.line && (!loc.end || position.line <= loc.end.line) &&
      position.character >= loc.start.col && (!loc.end || position.character <= loc.end.col))
  })

  // Sort effects by range size. We want to show the most specific effect for the position.
  const sortedResults = filteredResults.sort(([a, _r1], [b, _r2]) => {
    if (!a.end) {
      return -1
    } else if (!b.end) {
      return 1
    } else if (a.end.index - a.start.index > b.end.index - b.start.index) {
      return 1
    } else {
      return -1
    }
  })

  return sortedResults
}
