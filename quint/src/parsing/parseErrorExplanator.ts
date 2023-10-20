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

import grammar from '../generated/quint.ohm-bundle'
import { QuintError } from '../quintError';

/**
 * Run a parser and produce nice error messages.
 * 
 * @param text the input text to parse
 * @returns an array of error messages
 */
export function explainParseErrors(text: string): QuintError[] {
    // run the ohmjs parser to explain errors
    const r = grammar.match(text)
    if (r.failed()) {
      console.log(r.message)
    }

    return []
}