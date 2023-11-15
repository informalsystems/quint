/*
 * An error explanation framework that uses an auxilliary parser.
 *
 * Igor Konnov, 2023
 *
 * The project QuintLang.
 * Authors: Igor Konnov, 2023.
 * Copyright [2023] Informal Systems.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { Pos } from '../ErrorMessage';
import grammar from '../generated/quint.ohm-bundle'
import { QuintError } from '../quintError';

/**
 * Run a parser and produce nice error messages.
 * 
 * @param text the input text to parse
 * @returns an array of error messages
 */
export function explainParseErrors(text: string, registerLoc: (s: Pos, e: Pos) => bigint): QuintError[] {
    // run the ohmjs parser to explain errors
    const r = grammar.match(text)
    if (r.failed()) {
      // TODO: ohmjs always returns the rightmost failing point.
      // Hence, we cannot produce an interval.
      const point = r.getInterval().collapsedLeft().getLineAndColumn()
      const start = { line: point.lineNum - 1, col: point.colNum - 1, index: point.offset }
      const end = { line: point.lineNum - 1, col: point.colNum, index: point.offset }
      const referenceId = registerLoc(start, end)
      const msg = r.message ?? 'unknown error'
      return [{ code: 'QNT000', message: msg, reference: referenceId }]
    }

    return []
}