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
 *
 * Communication is synchronous: send a command, wait for response, process it.
 * The only async aspect is that the main process can handle Ctrl+C while waiting.
 */
export class ReplEvaluatorWrapper {
  private process: ChildProcess | null = null
  private stdout: readline.Interface | null = null
  private pendingResponse: ((response: ReplResponse) => void) | null = null
  private processExited: boolean = false
  public recorder: TraceRecorder
  private verbosityLevel: number
  private statesCache: any[] = [] // ITF values from Rust

  private initializationPromise: Promise<void>

  constructor(table: LookupTable, recorder: TraceRecorder, rng: Rng) {
    this.recorder = recorder
    this.verbosityLevel = recorder.verbosityLevel
    this.initializationPromise = this.initialize(table, rng.getState())
  }

  /**
   * Initialize the Rust evaluator process and wait for it to be ready
   */
  private async initialize(table: LookupTable, seed: bigint): Promise<void> {
    // Get the path to the Rust evaluator
    const evaluatorPath = this.getRustEvaluatorPathSync()

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
      this.processExited = true
      if (this.pendingResponse) {
        this.pendingResponse({
          response: 'Error',
          message: `Rust REPL evaluator exited with code ${code}`,
        })
        this.pendingResponse = null
      }
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
      // Check if this is debug output (starts with '>')
      if (line.startsWith('>')) {
        // Print debug output directly to stdout
        console.log(line)
        return
      }

      try {
        const response: ReplResponse = JSONbig.parse(line)

        if (this.pendingResponse) {
          this.pendingResponse(response)
          this.pendingResponse = null
        }
      } catch (err) {
        console.error('Failed to parse response from Rust evaluator:', err)
      }
    })

    // Send initialization command and WAIT for response
    await this.sendCommand({ cmd: 'Initialize', table, seed, verbosity: this.verbosityLevel })
  }

  /**
   * Send a command to the Rust evaluator and wait for response
   */
  private async sendCommand(command: ReplCommand): Promise<ReplResponse> {
    if (!this.process || !this.process.stdin || this.processExited) {
      throw new Error('Rust REPL evaluator process not initialized or has exited')
    }

    // CRITICAL: Check if we already have a pending response
    // This should NEVER happen - it means multiple requests are in-flight
    if (this.pendingResponse !== null) {
      const error = new Error(
        `CONCURRENT REQUEST DETECTED! Tried to send ${command.cmd} while another request is pending. ` +
          `This violates the synchronous request-response protocol.`
      )
      console.error('========================================')
      console.error('FATAL: CONCURRENT REQUEST VIOLATION')
      console.error('========================================')
      console.error(error.stack)
      console.error('Current command:', command.cmd)
      console.error('pendingResponse is set:', this.pendingResponse !== null)
      console.error('========================================')
      throw error
    }

    return new Promise<ReplResponse>((resolve, reject) => {
      // Store the response handler
      this.pendingResponse = resolve

      // Write command to stdin
      const commandJson = JSONbig.stringify(command, replacer)
      this.process!.stdin!.write(commandJson + '\n', err => {
        if (err) {
          this.pendingResponse = null
          reject(new Error(`Failed to send command: ${err.message}`))
        }
      })

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingResponse) {
          this.pendingResponse = null
          reject(new Error('Rust REPL evaluator command timeout'))
        }
      }, 30000)
    })
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
   * Wait for initialization to complete
   */
  async waitForInitialization(): Promise<void> {
    await this.initializationPromise
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
   * Get the path to the Rust evaluator executable synchronously
   */
  private getRustEvaluatorPathSync(): string {
    const evaluatorDir = rustEvaluatorDir('v0.3.0')
    const platform = process.platform
    const executable = platform === 'win32' ? 'quint-evaluator.exe' : 'quint_evaluator'
    return path.join(evaluatorDir, executable)
  }
}
