/* ----------------------------------------------------------------------------------
 * Copyright 2022 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
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
import JSONbig from 'json-bigint'
import chalk from 'chalk'

import { ErrorMessage } from './ErrorMessage'
import lineColumn from 'line-column'

/** Generate a string with formatted error reporting for a given error message
 *
 * @param code a map from all possible loc sources to their file contents
 * @param finders a map of from all possible loc sources to a line-column lib
 *   finder object created from the text for that source, used as cached maps of indexes
 * @param message the error message to be reported
 * @param lineOffset a maybe number to add to line numbers in error messages,
 *        the default value is `just(1)`.
 *        No source info is printed if `lineOffset == none()`.
 *
 * @returns a formatted string with error information
 * */
export function formatError(
  code: Map<string, string>,
  finders: Map<string, any>,
  message: ErrorMessage,
  lineOffset: Maybe<number> = just(1)
): string {
  if (message.locs.length === 0) {
    return `error: ${message.explanation}`
  }

  try {
    // try to extract the location of the error
    let output = message.locs.reduce((output, loc) => {
      const text = code.get(loc.source)!
      const finder = finders.get(loc.source)!

      // Error message first
      output += `\n Error [${message.explanation.match(/\[([^\]]+)\]/)?.[1] || 'QNT000'}]: ${message.explanation.replace(/\[[^\]]+\]\s*/, '')}\n`

      // Location below, indented
      const locString = lineOffset.isJust()
        ? `${loc.source}:${loc.start.line + lineOffset.value}:${loc.start.col + 1}`
        : `${loc.source}:${loc.start.line}:${loc.start.col + 1}`
      output += `\n  at ${locString}\n`

      const endLine = loc.end ? loc.end.line : loc.start.line
      const endCol = loc.end ? loc.end.col : loc.start.col
      for (let i = loc.start.line; i <= endLine; i++) {
        // finder's indexes start at 1
        const lineStartIndex = finder.toIndex(i + 1, 1)
        const line = text.slice(lineStartIndex).split('\n')[0]

        const lineStartCol = i === loc.start.line ? loc.start.col : 0
        const lineEndCol = i === endLine ? endCol : line.length - 1

        const lineIndex = lineOffset.map(offs => offs + i)
        output += formatLine(lineIndex, lineStartCol, lineEndCol, line, 2)
      }
      return output
    }, '')

    // Append call stack trace if available
    if (message.traceLocs && message.traceLocs.length > 0) {
      for (const loc of message.traceLocs) {
        const text = code.get(loc.source)
        const finder = finders.get(loc.source)
        if (!text || !finder) continue

        const locString = lineOffset.isJust()
          ? `${loc.source}:${loc.start.line + lineOffset.value}:${loc.start.col + 1}`
          : `${loc.source}:${loc.start.line}:${loc.start.col + 1}`

        // Get the code snippet and extract the problematic expression
        const i = loc.start.line
        const lineStartIndex = finder.toIndex(i + 1, 1)
        const fullLine = text.slice(lineStartIndex).split('\n')[0]
        const lineStartCol = loc.start.col
        const endLine = loc.end ? loc.end.line : loc.start.line
        const lineEndCol = i === endLine && loc.end ? loc.end.col : fullLine.length - 1

        // Extract parts: before, highlighted expression, after
        const before = fullLine.slice(0, lineStartCol).trimStart()
        const expr = fullLine.slice(lineStartCol, lineEndCol + 1)
        const after = fullLine.slice(lineEndCol + 1).trimEnd()

        // Format: "at expression (location)" - JavaScript style
        const codeLine = before + expr + after
        output += chalk.gray(`    at `) + chalk.gray.bold(expr) + chalk.gray(` (${locString})\n`)
      }
    }

    return output
  } catch (error: any) {
    // If it happens that an error occurs during the error reconstruction,
    // print that we could not construct a good explanation, instead of throwing.
    console.error('\nSomething unexpected happened during error reconstruction. Please report a bug.\n')
    console.error('Include this in the bug report: {')
    console.trace(error.message)
    console.log('Trying to format', JSONbig.stringify(message.locs))
    console.error('} // end of the bug report\n')

    // return the bare bones error message
    return `error: ${message.explanation}`
  }
}

/**
 * Create line column finders (from the line-column lib) for each file in a map.
 *
 * @param sourceCode - a map of file names to their contents
 *
 * @returns a map of file names to their finders
 */
export function createFinders(sourceCode: Map<string, string>): Map<string, any> {
  return new Map([...sourceCode.entries()].map(([path, code]) => [path, lineColumn(code)]))
}

function formatLine(lineIndex: Maybe<number>, startCol: number, endCol: number, line: string, indent: number = 0): string {
  let output = ''
  const indentStr = ' '.repeat(indent)
  const lineNumberIndicator = lineIndex.isJust() ? `${lineIndex.value}: ` : ''
  output += `${indentStr}${lineNumberIndicator}${line}\n`
  // Add margin according to indent + how much space the indicator takes
  output += ' '.repeat(indent + lineNumberIndicator.length)

  // Write ^ characters for columns that should be highlighted in this line
  output += ' '.repeat(startCol)
  output += '^'.repeat(1 + endCol - startCol)
  output += '\n'
  return output
}
