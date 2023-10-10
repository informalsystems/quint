/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Interface to Apalache's model checking functionality
 *
 * This functionality is exposed thru the Apalache server.
 *
 * @author Shon Feder
 *
 * @module
 */

import { Either, chain, left, right } from '@sweet-monads/either'
import { ErrorMessage } from './ErrorMessage'
import path from 'path'
import fs from 'fs'
import os from 'os'
// TODO: used by GitHub api approach: https://github.com/informalsystems/quint/issues/1124
// import semver from 'semver'
import fetch from 'node-fetch'
import { pipeline } from 'stream/promises'
import child_process from 'child_process'
import * as tar from 'tar'
import * as grpc from '@grpc/grpc-js'
import * as proto from '@grpc/proto-loader'
import * as protobufDescriptor from 'protobufjs/ext/descriptor'
import { setTimeout } from 'timers/promises'
import { promisify } from 'util'
import { ItfTrace } from './itf'
import { verbosity } from './verbosity'
// TODO: used by GitHub api approach: https://github.com/informalsystems/quint/issues/1124
// import { request as octokitRequest } from '@octokit/request'

import type { Buffer } from 'buffer'
import type { PackageDefinition as ProtoPackageDefinition } from '@grpc/proto-loader'

const APALACHE_SERVER_URI = 'localhost:8822'
const APALACHE_VERSION_TAG = '0.42.0'
// TODO: used by GitHub api approach: https://github.com/informalsystems/quint/issues/1124
// const APALACHE_TGZ = 'apalache.tgz'

// The structure used to report errors
type VerifyError = {
  explanation: string
  errors: ErrorMessage[]
  traces?: ItfTrace[]
}

function quintConfigDir(): string {
  return path.join(os.homedir(), '.quint')
}

function apalacheDistDir(): string {
  return path.join(quintConfigDir(), `apalache-dist-${APALACHE_VERSION_TAG}`)
}

export type VerifyResult<T> = Either<VerifyError, T>

// An object representing the Apalache configuration
// See https://github.com/informalsystems/apalache/blob/main/mod-infra/src/main/scala/at/forsyte/apalache/infra/passes/options.scala#L255
type ApalacheConfig = any

// Interface to the apalache server
// This is likely to be expanded in the future
type Apalache = {
  // Run the check command with the given configuration
  check: (c: ApalacheConfig) => Promise<VerifyResult<void>>
}

function handleVerificationFailure(failure: { pass_name: string; error_data: any }): VerifyError {
  switch (failure.pass_name) {
    case 'SanyParser':
      return {
        explanation: `internal error: while parsing in Apalache:\n'${failure.error_data}'\nPlease report an issue: https://github.com/informalsystems/quint/issues/new`,
        errors: [],
      }
    case 'TypeCheckerSnowcat':
      return {
        explanation: `internal error: while type checking in Apalache:\n'${failure.error_data}'\nPlease report an issue: https://github.com/informalsystems/quint/issues/new`,
        errors: [],
      }
    case 'BoundedChecker':
      switch (failure.error_data.checking_result) {
        case 'Error':
          return { explanation: 'found a counterexample', traces: failure.error_data.counterexamples, errors: [] }
        case 'Deadlock':
          return { explanation: 'reached a deadlock', traces: failure.error_data.counterexamples, errors: [] }
        default:
          throw new Error(`internal error: unhandled verification error ${failure.error_data.checking_result}`)
      }
    default:
      throw new Error(`internal error: unhandled verification error at pass ${failure.pass_name}`)
  }
}

// Construct the Apalache interface around the cmdExecutor
function apalache(cmdExecutor: AsyncCmdExecutor): Apalache {
  const check = async (c: ApalacheConfig): Promise<VerifyResult<void>> => {
    const response = await cmdExecutor.run({ cmd: 'CHECK', config: JSON.stringify(c) })
    if (response.result == 'success') {
      return right(void 0)
    } else {
      switch (response.failure.errorType) {
        case 'UNEXPECTED': {
          const errData = JSON.parse(response.failure.data)
          return err(errData.msg)
        }
        case 'PASS_FAILURE':
          return left(handleVerificationFailure(JSON.parse(response.failure.data)))
        default:
          // TODO handle other error cases
          return err(`${response.failure.errorType}: ${response.failure.data}`)
      }
    }
  }

  return { check }
}

// Alias for an async callback for values of type T used to annotate
// callback-based methods so we can convert them into promise-based methods via
// promiseify.
type AsyncCallBack<T> = (err: any, result: T) => void

// The core grpc tooling doesn't support generation of typing info,
// we therefore record the structer we require from the grpc generation
// in the 6 following types.
//
// The types reflect https://github.com/informalsystems/apalache/blob/main/shai/src/main/protobuf/cmdExecutor.proto

type RunRequest = { cmd: string; config: string }

type RunResponse =
  | { result: 'failure'; failure: { errorType: string; data: string } }
  // The success data also includes the parsed module, but we don't need it
  | { result: 'success' }

// The interface for the CmdExecutor service generated by the gRPC library
type CmdExecutor = {
  // Constructs a new client service
  new (url: string, creds: any): CmdExecutor
  run: (req: RunRequest, cb: AsyncCallBack<any>) => void
}

// The refined interface to the CmdExecutor we produce from the generated interface
type AsyncCmdExecutor = {
  run: (req: RunRequest) => Promise<RunResponse>
}

// The interface for the Shai package
type ShaiPkg = {
  cmdExecutor: {
    CmdExecutor: CmdExecutor
  }
}

// Helper to construct errors results
function err<A>(explanation: string, errors: ErrorMessage[] = [], traces?: ItfTrace[]): VerifyResult<A> {
  return left({ explanation, errors, traces })
}

// See https://grpc.io/docs/languages/node/basics/#example-code-and-setup
const grpcStubOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

async function loadProtoDefViaReflection(retry: boolean): Promise<VerifyResult<ProtoPackageDefinition>> {
  // Types of the gRPC interface
  type ServerReflectionRequest = { file_containing_symbol: string }
  type ServerReflectionResponseSuccess = {
    file_descriptor_response: {
      file_descriptor_proto: Buffer[]
    }
  }
  type ServerReflectionResponseFailure = {
    error_response: {
      error_code: number
      error_message: string
    }
  }
  type ServerReflectionResponse = ServerReflectionResponseSuccess | ServerReflectionResponseFailure
  type ServerReflectionService = {
    new (url: string, creds: grpc.ChannelCredentials): ServerReflectionService
    ServerReflectionInfo: () => grpc.ClientDuplexStream<ServerReflectionRequest, ServerReflectionResponse>
    getChannel: () => { getConnectivityState: (_: boolean) => grpc.connectivityState }
  }
  type ServerReflectionPkg = {
    grpc: { reflection: { v1alpha: { ServerReflection: ServerReflectionService } } }
  }

  // Obtain a reflection service client
  const protoPath = require.resolve('./reflection.proto')
  const packageDefinition = proto.loadSync(protoPath, grpcStubOptions)
  const reflectionProtoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ServerReflectionPkg
  const serverReflectionService = reflectionProtoDescriptor.grpc.reflection.v1alpha.ServerReflection
  const reflectionClient = new serverReflectionService(APALACHE_SERVER_URI, grpc.credentials.createInsecure())

  // Wait for gRPC channel to come up, with 1sec pauses
  if (retry) {
    for (;;) {
      const grpcChannelState = reflectionClient.getChannel().getConnectivityState(true)
      if (grpcChannelState == grpc.connectivityState.READY) {
        break
      } else {
        /* I suspect that there is a race with async gRPC code that actually
         * brings the connection up, so we need to yield control here. In
         * particular, waiting for the channel to come up in a busy-waiting loop
         * does NOT work.
         */
        await setTimeout(1000)
      }
    }
  }

  // Query reflection endpoint
  return new Promise<VerifyResult<ServerReflectionResponse>>((resolve, _) => {
    const call = reflectionClient.ServerReflectionInfo()
    call.on('data', (r: ServerReflectionResponse) => {
      call.end()
      resolve(right(r))
    })
    call.on('error', (e: grpc.StatusObject) => resolve(err(`Error querying reflection endpoint: ${e}`)))

    call.write({ file_containing_symbol: 'shai.cmdExecutor.CmdExecutor' })
  }).then(protoDefResponse =>
    protoDefResponse.chain(protoDefResponse => {
      // Construct a proto definition of the reflection response.
      if ('error_response' in protoDefResponse) {
        return err(
          `Apalache gRPC endpoint is corrupted. Could not extract proto file: ${protoDefResponse.error_response.error_message}`
        )
      }

      // Decode reflection response to FileDescriptorProto
      let fileDescriptorProtos = protoDefResponse.file_descriptor_response.file_descriptor_proto.map(
        bytes => protobufDescriptor.FileDescriptorProto.decode(bytes) as protobufDescriptor.IFileDescriptorProto
      )

      // Use proto-loader to load the FileDescriptorProto wrapped in a FileDescriptorSet
      return right(proto.loadFileDescriptorSetFromObject({ file: fileDescriptorProtos }, grpcStubOptions))
    })
  )
}

function loadGrpcClient(protoDef: ProtoPackageDefinition): AsyncCmdExecutor {
  const protoDescriptor = grpc.loadPackageDefinition(protoDef)
  // The cast thru `unkown` lets us convince the type system of anything
  // See https://basarat.gitbook.io/typescript/type-system/type-assertion#double-assertion
  const pkg = protoDescriptor.shai as unknown as ShaiPkg
  const stub: any = new pkg.cmdExecutor.CmdExecutor(APALACHE_SERVER_URI, grpc.credentials.createInsecure())
  return {
    run: promisify((data: RunRequest, cb: AsyncCallBack<any>) => stub.run(data, cb)),
  }
}

/**
 * Connect to the Apalache server, and verify that the gRPC channel is up.
 *
 * @param retry Wait for the gRPC connection to come up.
 *
 * @returns A promise resolving to a `right<Apalache>` if the connection is successful, or a `left<VerifyError>` if not.
 */
async function tryConnect(retry: boolean = false): Promise<VerifyResult<Apalache>> {
  return (await loadProtoDefViaReflection(retry)).map(loadGrpcClient).map(apalache)
}

function downloadAndUnpackApalache(): Promise<VerifyResult<null>> {
  const url = `https://github.com/informalsystems/apalache/releases/download/v${APALACHE_VERSION_TAG}/apalache.tgz`
  return fetch(url)
    .then(
      // unpack response body
      res => pipeline(res.body, tar.extract({ cwd: apalacheDistDir(), strict: true })),
      error => err(`Error fetching ${url}: ${error}`)
    )
    .then(
      _ => right(null),
      error => err(`Error unpacking .tgz: ${error}`)
    )
}

/**
 * Fetch the latest Apalache release pinned by `APALACHE_VERSION_TAG` from Github.
 *
 * @returns A promise resolving to:
 *    - a `right<string>` equal to the path the Apalache dist was unpacked to,
 *    - a `left<VerifyError>` indicating an error.
 */
async function fetchApalache(verbosityLevel: number): Promise<VerifyResult<string>> {
  const apalacheBinary = path.join(apalacheDistDir(), 'apalache', 'bin', 'apalache-mc')
  if (fs.existsSync(apalacheBinary)) {
    // Use existing download
    debugLog(verbosityLevel, `Using existing Apalache distribution in ${apalacheBinary}`)
    return right(apalacheBinary)
  } else {
    fs.mkdirSync(apalacheDistDir(), { recursive: true })
    process.stdout.write('Downloading Apalache distribution...')
    const res = await downloadAndUnpackApalache()
    process.stdout.write(' done.\n')
    return res.map(_ => apalacheBinary)
  }

  // TODO: This logic makes the CLI tool extremely sensitive to environment.
  // See https://github.com/informalsystems/quint/issues/1124
  // Fetch Github releases
  // return octokitRequest('GET /repos/informalsystems/apalache/releases').then(
  //   async resp => {
  //     // Find latest that satisfies `APALACHE_VERSION_TAG`
  //     const versions = resp.data.map((element: any) => element.tag_name)
  //     const latestTaggedVersion = semver.parse(semver.maxSatisfying(versions, APALACHE_VERSION_TAG))
  //     if (latestTaggedVersion === null) {
  //       return err(`Failed to deteremine a valid semver version vesion from ${versions} and ${APALACHE_VERSION_TAG}`)
  //     }
  //     // Check if we have already downloaded this release
  //     const unpackPath = apalacheDistDir()
  //     const apalacheBinary = path.join(unpackPath, 'apalache', 'bin', 'apalache-mc')
  //     if (fs.existsSync(apalacheBinary)) {
  //       // Use existing download
  //       console.log(`Using existing Apalache distribution in ${unpackPath}`)
  //       return right(unpackPath)
  //     } else {
  //       // No existing download, download Apalache dist
  //       fs.mkdirSync(unpackPath, { recursive: true })

  //       // Filter release response to get dist archive asset URL
  //       const taggedRelease = resp.data.find((element: any) => element.tag_name == latestTaggedVersion)
  //       const tgzAsset = taggedRelease.assets.find((asset: any) => asset.name == APALACHE_TGZ)
  //       const downloadUrl = tgzAsset.browser_download_url

  //       console.log(`Downloading Apalache distribution from ${downloadUrl}...`)
  //       return fetch(downloadUrl)
  //         .then(
  //           // unpack response body
  //           res => pipeline(res.body, tar.extract({ cwd: unpackPath, strict: true })),
  //           error => err(`Error fetching ${downloadUrl}: ${error}`)
  //         )
  //         .then(
  //           _ => right(unpackPath),
  //           error => err(`Error unpacking .tgz: ${error}`)
  //         )
  //     }
  //   },
  //   error => err(`Error listing the Apalache releases: ${error}`)
  // )
}

/**
 * Connect to an already running Apalache server, or – if unsuccessful – fetch
 * Apalache, spawn it, and connect to it.
 *
 * If an Apalache server is spawned, the child process exits when the parent process (i.e., this process) terminates.
 *
 * @returns A promise resolving to:
 *    - a `right<Apalache>` equal to the path the Apalache dist was unpacked to,
 *    - a `left<VerifyError>` indicating an error.
 */
async function connect(verbosityLevel: number): Promise<VerifyResult<Apalache>> {
  // Try to connect to Shai, and try to ping it
  const connectionResult = await tryConnect()
  // We managed to connect, simply return this connection
  if (connectionResult.isRight()) {
    return connectionResult
  }

  // Connection or pinging failed, download Apalache
  debugLog(verbosityLevel, 'No running Apalache server found, launching...')
  const exeResult = await fetchApalache(verbosityLevel)
  // Launch Apalache from download
  return exeResult
    .asyncChain(
      async exe =>
        new Promise<VerifyResult<void>>((resolve, _) => {
          debugLog(verbosityLevel, 'Launching Apalache server')
          const apalache = child_process.spawn(exe, ['server'])

          // Exit handler that kills Apalache if Quint exists
          function exitHandler() {
            debugLog(verbosityLevel, 'Shutting down Apalache server')
            try {
              process.kill(apalache.pid!)
            } catch (error: any) {
              // ESRCH is raised if no process with `pid` exists, i.e.,
              // if Apalache server exited on its own
              if (error.code == 'ESRCH') {
                debugLog(verbosityLevel, 'Apalache already exited')
              } else {
                throw error
              }
            }
          }

          if (apalache.pid) {
            // Apalache launched successfully

            // Install exit handler that kills Apalache if Quint exists
            process.on('exit', exitHandler.bind(null))
            process.on('SIGINT', exitHandler.bind(null))
            process.on('SIGUSR1', exitHandler.bind(null))
            process.on('SIGUSR2', exitHandler.bind(null))
            process.on('uncaughtException', exitHandler.bind(null))

            resolve(right(void 0))
          }
          // If Apalache fails to spawn, `apalache.pid` is undefined and 'error' is
          // emitted.
          apalache.on('error', error => resolve(err(`Failed to launch Apalache server: ${error.message}`)))
        })
    )
    .then(chain(() => tryConnect(true)))
}

/**
 * Log `msg` to the console if `verbosityLevel` implies debug output.
 *
 * @param verbosityLevel  the current verbosity level (set with --verbosity)
 * @param msg             the message to log
 */
function debugLog(verbosityLevel: number, msg: string) {
  if (verbosity.hasDebugInfo(verbosityLevel)) {
    console.log(msg)
  }
}

/**
 * Verifies the configuration `config` by model checking it with the Apalache server
 *
 * @param config
 *   an apalache configuration. See https://github.com/informalsystems/apalache/blob/main/mod-infra/src/main/scala/at/forsyte/apalache/infra/passes/options.scala#L255
 *
 * @returns right(void) if verification succeeds, or left(err) explaining the failure
 */
export async function verify(config: any, verbosityLevel: number): Promise<VerifyResult<void>> {
  const connectionResult = await connect(verbosityLevel)
  return connectionResult.asyncChain(conn => conn.check(config))
}
