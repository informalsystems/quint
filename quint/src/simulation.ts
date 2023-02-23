/*
 * A state-machine simulator.
 *
 * Igor Konnov, 2023
 *
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { Either, left, right } from '@sweet-monads/either'

import { compileFromCode, contextLookup } from './runtime/compile'
import { ErrorMessage } from './quintParserFrontend'
import { QuintEx } from './quintIr'

/**
 * Various settings that have to be passed to the simulator to run.
 */
export interface SimulatorSettings {
  init: string,
  step: string,
  invariants: string[],
  maxSamples: number,
  maxSteps: number,
}

/**
 * A result returned by the simulator.
 */
export interface SimulatorResult {
  status: 'ok' | 'violation',
  trace: QuintEx
}

/**
 * Run a test suite of a single module.
 *
 * @param code the source code of the modules
 * @param mainName the module that should be used as a state machine
 * @param settings simulator settings
 * @returns either error messages (left),
    or the trace as an expression (right)
 */
export function
compileAndRun(code: string,
              mainName: string,
              settings: SimulatorSettings):
                Either<ErrorMessage[], SimulatorResult> {
  // Once we have 'import from ...' implemented, we should pass
  // a filename instead of the source code (see #8)

  // Parse the code once again, but this time include the special definitions
  // that are required by the runner.
  // This code should be revisited in #618.
  const s = settings
  const wrappedCode =
`${code}

module __run__ {
  import ${mainName}.*

  def _test(__nruns, __nsteps, __init, __next, __inv) = false;

  def __invariants = all {
    ${s.invariants.join(',\n    ')}
  }

  val __runResult =
    _test(${s.maxSamples}, ${s.maxSteps}, "${s.init}", "${s.step}", "__invariants")
}
`

  const ctx = compileFromCode(wrappedCode, '__run__')

  if (ctx.compileErrors.length > 0
      || ctx.syntaxErrors.length > 0
      || ctx.analysisErrors.length > 0) {
    return left(ctx.syntaxErrors
                .concat(ctx.analysisErrors)
                .concat(ctx.compileErrors))
  } else {
    // evaluate __runResult
    const res: Either<ErrorMessage[], boolean> =
      contextLookup(ctx, '__run__', '__runResult', 'callable')
        .mapLeft(msg => [{ explanation: msg, locs: [] }] as ErrorMessage[])
        .map(comp => {
          const result = comp.eval()
          if (result.isNone()) {
            return left(ctx.runtimeErrors)
          }

          const ex = result.unwrap().toQuintEx()
          if (ex.kind !== 'bool') {
            return left([{
              explanation: 'Expected a Boolean results',
              locs: [],
            }])
          } else {
            return right(ex.value)
          }
        })
        .join()

    return res.map(hasViolation => {
        // evaluate _lastTrace
        return contextLookup(ctx, '__run__', '__runResult', 'callable')
          .map(comp => {
            const result = comp.eval()
            if (result.isNone()) {
              return left(ctx.runtimeErrors)
            } else {
              return right({
                status: hasViolation ? 'violation' : 'ok',
                trace: result.unwrap().toQuintEx(),
              } as SimulatorResult)
            }
          })
          .mapLeft(msg => [{ explanation: msg, locs: [] }])
          .join()
      })
      .join()
  }
}

