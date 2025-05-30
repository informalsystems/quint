/* ----------------------------------------------------------------------------------
 * Copyright 2022-2024 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * An evaluator for Quint in Node TS runtime.
 *
 * Testing and simulation are heavily based on the original `compilerImpl.ts` file written by Igor Konnov.
 *
 * @author Igor Konnov, Gabriela Moreira
 *
 * @module
 */

import { Either, left, right } from '@sweet-monads/either'
import { QuintApp, QuintEx } from '../../ir/quintIr'
import { LookupDefinition, LookupTable } from '../../names/base'
import { QuintError } from '../../quintError'
import { TraceRecorder } from '../trace'
import { Trace } from './trace'
import { RuntimeValue, rv } from './runtimeValue'
import { Context } from './Context'
import { TestResult } from '../testing'
import { Rng } from '../../rng'
import { zerog } from '../../idGenerator'
import { List } from 'immutable'
import { Builder, buildDef, buildExpr, nameWithNamespaces } from './builder'
import { Presets, SingleBar } from 'cli-progress'
import { SimulationResult } from '../../simulation'

/**
 * An evaluator for Quint in Node TS runtime.
 */
export class Evaluator {
  public ctx: Context
  public recorder: TraceRecorder
  private rng: Rng
  private builder: Builder

  /**
   * Constructs an Evaluator that can be re-used across evaluations.
   *
   * @param table - The lookup table for definitions.
   * @param recorder - The trace recorder to log evaluation traces.
   * @param rng - The random number generator to use for evaluation.
   * @param storeMetadata - Optional, whether to store `actionTaken` and `nondetPicks`. Default is false.
   */
  constructor(table: LookupTable, recorder: TraceRecorder, rng: Rng, storeMetadata: boolean = false) {
    this.recorder = recorder
    this.rng = rng
    this.builder = new Builder(table, storeMetadata)
    this.ctx = new Context(recorder, rng.next, this.builder.varStorage)
  }

  /**
   * Get the current trace from the context
   */
  get trace(): Trace {
    return this.ctx.trace
  }

  /**
   * Update the lookup table, if the same table is used for multiple evaluations but there are new definitions.
   *
   * @param table
   */
  updateTable(table: LookupTable) {
    this.builder.table = table
  }

  /**
   * Shift the context to the next state. That is, updated variables in the next state are moved to the current state,
   * and the trace is extended.
   */
  shift(): void {
    this.ctx.shift()
  }

  /**
   * Shift the context to the next state. That is, updated variables in the next state are moved to the current state,
   * and the trace is extended.
   *
   * @returns names of the variables that don't have values in the new state.
   */
  shiftAndCheck(): string[] {
    const missing = this.ctx.varStorage.nextVars.filter(reg => reg.value.isLeft())

    if (missing.size === this.ctx.varStorage.vars.size) {
      // Nothing was changed, don't shift
      return []
    }

    this.shift()
    return missing
      .valueSeq()
      .map(reg => reg.name)
      .toArray()
  }

  /**
   * Evaluate a Quint expression.
   *
   * @param expr
   * @returns the result of the evaluation, if successful, or an error if the evaluation failed.
   */
  evaluate(expr: QuintEx): Either<QuintError, QuintEx> {
    if (expr.kind === 'app' && (expr.opcode == 'q::test' || expr.opcode === 'q::testOnce')) {
      return this.evaluateSimulation(expr)
    }

    const value = buildExpr(this.builder, expr)(this.ctx)

    return value.map(rv.toQuintEx)
  }

  /**
   * Reset the evaluator to its initial state (in terms of trace and variables)
   */
  reset() {
    this.trace.reset()
    this.builder.varStorage.reset()
  }

  /**
   * Simulates the execution of an initial expression followed by a series of step expressions,
   * while checking an invariant expression at each step. The simulation is run multiple times,
   * up to a specified number of runs, and each run is executed for a specified number of steps.
   * The simulation stops if a specified number of traces with errors are found.
   *
   * @param init - The initial expression to evaluate.
   * @param step - The step expression to evaluate repeatedly.
   * @param inv - The invariant expression to check after each step.
   * @param nruns - The number of simulation runs to perform.
   * @param nsteps - The number of steps to perform in each simulation run.
   * @param ntraces - The number of error traces to collect before stopping the simulation.
   * @returns a boolean expression indicating whether all simulations passed without errors,
              or an error if the simulation cannot be completed.
   */
  simulate(
    init: QuintEx,
    step: QuintEx,
    inv: QuintEx,
    witnesses: QuintEx[],
    nruns: number,
    nsteps: number,
    ntraces: number
  ): Either<QuintError, SimulationResult> {
    let errorsFound = 0
    let failure: QuintError | undefined = undefined

    const progressBar = new SingleBar(
      {
        clearOnComplete: true,
        forceRedraw: true,
        format: 'Running... [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} samples',
      },
      Presets.rect
    )
    progressBar.start(Number(nruns), 0)

    const initEval = buildExpr(this.builder, init)
    const stepEval = buildExpr(this.builder, step)
    const invEval = buildExpr(this.builder, inv)
    const witnessesEvals = witnesses.map(w => buildExpr(this.builder, w))
    const witnessingTraces = new Array(witnesses.length).fill(0)

    let runNo = 0
    for (; errorsFound < ntraces && !failure && runNo < nruns; runNo++) {
      progressBar.update(runNo)
      const traceWitnessed = new Array(witnesses.length).fill(false)

      this.recorder.onRunCall()
      this.reset()
      // Mocked def for the trace recorder
      const initApp: QuintApp = { id: 0n, kind: 'app', opcode: 'q::initAndInvariant', args: [] }
      this.recorder.onUserOperatorCall(initApp)

      const initResult = initEval(this.ctx).mapLeft(error => (failure = error))
      if (!isTrue(initResult)) {
        this.recorder.onUserOperatorReturn(initApp, [], initResult)
      } else {
        this.shift()

        const invResult = invEval(this.ctx).mapLeft(error => (failure = error))
        this.recorder.onUserOperatorReturn(initApp, [], invResult)
        if (!isTrue(invResult)) {
          errorsFound++
        } else {
          // check all { step, shift(), inv } in a loop
          for (let i = 0; errorsFound < ntraces && !failure && i < nsteps; i++) {
            const stepApp: QuintApp = {
              id: 0n,
              kind: 'app',
              opcode: 'q::stepAndInvariant',
              args: [],
            }
            this.recorder.onUserOperatorCall(stepApp)

            const stepResult = stepEval(this.ctx).mapLeft(error => (failure = error))
            if (!isTrue(stepResult)) {
              // The run cannot be extended. In some cases, this may indicate a deadlock.
              // Since we are doing random simulation, it is very likely
              // that we have not generated good values for extending
              // the run. Hence, do not report an error here, but simply
              // drop the run. Otherwise, we would have a lot of false
              // positives, which look like deadlocks but they are not.

              this.recorder.onUserOperatorReturn(stepApp, [], stepResult)
              this.recorder.onRunReturn(right(rv.mkBool(true)), this.trace.get())
              break
            }

            this.shift()

            witnessesEvals.forEach((witnessEval, i) => {
              const witnessResult = witnessEval(this.ctx)
              if (isTrue(witnessResult)) {
                traceWitnessed[i] = true
              }
            })

            const invResult = invEval(this.ctx).mapLeft(error => (failure = error))
            if (!isTrue(invResult)) {
              errorsFound++
            }
            this.recorder.onUserOperatorReturn(stepApp, [], invResult)
          }

          traceWitnessed.forEach((witnessed, i) => {
            if (witnessed) {
              witnessingTraces[i] = witnessingTraces[i] + 1
            }
          })
        }
      }

      const outcome = failure ? left(failure) : right(rv.mkBool(errorsFound == 0))
      this.recorder.onRunReturn(outcome, this.trace.get())
    }
    progressBar.stop()

    return failure
      ? left(failure)
      : right({ result: { id: 0n, kind: 'bool', value: errorsFound == 0 }, witnessingTraces, samples: runNo })
  }

  /**
   * Run a specified test definition a given number of times, and report the result.
   *
   * @param testDef - The definition of the test to be run.
   * @param maxSamples - The maximum number of times to run the test.
   * @param onTrace - A callback function to be called with trace information for each test run.
   * @returns The result of the test, including its name, status, any errors, the seed used, frames,
              and the number of samples run.
   */
  test(
    testDef: LookupDefinition,
    maxSamples: number,
    onTrace: (name: string, status: string, vars: string[], states: QuintEx[]) => void
  ): TestResult {
    const name = nameWithNamespaces(testDef.name, List(testDef.namespaces))
    const progressBar = new SingleBar(
      {
        clearOnComplete: true,
        forceRedraw: true,
        format: '     {test} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} samples',
      },
      Presets.rect
    )

    progressBar.start(maxSamples, 0, { test: name })

    this.trace.reset()
    this.recorder.clear()

    // save the initial seed
    let seed = this.rng.getState()

    const testEval = buildDef(this.builder, testDef)

    let nsamples = 1
    // run up to maxSamples, stop on the first failure
    for (; nsamples <= maxSamples; nsamples++) {
      progressBar.update(nsamples, { test: name })
      // record the seed value
      seed = this.rng.getState()
      this.recorder.onRunCall()
      // reset the trace
      this.reset()
      // run the test
      const result = testEval(this.ctx)

      // extract the trace
      const trace = this.trace.get()
      if (trace.length > 0) {
        this.recorder.onRunReturn(result, trace)
      } else {
        this.recorder.onRunReturn(result, [])
      }

      const states = this.recorder.bestTraces[0]?.frame?.args?.map(rv.toQuintEx)
      const frames = this.recorder.bestTraces[0]?.frame?.subframes ?? []
      // evaluate the result
      if (result.isLeft()) {
        // if there was an error, return immediately
        progressBar.stop()
        return {
          name,
          status: 'failed',
          errors: [result.value],
          seed,
          frames,
          nsamples,
        }
      }

      const ex = result.value.toQuintEx(zerog)
      if (ex.kind !== 'bool') {
        // if the test returned a malformed result, return immediately
        progressBar.stop()
        return {
          name,
          status: 'ignored',
          errors: [],
          seed,
          frames,
          nsamples,
        }
      }

      if (!ex.value) {
        // if the test returned false, return immediately
        const error: QuintError = {
          code: 'QNT511',
          message: `Test ${name} returned false`,
          reference: testDef.id,
        }
        onTrace(name, 'failed', this.varNames(), states)
        progressBar.stop()
        return {
          name,
          status: 'failed',
          errors: [error],
          seed,
          frames,
          nsamples,
        }
      } else {
        if (this.rng.getState() === seed) {
          // This successful test did not use non-determinism.
          // Running it one time is sufficient.

          onTrace(name, 'passed', this.varNames(), states)
          progressBar.stop()
          return {
            name,
            status: 'passed',
            errors: [],
            seed: seed,
            frames,
            nsamples,
          }
        }
      }
    }

    // the test was run maxSamples times, and no errors were found
    const states = this.recorder.bestTraces[0]?.frame?.args?.map(rv.toQuintEx)
    const frames = this.recorder.bestTraces[0]?.frame?.subframes ?? []

    onTrace(name, 'passed', this.varNames(), states)

    progressBar.stop()
    return {
      name,
      status: 'passed',
      errors: [],
      seed: seed,
      frames,
      nsamples: nsamples - 1,
    }
  }

  /**
   * Variable names in context
   * @returns the names of all variables in the current context.
   */
  varNames() {
    return this.ctx.varStorage.vars
      .valueSeq()
      .toArray()
      .map(v => v.name)
  }

  /**
   * Special case of `evaluate` where the expression is a call to a simulation.
   *
   * @param expr
   * @returns the result of the simulation, or an error if the simulation cannot be completed.
   */
  private evaluateSimulation(expr: QuintApp): Either<QuintError, QuintEx> {
    if (expr.opcode === 'q::testOnce') {
      const [nsteps, ntraces, init, step, inv] = expr.args
      return this.simulate(init, step, inv, [], 1, toNumber(nsteps), toNumber(ntraces)).map(r => r.result)
    } else {
      const [nruns, nsteps, ntraces, init, step, inv] = expr.args
      return this.simulate(init, step, inv, [], toNumber(nruns), toNumber(nsteps), toNumber(ntraces)).map(r => r.result)
    }
  }
}

export function isTrue(value: Either<QuintError, RuntimeValue>): boolean {
  return value.isRight() && value.value.toBool() === true
}

export function isFalse(value: Either<QuintError, RuntimeValue>): boolean {
  return value.isRight() && value.value.toBool() === false
}

function toNumber(value: QuintEx): number {
  if (value.kind !== 'int') {
    throw new Error('Expected an integer')
  }
  return Number(value.value)
}
