/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Human-friendly error reporting for Quint errors. From the read text and an error
 * message containing localization errors, fetch offending lines and highlights
 * offending sections with ^^^ strings.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { Maybe, just } from '@sweet-monads/maybe'

import { ErrorMessage } from './ErrorMessage'

/** Generate a string with formatted error reporting for a given error message
 *
 * @param text the string read from the source file for which the messages' location info points to
 * @param finder a line-column lib finder object created from text, used as a cached map of indexes
 * @param message the error message to be reported
 * @param lineOffset a maybe number to add to line numbers in error messages,
 *        the default value is `just(1)`.
 *        No source info is printed if `lineOffset == none()`.
 *
 * @returns a formatted string with error information
 * */
export function formatError(
  text: string,
  finder: any,
  message: ErrorMessage,
  lineOffset: Maybe<number> = just(1)
): string {
  if (message.locs.length === 0) {
    return `error: ${message.explanation}`
  }

  try {
    // try to extract the location of the error
    return message.locs.reduce((output, loc) => {
      // If lineOffset is a number, print the source location.
      // If lineOfsset is undefined, omit the source location (e.g., in REPL).
      const locString = lineOffset.isJust()
        ? `${loc.source}:${loc.start.line + lineOffset.value}:${loc.start.col + 1} - `
        : ''
      output += `${locString}error: ${message.explanation}\n`

      const endLine = loc.end ? loc.end.line : loc.start.line
      const endCol = loc.end ? loc.end.col : loc.start.col
      for (let i = loc.start.line; i <= endLine; i++) {
        // finder's indexes start at 1
        const lineStartIndex = finder.toIndex(i + 1, 1)
        const line = text.slice(lineStartIndex).split('\n')[0]

        const lineStartCol = i === loc.start.line ? loc.start.col : 0
        const lineEndCol = i === endLine ? endCol : line.length - 1

        const lineIndex = lineOffset.map(offs => offs + i)
        output += formatLine(lineIndex, lineStartCol, lineEndCol, line)
      }
      return output
    }, '')
  } catch (error: any) {
    // If it happens that an error occurs during the error reconstruction,
    // print that we could not construct a good explanation, instead of throwing.
    console.error('\nSomething unexpected happened during error reconstruction. Please report a bug.\n')
    console.error('Include this in the bug report: {')
    console.trace(error.message)
    console.error('} // end of the bug report\n')

    // return the bare bones error message
    return `error: ${message.explanation}`
  }
}

function formatLine(lineIndex: Maybe<number>, startCol: number, endCol: number, line: string): string {
  let output = ''
  const lineNumberIndicator = lineIndex.isJust() ? `${lineIndex.value}: ` : ''
  output += `${lineNumberIndicator}${line}\n`
  // Add margin according to how much space the indicator takes
  output += ' '.repeat(lineNumberIndicator.length)

  // Write ^ characters for columns that should be highlited in this line
  output += ' '.repeat(startCol)
  output += '^'.repeat(1 + endCol - startCol)
  output += '\n'
  return output
}
