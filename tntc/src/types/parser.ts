/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Parsing for types. To be used internally for the moment.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { TntLexer } from '../generated/TntLexer'
import * as p from '../generated/TntParser'
import { TntListener } from '../generated/TntListener'
import { ToIrListener } from '../ToIrListener'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { CharStreams, CommonTokenStream } from 'antlr4ts'
import { Row, TntType } from '../tntTypes'

import { Either, left, right } from '@sweet-monads/either'

/**
 * Parses a type represented as a string into an Type
 *
 * @param typeString the string to be parsed
 *
 * @returns the parsed type when the string is a valid type.
 *          Otherwise, a list of parsing errors.
 */
export function parseType(typeString: string): Either<any[], TntType> {
  const errorMessages: any[] = []
  // error listener to report lexical and syntax errors
  const errorListener: any = {
    syntaxError: (_: any,
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
      errorMessages.push({ explanation: msg, locs: [{ start, end }] })
    },
  }

  // Create the lexer and parser
  const inputStream = CharStreams.fromString(typeString)
  const lexer = new TntLexer(inputStream)
  // remove the console listener and add our listener
  lexer.removeErrorListeners()
  lexer.addErrorListener(errorListener)

  const tokenStream = new CommonTokenStream(lexer)
  const parser = new p.TntParser(tokenStream)

  // remove the console listener and add our listener
  parser.removeErrorListeners()
  parser.addErrorListener(errorListener)
  // run the parser
  const tree = parser.type()
  if (errorMessages.length > 0) {
    // report the errors
    return left(errorMessages)
  } else {
    // walk through the AST and construct the IR
    const listener = new ToIrListener('')
    ParseTreeWalker.DEFAULT.walk(listener as TntListener, tree)
    const rootType = listener.typeStack[listener.typeStack.length - 1]

    if (listener.errors.length > 0) {
      return left(listener.errors)
    } else if (rootType) {
      return right(rootType)
    } else {
      throw new Error(`No type found in ${typeString}`)
    }
  }
}

export function parseTypeOrThrow(type: string): TntType {
  const result = parseType(type)

  if (result.isRight()) {
    const { value } = result
    return value
  } else {
    throw new Error(`Could not parse type: ${type} `)
  }
}

export function parseRowOrThrow(row: string): Row {
  const result = parseType(`{ ${row} }`)

  if (result.isRight() && result.value.kind === 'rec') {
    return result.value.fields
  } else {
    throw new Error(`Could not parse row: ${row} `)
  }
}
