import type { Buffer } from 'buffer'
import type { PackageDefinition as ProtoPackageDefinition } from '@grpc/proto-loader'
import { apalacheDistDir } from './config'
import { Readable } from 'stream'

/**
 * A server endpoint for establishing a connection with the Apalache server.
 */

function downloadAndUnpackApalache(apalacheVersion: string): Promise<ApalacheResult<null>> {
  const url = `https://github.com/apalache-mc/apalache/releases/download/v${apalacheVersion}/apalache.tgz`
  return fetch(url)
    .then(
      // unpack response body
      res => pipeline(Readable.fromWeb(res.body! as any), tar.extract({ cwd: apalacheDistDir(apalacheVersion), strict: true })),
      error => err(`Error fetching ${url}: ${error}`)
    )
    .then(
      _ => right(null),
      error => err(`Error unpacking ${url}: ${error}`)
    )
} 