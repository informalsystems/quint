/*
 * An instance of the simulator that runs in a separate process.
 *
 * Igor Konnov, 2023
 *
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import JSONbig from "json-bigint"

import { newIdGenerator } from "./idGenerator"
import { SimulatorOptions } from "./simulation"
import { compileAndRun } from "./simulation"

// always treat all numbers as bigint
const serde = JSONbig({ alwaysParseAsBig: true, useNativeBigInt: true})

// the child process receives a simulator task
process.on('message', (serializedJson) => {
  // since we are using bigint, we need a bigint serializer
  const [startId, code, mainName, options]:
      [bigint, string, string, SimulatorOptions] = serde.parse(serializedJson)
  const idGen = newIdGenerator(BigInt(startId))
  const result = compileAndRun(idGen, code, mainName, options)
  console.log('Finished')
  if (process.send !== undefined) {
    console.log('Sent the message to the child')
    const response = JSONbig.stringify(result)
    console.log(response)
    process.send(response)
  }
})
