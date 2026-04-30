/* ----------------------------------------------------------------------------------
 * Copyright 2025 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Wrapper for running one-shot commands using the Rust evaluator.
 * Handles both simulation (quint run) and testing (quint test).
 *
 * @author Gabriela Moreira
 *
 * @module
 */
import { QuintApp, QuintEx, QuintModule, QuintStr } from '../ir/quintIr'
import { Outcome } from '../simulation'
import { TraceHook } from '../cliReporting'
import { debugLog } from '../verbosity'
import JSONbig from 'json-bigint'
import { LookupDefinition, LookupTable } from '../names/base'
import { reviver } from '../jsonHelper'
import { ItfState, ItfValue, diagnosticsOfItf, ofItf, pendingDiagnosticsOfItf } from '../itf'
import { Presets, SingleBar } from 'cli-progress'
import { spawn } from 'child_process'
import { QuintError, isQuintError } from '../quintError'
import { TestResult } from '../runtime/testing'
import { List } from 'immutable'
import { nameWithNamespaces } from '../runtime/impl/builder'
import { Either, left, right } from '@sweet-monads/either'
import { getRustEvaluatorPath } from './binaryManager'
import { bigintCheckerReplacer } from './helpers'

// Conservative limit: 256 MB of UTF-8 bytes per line.
// V8's hard string limit is 0x1fffffe8 chars (~512 MB for ASCII), but a
// single MBT trace with many steps can exceed that. Lines over this limit
// are skipped and reported via the onOversizedLine callback.
const MAX_LINE_BYTES = 256 * 1024 * 1024

/**
 * Process a readable stream line-by-line using raw Buffer operations.
 *
 * Unlike readline, this never concatenates via `+=` — it accumulates Buffer
 * slices (zero-copy views), checks the accumulated byte count against
 * MAX_LINE_BYTES before calling toString(), and calls onOversizedLine for
 * lines that would exceed V8's string-length limit.
 */
function readLines(
  stream: NodeJS.ReadableStream,
  onLine: (line: string) => void,
  onOversizedLine?: () => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const pending: Buffer[] = []
    let pendingSize = 0

    const flushLine = () => {
      if (pendingSize <= MAX_LINE_BYTES) {
        onLine(Buffer.concat(pending).toString('utf8'))
      } else {
        onOversizedLine?.()
      }
      pending.length = 0
      pendingSize = 0
    }

    stream.on('data', (chunk: Buffer | string) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string)
      let start = 0
      for (let i = 0; i < buf.length; i++) {
        if (buf[i] === 0x0a /* '\n' */) {
          // Only buffer this slice if we haven't already exceeded the limit
          if (pendingSize <= MAX_LINE_BYTES) {
            pending.push(buf.subarray(start, i))
          }
          pendingSize += i - start
          flushLine()
          start = i + 1
        }
      }
      if (start < buf.length) {
        const remaining = buf.subarray(start)
        if (pendingSize <= MAX_LINE_BYTES) {
          pending.push(remaining)
        }
        pendingSize += remaining.length
      }
    })

    stream.on('end', () => {
      if (pendingSize > 0) {
        flushLine()
      }
      resolve()
    })

    stream.on('error', reject)
  })
}

export type ParsedQuint = {
  modules: QuintModule[]
  table: LookupTable
  main: string
  init: QuintEx
  step: QuintEx
  invariants: QuintEx[]
  witnesses: QuintEx[]
}

export class CommandWrapper {
  private verbosityLevel: number

  /**
   * Constructor for CommandWrapper.
   * @param {number} verbosityLevel - The level of verbosity for logging.
   */
  constructor(verbosityLevel: number) {
    this.verbosityLevel = verbosityLevel
  }

  /**
   * Simulate the parsed Quint model using the Rust evaluator
   *
   * @param {ParsedQuint} parsed - The parsed Quint model.
   * @param {string} source - The source code of the Quint model.
   * @param {QuintEx[]} witnesses - The witnesses for the simulation.
   * @param {number} nruns - The number of runs for the simulation.
   * @param {number} nsteps - The number of steps per run.
   * @param {number} ntraces - The number of traces to store.
   * @param {number} nthreads - The number of threads to use.
   * @param {bigint} [seed] - Optional seed for reproducibility.
   * @param {boolean} [mbt] - Whether to produce metadata for model-based testing.
   * @param {TraceHook} onTrace - A callback function to be called with trace information for each simulation run.
   *
   * @returns {Outcome} The outcome of the simulation.
   * @throws Will throw an error if the Rust evaluator fails to launch or returns an error.
   */
  async simulate(
    parsed: ParsedQuint,
    source: string,
    nruns: number,
    nsteps: number,
    ntraces: number,
    nthreads: number,
    seed?: bigint,
    mbt?: boolean,
    onTrace?: TraceHook,
    outItf?: string
  ): Promise<Outcome> {
    const errorOutcome = (error: QuintError): Outcome => ({
      status: 'error',
      errors: [error],
      bestTraces: [],
      witnessingTraces: [],
      samples: 0,
      traceStatistics: { averageTraceLength: 0, minTraceLength: 0, maxTraceLength: 0 },
      violatedInvariants: [],
    })

    const input = {
      parsed: parsed,
      source: source,
      nruns: nruns,
      nsteps: nsteps,
      ntraces: ntraces,
      nthreads: nthreads,
      seed: seed,
      mbt: mbt ?? false,
      verbosity: this.verbosityLevel,
      out_itf: outItf !== undefined,
    }

    // Rust emits NDJSON: one {"type":"trace",...} line per trace, then a
    // {"type":"result",...} summary. Use readLines (Buffer-based, no readline +=)
    // so individual large traces don't hit V8's max string length.
    let vars: string[] | null = null
    let displayTrace: any = null
    let summary: any = null

    const result = await this.runRustEvaluator(
      'simulate-from-stdin',
      input,
      {
        format: 'Running... [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} samples | {speed} samples/s',
        total: nruns,
      },
      () => {
        // Trace line exceeded MAX_LINE_BYTES — too large to display in terminal.
        // The summary line will still arrive and the run completes normally.
        debugLog(
          this.verbosityLevel,
          'Trace too large for terminal display (> 256 MB). Consider reducing --max-steps.'
        )
      }
    )

    if (result.isLeft()) {
      return errorOutcome(result.value)
    }

    for (const line of result.value) {
      if (line.length === 0 || line.trimStart()[0] !== '{') {
        if (line.length > 0) console.log(line)
        continue
      }
      try {
        const msg = JSONbig.parse(line, reviver)
        if (msg.type === 'trace') {
          const itfStates = msg.states
          const states = ofItf(itfStates)

          if (vars === null && states.length > 0) {
            const firstState = states[0] as QuintApp
            vars = []
            for (let i = 0; i < firstState.args.length; i += 2) {
              vars.push((firstState.args[i] as QuintStr).value)
            }
          }

          if (onTrace && vars !== null && states.length > 0) {
            const status = msg.result ? 'ok' : 'violation'
            onTrace(msg.index, status, vars, states)
          }

          // Keep first trace for counterexample display; prefer violations
          if (displayTrace === null || (!msg.result && displayTrace.result !== false)) {
            displayTrace = {
              seed: BigInt(msg.seed),
              states,
              diagnostics: diagnosticsOfItf(itfStates),
              pendingDiagnostics: pendingDiagnosticsOfItf(itfStates),
              result: msg.result,
            }
          }
        } else if (msg.type === 'result') {
          summary = msg
        }
      } catch (_) {
        // non-JSON or malformed line — ignore
      }
    }

    if (!summary) {
      return errorOutcome({ code: 'QNT516', message: 'Rust evaluator produced no result' })
    }

    return {
      status: summary.status,
      errors: summary.errors,
      bestTraces: displayTrace ? [displayTrace] : [],
      traceStatistics: summary.traceStatistics,
      witnessingTraces: summary.witnessingTraces,
      samples: summary.samples,
      violatedInvariants: summary.violatedInvariants,
    }
  }

  /**
   * Execute a single test using the Rust evaluator
   *
   * @param {LookupDefinition} testDef - The test definition to execute
   * @param {LookupTable} table - The lookup table for name resolution
   * @param {bigint} [seed] - Optional random seed for reproducibility.
   * @param {number} maxSamples - The maximum number of samples to run
   * @param {number} index - The index of the test in the run order
   * @param {TraceHook} onTrace - A callback function to be called with trace information for ITF output
   *
   * @returns {TestResult} The result of the test execution
   * @throws Will throw an error if the Rust evaluator fails to launch or returns an error
   */
  async test(
    testDef: LookupDefinition,
    table: LookupTable,
    seed: bigint | undefined,
    maxSamples: number,
    index: number,
    onTrace?: TraceHook
  ): Promise<TestResult> {
    const testName = nameWithNamespaces(testDef.name, List(testDef.namespaces ?? []))
    const input = {
      name: testName,
      test_def: testDef,
      table: table,
      seed: seed,
      max_samples: maxSamples,
      verbosity: this.verbosityLevel,
    }

    const result = await this.runRustEvaluator('test-from-stdin', input, {
      format: `     ${testName} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} samples | {speed} samples/s`,
      total: maxSamples,
    })

    // Handle process errors
    if (result.isLeft()) {
      return {
        name: testName,
        status: 'failed',
        seed: seed ?? 0n,
        errors: [result.value],
        frames: [],
        nsamples: 0,
      }
    }

    const output = [...result.value]
      .reverse()
      .find((line: string) => line.trimStart()[0] === '{') ?? ''
    try {
      const parsed: TestResult = JSONbig.parse(output, reviver)

      // Convert seed to bigint
      parsed.seed = BigInt(parsed.seed)

      // Convert traces from ITF format
      if (parsed.traces && parsed.traces.length > 0) {
        parsed.traces = parsed.traces.map((trace: any) => ({
          ...trace,
          states: ofItf(trace.states),
          diagnostics: diagnosticsOfItf(trace.states),
        }))

        // Call onTrace callback for each trace
        if (onTrace) {
          const firstState = parsed.traces[0].states[0] as QuintApp
          const vars: string[] = []
          for (let i = 0; i < firstState.args.length; i += 2) {
            vars.push((firstState.args[i] as QuintStr).value)
          }

          parsed.traces.forEach((trace: any) => {
            const status = trace.result ? 'ok' : 'violation'
            onTrace(index, status, vars, trace.states, testName)
          })
        }
      }

      return parsed as TestResult
    } catch (error) {
      throw new Error(`Failed to parse test result from Rust evaluator: ${JSONbig.stringify(error)}`)
    }
  }

  /**
   * Evaluate expressions at a given state using the Rust evaluator.
   *
   * @param {ItfState} state - The state as a raw ITF value (record mapping variable names to ITF values).
   * @param {LookupTable} table - The lookup table for name resolution.
   * @param {QuintEx[]} exprs - The expressions to evaluate at the given state.
   *
   * @returns Either an error or the list of evaluated ITF values (one per expression).
   */
  async evaluateAtState(
    state: ItfState,
    table: LookupTable,
    exprs: QuintEx[]
  ): Promise<Either<QuintError, ItfValue[]>> {
    const input = { table, state, exprs }
    const result = await this.runRustEvaluator('evaluate-at-state-from-stdin', input)

    if (result.isLeft()) {
      return left(result.value)
    }

    const output = [...result.value]
      .reverse()
      .find((line: string) => line.trimStart()[0] === '{') ?? ''
    try {
      const parsed = JSONbig.parse(output, reviver)
      const values: ItfValue[] = []
      for (const r of parsed.results) {
        if (r.error) {
          return left(r.error)
        }
        values.push(r.value)
      }
      return right(values)
    } catch (error) {
      return left({ code: 'QNT516', message: `Failed to parse data from Rust evaluator: ${error}` })
    }
  }

  /**
   * Run the Rust evaluator with the given command and input.
   * Reads stdout line-by-line via the Buffer-based `readLines` (safe for lines
   * up to MAX_LINE_BYTES) and returns all lines. Optionally displays a progress
   * bar driven by stderr JSON events.
   */
  private async runRustEvaluator(
    command: string,
    input: any,
    progress?: { format: string; total: number },
    onOversizedLine?: () => void
  ): Promise<Either<QuintError, string[]>> {
    const exe = await getRustEvaluatorPath()
    const args = [command]

    // Serialize input with BigInt validation
    let inputStr: string
    try {
      inputStr = JSONbig.stringify(input, bigintCheckerReplacer)
    } catch (error) {
      // If replacer throws a QuintError for out-of-bounds integers, return it
      if (isQuintError(error)) {
        return left(error)
      }
      throw error
    }

    debugLog(this.verbosityLevel, `Starting Rust evaluator with command: ${command}`)

    // Create progress bar if requested
    let progressBar: SingleBar | undefined
    if (progress) {
      progressBar = new SingleBar(
        {
          clearOnComplete: true,
          forceRedraw: true,
          format: progress.format,
        },
        Presets.rect
      )
      progressBar.start(progress.total, 0, { speed: '0' })
    }

    const startTime = Date.now()

    // Spawn the Rust evaluator in subprocess
    let spawnError: Error | undefined
    const process = spawn(exe, args, {
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    // Capture spawn errors (e.g., binary not found) instead of throwing
    process.on('error', (err: Error) => {
      spawnError = err
    })

    // Register a no-op error handler on stdin to prevent Node.js from crashing
    // on EPIPE errors. EPIPE occurs when the child process exits before we finish
    // writing. We can't return a QuintError from this event handler since it's
    // outside the async control flow — the actual error is captured via the
    // process close event and returned as a proper left() below.
    process.stdin.on('error', () => {})

    // Write the input to stdin
    process.stdin.write(inputStr)
    process.stdin.end()

    const lines: string[] = []
    const stdoutDone = readLines(
      process.stdout,
      (line: string) => lines.push(line),
      onOversizedLine
    )

    // Always capture stderr for error reporting
    const stderrLines: string[] = []
    const stderrDone = readLines(process.stderr, (line: string) => {
      if (progressBar) {
        try {
          const progress = JSON.parse(line)
          if (progress.type === 'progress') {
            const elapsedSeconds = (Date.now() - startTime) / 1000
            const speed = Math.round(progress.current / elapsedSeconds)
            progressBar.update(progress.current, { speed })
            return
          }
        } catch (_) {
          progressBar.stop()
        }
      }
      stderrLines.push(line)
    })

    // Wait for process completion
    const [exitCode, signal] = await new Promise<[number | null, string | null]>(resolve => {
      process.on('close', (code, signal) => resolve([code, signal]))
    })

    await Promise.all([stdoutDone, stderrDone])

    progressBar?.stop()

    const stderrOutput = stderrLines.join('\n')

    // Handle spawn errors (e.g., binary not found, permission denied)
    if (spawnError) {
      return left({
        code: 'QNT516',
        message: `Failed to launch Rust evaluator: ${spawnError.message}${stderrOutput ? `\n${stderrOutput}` : ''}`,
      })
    }

    if (signal === 'SIGKILL') {
      return left({
        code: 'QNT517',
        message:
          `Rust evaluator was killed by SIGKILL. This is often caused by:\n` +
          `  - Out of memory (OOM killer)\n` +
          `  - Container/cgroup memory limits\n` +
          `  - Manual kill -9\n` +
          `Check 'dmesg | grep -i kill' for OOM messages.`,
      })
    } else if (signal) {
      return left({
        code: 'QNT517',
        message: `Rust evaluator was killed by signal: ${signal}`,
      })
    } else if (exitCode !== 0) {
      return left({
        code: 'QNT516',
        message: `Rust evaluator exited with code ${exitCode}${stderrOutput ? `\n${stderrOutput}` : ''}`,
      })
    }

    return right(lines)
  }
}
