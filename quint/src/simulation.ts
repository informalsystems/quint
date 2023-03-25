/*
 * A state-machine simulator.
 *
 * Igor Konnov, 2023
 *
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { Either } from '@sweet-monads/either'
import { Maybe, none } from '@sweet-monads/maybe'
import { strict as assert } from 'assert'
import { range } from 'lodash'
import chalk from 'chalk'

import {
  compileFromCode, contextNameLookup, lastTraceName
} from './runtime/compile'
import { ErrorMessage } from './quintParserFrontend'
import { QuintApp, QuintEx } from './quintIr'
import { Computable, EvalResult } from './runtime/runtime'
import { ExecutionFrame } from './runtime/trace'
import { chalkQuintEx } from './repl'
import { IdGenerator, zeroIdGen } from './idGenerator'

/**
 * Various settings that have to be passed to the simulator to run.
 */
export interface SimulatorOptions {
  init: string,
  step: string,
  invariant: string,
  maxSamples: number,
  maxSteps: number,
  rand: () => number,
}

export type SimulatorResultStatus =
  'ok' | 'violation' | 'failure' | 'error'

/**
 * A result returned by the simulator.
 */
export interface SimulatorResult {
  status: SimulatorResultStatus,
  vars: string[],
  states: QuintEx[],
  frames: ExecutionFrame[],
  errors: ErrorMessage[],
}

function errSimulationResult(status: SimulatorResultStatus,
                             errors: ErrorMessage[]): SimulatorResult {
  return {
    status: 'failure',
    vars: [],
    states: [],
    frames: [],
    errors: errors,
  }
}

export function
printFrame(out: (line: string) => void, frame: ExecutionFrame, indent: number) {
  const args =
    frame.args.map(a => chalkQuintEx(a.toQuintEx(zeroIdGen))).join(', ')
  const r =
    frame.result.isNone()
      ? 'none'
      : chalkQuintEx(frame.result.value.toQuintEx(zeroIdGen))
  out("-> ".padStart(indent + 3, '-') + `${frame.app.opcode}(${args}) => ${r}`)
  frame.subframes.forEach(f => printFrame(out, f, indent + 1))
}

/**
 * Print a trace with chalk.
 */
export function printTrace(out: (line: string) => void,
                           result: SimulatorResult) {
  const colon = chalk.gray(':')
  result.states.forEach((state, index) => {
    assert(state.kind === 'app'
           && state.opcode === 'Rec' && state.args.length % 2 === 0)

    if (index < result.frames.length) {
      printFrame(out, result.frames[index], 0)
    }

    out('----')
    range(0, Math.trunc(state.args.length / 2))
      .forEach(i => {
        const key = state.args[2 * i]
        assert(key.kind === 'str')
        const valueText = chalkQuintEx(state.args[2 * i + 1])
        out(`${key.value}${colon} ${valueText}`)
      })
    out('----\n')
  })
}

/**
 * Execute a run.
 *
 * @param idGen a unique generator of identifiers
 * @param code the source code of the modules
 * @param mainName the module that should be used as a state machine
 * @param options simulator settings
 * @returns either error messages (left),
    or the trace as an expression (right)
 */
export function
compileAndRun(idGen: IdGenerator,
              code: string,
              mainName: string,
              options: SimulatorOptions): SimulatorResult {
  // Once we have 'import from ...' implemented, we should pass
  // a filename instead of the source code (see #8)

  // Parse the code once again, but this time include the special definitions
  // that are required by the runner.
  // This code should be revisited in #618.
  const o = options
  const wrappedCode =
`${code}

module __run__ {
  import ${mainName}.*

  val ${lastTraceName} = [];
  def _test(__nrunsArg, __nstepsArg, __initArg, __nextArg, __invArg) = false;
  action __init = { ${o.init} }
  action __step = { ${o.step} }
  val __inv = { ${o.invariant} }
  val __runResult =
    _test(${o.maxSamples}, ${o.maxSteps}, __init, __step, __inv)
}
`

  const recorder = newTraceRecorder()
  const ctx = compileFromCode(idGen,
    wrappedCode, '__run__', recorder, options.rand)

  if (ctx.compileErrors.length > 0
      || ctx.syntaxErrors.length > 0
      || ctx.analysisErrors.length > 0) {
    const errors =
      ctx.syntaxErrors
        .concat(ctx.analysisErrors)
        .concat(ctx.compileErrors)
    return errSimulationResult('error', errors)
  } else {
    // evaluate __runResult, which triggers the simulator
    const res: Either<string, Computable> =
      contextNameLookup(ctx, '__runResult', 'callable')
    if (res.isLeft()) {
      const errors = [{ explanation: res.value, locs: [] }] as ErrorMessage[]
      return errSimulationResult('error', errors)
    } else {
      const _ = res.value.eval()
    }

    const frame = recorder.getBestTrace()
    let status: SimulatorResultStatus = 'failure'
    if (frame.result.isJust()) {
      const ex = frame.result.unwrap().toQuintEx(idGen)
      if (ex.kind === 'bool') {
        status = ex.value ? 'ok' : 'violation'
      }
    }

    return {
      status: status,
      vars: ctx.vars,
      states: frame.args.map(e => e.toQuintEx(idGen)),
      frames: frame.subframes,
      errors: ctx.getRuntimeErrors(),
    }
  }
}

// a trace recording listener
const newTraceRecorder = () => {
  // the bottom frame encodes the whole trace
  const bottomFrame = (): ExecutionFrame => {
    return {
      // this is just a dummy operator application
      app: { id: 0n, kind: 'app', opcode: 'Rec', args: [] },
      // we will store the sequence of states here
      args: [],
      // the result of the trace evaluation
      result: none(),
      // and here we store the subframes for the top-level actions
      subframes: [],
    }
  }

  // the best trace is stored here
  let bestTrace = bottomFrame()
  // during simulation, a trace is built here
  let frameStack: ExecutionFrame[] = [ bestTrace ]

  return {
    getBestTrace: (): ExecutionFrame => {
      return bestTrace
    },

    onUserOperatorCall: (app: QuintApp, args: EvalResult[]) => {
      const newFrame = { app: app, args: args, result: none(), subframes: [] }
      if (frameStack.length > 0) {
        frameStack[frameStack.length - 1].subframes.push(newFrame)
        frameStack.push(newFrame)
      }
    },

    onUserOperatorReturn: (app: QuintApp, result: Maybe<EvalResult>) => {
      const top = frameStack.pop()
      if (top) {
        // since this frame is connected via the parent frame,
        // the result will not disappear
        top.result = result
      }
    },

    onAnyReturn: (noptions: number, choice: number) => {
      assert(frameStack.length > 0)
      const top = frameStack[frameStack.length - 1]
      const start = top.subframes.length - noptions
      // leave only the chosen frame as well as the older ones
      top.subframes =
        top.subframes.filter((_, i) => i < start || i == start + choice)
    },

    onRunCall: () => {
      // reset the stack
      frameStack = [ bottomFrame() ]
    },

    onRunReturn: (outcome: Maybe<EvalResult>, trace: EvalResult[]) => {
      assert(frameStack.length > 0)
      const bottom = frameStack[0]
      bottom.result = outcome
      bottom.args = trace

      let failureOrViolation = true
      if (outcome.isJust()) {
        const r = outcome.value.toQuintEx({ nextId: () => 0n })
        failureOrViolation = (r.kind === 'bool') && !r.value
      }

      if (failureOrViolation) {
        if (bestTrace.args.length === 0
            || bestTrace.args.length >= bottom.args.length) {
          bestTrace = bottom
        }
      } else {
        if (bestTrace.args.length <= bottom.args.length) {
          bestTrace = bottom
        }
      }
    },
  }
}
