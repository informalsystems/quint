/*
 * An instance of the simulator that runs in a separate process.
 *
 * Igor Konnov, 2023
 *
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { fork } from "child_process"
import JSONbig from "json-bigint"

import { IdGenerator } from "./idGenerator"
import { SimulatorOptions, SimulatorResult } from "./simulation"

// always treat all numbers as bigint
const serde = JSONbig({ alwaysParseAsBig: true, useNativeBigInt: true})

export async function
compileForkAndRun(
    idGen: IdGenerator,
    code: string,
    mainName: string,
    options: SimulatorOptions): Promise<SimulatorResult> {
  const child = fork(`${__dirname}/simulationInChild.js`)
  const payload = serde.stringify([idGen.nextId(), code, mainName, options])

  const promise = new Promise<SimulatorResult>((resolve) => {
    console.log('Registered the message handler')

    child.once('message', (r) => {
      console.log('Received a message from the child')
      const result: SimulatorResult = serde.parse(r)
      resolve(result)
  })})

  child.send(payload)

  return promise
}