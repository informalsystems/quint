/* ----------------------------------------------------------------------------------
 * Copyright 2025 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Interface to TLC model checker
 *
 * @author Yassine Boukhari, 2025
 *
 * @module
 */

import { Either, left, right } from '@sweet-monads/either'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { apalacheDistDir } from './config'
import { ErrorMessage } from './ErrorMessage'

export interface TlcConfig {
  tlaCode: string
  moduleName: string
  hasInvariant: boolean
  hasTemporal: boolean
}

export type TlcError = {
  explanation: string
  errors: ErrorMessage[]
  isViolation: boolean
}

export type TlcResult<T> = Either<TlcError, T>

function generateCfg(config: TlcConfig): string {
  let cfg = `INIT q_init\nNEXT q_step\n`

  if (config.hasInvariant) {
    cfg += `INVARIANT q_inv\n`
  }
  if (config.hasTemporal) {
    cfg += `PROPERTY q_temporalProps\n`
  }
  return cfg
}

function findApalacheJar(apalacheVersion: string): Either<string, string> {
  const jarPath = path.join(apalacheDistDir(apalacheVersion), 'apalache', 'lib', 'apalache.jar')
  if (fs.existsSync(jarPath)) {
    return right(jarPath)
  }
  return left(`Apalache JAR not found at ${jarPath}. Run 'quint verify' with Apalache backend first to download it.`)
}

function tlcErr(explanation: string, isViolation: boolean): TlcError {
  return { explanation, errors: [], isViolation }
}

export async function verify(
  config: TlcConfig,
  apalacheVersion: string,
  workers: number | 'auto' = 'auto'
): Promise<TlcResult<void>> {
  const jarResult = findApalacheJar(apalacheVersion)
  if (jarResult.isLeft()) {
    return left(tlcErr(jarResult.value, false))
  }
  const jarPath = jarResult.value

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quint-tlc-'))
  const tlaFile = path.join(tmpDir, `${config.moduleName}.tla`)
  const cfgFile = path.join(tmpDir, `${config.moduleName}.cfg`)

  fs.writeFileSync(tlaFile, config.tlaCode)
  fs.writeFileSync(cfgFile, generateCfg(config))

  return new Promise(resolve => {
    const proc = spawn('java', [
      '-Xmx8G',
      '-Xss515m',
      '-cp',
      jarPath,
      'tlc2.TLC',
      '-deadlock',
      '-workers',
      String(workers),
      tlaFile,
    ])

    let output = ''

    proc.stdout.on('data', data => {
      const str = data.toString()
      output += str
      process.stdout.write(str)
    })

    proc.stderr.on('data', data => {
      const str = data.toString()
      output += str
      process.stderr.write(str)
    })

    proc.on('close', code => {
      fs.rmSync(tmpDir, { recursive: true, force: true })

      if (code === 0) {
        resolve(right(undefined))
      } else if (code !== null && code >= 10 && code <= 14) {
        resolve(left(tlcErr('Found an issue (see counterexample above)', true)))
      } else {
        resolve(left(tlcErr('TLC error (see output above)', false)))
      }
    })

    proc.on('error', err => {
      fs.rmSync(tmpDir, { recursive: true, force: true })
      resolve(left(tlcErr(`Failed to spawn TLC: ${err.message}`, false)))
    })
  })
}
