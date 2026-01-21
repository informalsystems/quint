/* ----------------------------------------------------------------------------------
 * Copyright 2026 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Wrapper for the Rust REPL evaluator.
 * Spawns a Rust subprocess and communicates via line-delimited JSON.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { Either, left, right } from '@sweet-monads/either'
import { QuintEx } from '../ir/quintIr'
import { LookupTable } from '../names/base'
import { QuintError } from '../quintError'
import { Rng } from '../rng'
import { TraceRecorder } from './trace'
import { Trace } from './impl/trace'
import { ChildProcess, spawn } from 'child_process'
import { rustEvaluatorDir } from '../config'
import path from 'path'
import readline from 'readline'
import JSONbig from 'json-bigint'
import { replacer } from '../jsonHelper'
import { ofItf } from '../itf'

/**
 * Commands sent to the Rust REPL evaluator
 */
type ReplCommand =
  | { cmd: 'Initialize'; table: LookupTable; seed?: bigint; verbosity?: number }
  | { cmd: 'UpdateTable'; table: LookupTable }
  | { cmd: 'Evaluate'; expr: QuintEx }
  | { cmd: 'ReplShift' }
  | { cmd: 'GetTraceStates' }
  | { cmd: 'Reset' }

/**
 * Responses received from the Rust REPL evaluator
 */
type ReplResponse =
  | { response: 'Initialized'; success: boolean }
  | { response: 'TableUpdated'; success: boolean }
  | { response: 'EvaluationResult'; ok?: any; err?: QuintError }
  | {
      response: 'ReplShiftResult'
      shifted: boolean
      missing_vars: string[]
      old_state?: any
      new_state?: any
    }
  | { response: 'TraceStates'; states: any[] }
  | { response: 'ResetComplete' }
  | { response: 'Error'; message: string }

/**
 * Wrapper for the Rust REPL evaluator.
 * Maintains a long-lived Rust subprocess and communicates via JSON.
 */
export class ReplEvaluatorWrapper {
  private process: ChildProcess | null = null
  private stdout: readline.Interface | null = null
  private pendingResponses: Map<number, (response: ReplResponse) => void> = new Map()
  private nextRequestId: number = 0
  private initializationPromise: Promise<void> | null = null
  public recorder: TraceRecorder
  private verbosityLevel: number
  private statesCache: any[] = [] // ITF values from Rust
  private commandQueue: Promise<any> = Promise.resolve() // Serialize commands

  constructor(table: LookupTable, recorder: TraceRecorder, rng: Rng) {
    this.recorder = recorder
    this.verbosityLevel = recorder.verbosityLevel
    this.initializationPromise = this.initialize(table, rng.getState())
  }

  /**
   * Initialize the Rust evaluator process and send the initial configuration
   */
  private async initialize(table: LookupTable, seed: bigint): Promise<void> {
    // Get the path to the Rust evaluator
    const evaluatorPath = await this.getRustEvaluatorPath()

    // Spawn the Rust process
    this.process = spawn(evaluatorPath, ['repl-from-stdin'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    // Handle process errors
    this.process.on('error', (err: Error) => {
      throw new Error(`Failed to spawn Rust REPL evaluator: ${err.message}`)
    })

    // Handle process exit
    this.process.on('close', code => {
      if (code !== 0 && code !== null) {
        console.error(`Rust REPL evaluator exited with code ${code}`)
      }
    })

    // Set up stdout reader for line-delimited JSON
    this.stdout = readline.createInterface({
      input: this.process.stdout!,
      terminal: false,
    })

    this.stdout.on('line', (line: string) => {
      try {
        const response: ReplResponse = JSONbig.parse(line)
        // For now, simple handling - we'll improve this with request IDs if needed
        const handler = Array.from(this.pendingResponses.values())[0]
        if (handler) {
          const requestId = Array.from(this.pendingResponses.keys())[0]
          this.pendingResponses.delete(requestId)
          handler(response)
        }
      } catch (err) {
        console.error('Failed to parse response from Rust evaluator:', err)
      }
    })

    // Send initialization command
    await this.sendCommand({
      cmd: 'Initialize',
      table,
      seed,
      verbosity: this.verbosityLevel,
    })
  }

  /**
   * Send a command to the Rust evaluator and wait for response
   */
  private async sendCommand(command: ReplCommand): Promise<ReplResponse> {
    // Serialize all commands to avoid race conditions
    const result = this.commandQueue.then(async () => {
      if (!this.process || !this.process.stdin) {
        throw new Error('Rust REPL evaluator process not initialized')
      }

      return new Promise<ReplResponse>((resolve, reject) => {
        const requestId = this.nextRequestId++
        this.pendingResponses.set(requestId, resolve)

        const commandJson = JSONbig.stringify(command, replacer)
        this.process!.stdin!.write(commandJson + '\n', err => {
          if (err) {
            this.pendingResponses.delete(requestId)
            reject(new Error(`Failed to send command: ${err.message}`))
          }
        })

        // Timeout after 30 seconds
        setTimeout(() => {
          if (this.pendingResponses.has(requestId)) {
            this.pendingResponses.delete(requestId)
            reject(new Error('Rust REPL evaluator command timeout'))
          }
        }, 30000)
      })
    })

    // Update the queue to wait for this command
    this.commandQueue = result.catch(() => {}) // Swallow errors in queue chain

    return result
  }

  /**
   * Evaluate a Quint expression
   */
  evaluate(expr: QuintEx): Either<QuintError, QuintEx> {
    // This needs to be synchronous to match the Evaluator interface
    // We'll need to refactor this, but for now throw an error
    throw new Error(
      'ReplEvaluatorWrapper.evaluate() is async but interface requires sync. Use evaluateAsync() instead.'
    )
  }

  /**
   * Async version of evaluate (what we actually implement)
   */
  async evaluateAsync(expr: QuintEx): Promise<Either<QuintError, QuintEx>> {
    await this.initializationPromise

    const response = await this.sendCommand({ cmd: 'Evaluate', expr })

    if (response.response === 'EvaluationResult') {
      if (response.ok !== undefined) {
        // Convert single ITF value back to QuintEx
        // We need to wrap it in a trace structure for ofItf
        const itfTrace = {
          vars: [],
          states: [response.ok],
        }
        const converted = ofItf(itfTrace)
        return right(converted[0]) // Return first (and only) state
      } else if (response.err !== undefined) {
        return left(response.err)
      }
    } else if (response.response === 'Error') {
      return left({ code: 'QNT000', message: response.message, reference: undefined })
    }

    return left({ code: 'QNT000', message: 'Unexpected response from evaluator', reference: undefined })
  }

  /**
   * Update the lookup table with new definitions
   */
  updateTable(table: LookupTable): void {
    // Fire and forget - async operation but sync interface
    this.updateTableAsync(table).catch(err => {
      console.error('Failed to update table:', err)
    })
  }

  async updateTableAsync(table: LookupTable): Promise<void> {
    await this.initializationPromise
    await this.sendCommand({ cmd: 'UpdateTable', table })
  }

  /**
   * Shift to next state and check for undefined variables.
   * Returns [shifted, missing_vars, old_state, new_state].
   */
  replShift(): [boolean, string[], any, any] {
    // This needs to be synchronous - not ideal
    throw new Error(
      'ReplEvaluatorWrapper.replShift() is async but interface requires sync. Use replShiftAsync() instead.'
    )
  }

  async replShiftAsync(): Promise<[boolean, string[], any, any]> {
    await this.initializationPromise

    const response = await this.sendCommand({ cmd: 'ReplShift' })

    if (response.response === 'ReplShiftResult') {
      // Update our cached states (keep as ITF values)
      if (response.shifted) {
        const statesResponse = await this.sendCommand({ cmd: 'GetTraceStates' })
        if (statesResponse.response === 'TraceStates') {
          this.statesCache = statesResponse.states
        }
      }

      return [response.shifted, response.missing_vars, response.old_state, response.new_state]
    }

    return [false, [], undefined, undefined]
  }

  /**
   * Get the trace for rendering
   */
  get trace(): Trace {
    // For now, return an empty trace
    // TODO: Convert ITF states to RuntimeValue and populate trace
    // This requires more work to bridge the gap between ITF and RuntimeValue
    return new Trace()
  }

  /**
   * Shutdown the Rust evaluator process
   */
  async shutdown(): Promise<void> {
    if (this.process) {
      this.process.stdin?.end()
      this.process.kill()
      this.process = null
    }
  }

  /**
   * Get the path to the Rust evaluator executable
   */
  private async getRustEvaluatorPath(): Promise<string> {
    const evaluatorDir = rustEvaluatorDir('v0.3.0')
    const platform = process.platform
    const executable = platform === 'win32' ? 'quint-evaluator.exe' : 'quint_evaluator'
    return path.join(evaluatorDir, executable)
  }
}
