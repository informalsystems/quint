/*
 * An error explanation framework.
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
      const left = r.getInterval().collapsedLeft().getLineAndColumn()
      const right = r.getInterval().collapsedRight().getLineAndColumn()

      const start = { line: left.lineNum, col: left.colNum, index: left.offset }
      const end = { line: right.lineNum - 1, col: right.colNum, index: right.offset }
      const referenceId = registerLoc(start, end)
      const msg = r.message ?? 'unknown error'
      return [{ code: 'QNT000', message: msg, reference: referenceId }]
    }

    return []
}