/* ----------------------------------------------------------------------------------
 * Copyright 2023 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
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
  /** Source locations where the error occurred (usually just one) */
  locs: Loc[]
  /** Optional call stack trace showing where user-defined functions were called, from innermost to outermost */
  traceLocs?: Loc[]
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
    // Prefer trace[0] (Rust backend), fall back to reference (TS backend)
    const errorId = error.trace?.[0] ?? error.reference
    const loc = errorId ? sourceMap.get(errorId) : undefined

    // If using trace, skip first element (error location) and use rest as call stack
    const traceRest = error.trace?.slice(1)
    const traceLocs = traceRest && traceRest.length > 0
      ? compact(traceRest.map(id => sourceMap.get(id)))
      : undefined

    return {
      explanation: quintErrorToString(error),
      locs: compact([loc]),
      traceLocs,
    }
  }
}

// the default error location that usually indicates a bug in our code
const unknownLoc: Loc = {
  source: '<unknown>',
  start: { line: 0, col: 0, index: 0 },
}
