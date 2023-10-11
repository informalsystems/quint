/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Error messages with source locations.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { compact } from 'lodash'
import { QuintError, quintErrorToString } from './quintError'

/**
 * An error message whose locations have been resolved.
 */
export interface ErrorMessage {
  explanation: string
  locs: Loc[]
}

export interface Loc {
  source: string
  start: { line: number; col: number; index: number }
  end?: { line: number; col: number; index: number }
}

/**
 * Map an identifier to the corresponding location in the source map, if possible.
 * @param sourceMap the source map
 * @param id the identifier to map
 * @returns the location, if found in the map, or the unknown location
 */
export function sourceIdToLoc(sourceMap: Map<bigint, Loc>, id: bigint): Loc {
  let sourceLoc = sourceMap.get(id)
  if (!sourceLoc) {
    console.error(`No source location found for ${id}. Please report a bug.`)
    return unknownLoc
  } else {
    return sourceLoc
  }
}

export function fromQuintError(sourceMap: Map<bigint, Loc>): (_: QuintError) => ErrorMessage {
  return error => {
    const loc = error.reference ? sourceMap.get(error.reference) : undefined
    return {
      explanation: quintErrorToString(error),
      locs: compact([loc]),
    }
  }
}

// the default error location that usually indicates a bug in our code
const unknownLoc: Loc = {
  source: '<unknown>',
  start: { line: 0, col: 0, index: 0 },
}
