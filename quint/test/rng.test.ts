import { describe, it } from 'mocha'
import { assert } from 'chai'

import { Rng, newRng } from '../src/rng'

function testForRange(rng: Rng, bound: bigint, nsamples: number) {
    for (let i = 0; i < nsamples; i++) {
      const state = rng.getState()
      const v = rng.next(bound)
      assert(0n <= v && v < bound,
             `${v} is not in the range [0, ${bound}), state = ${state}`)
    }
}

describe('rng', () => {
  it('produces big integers in the expected range', () => {
    // initialize with a random seed
    const rng = newRng()
    // produce some numbers in various ranges
    testForRange(rng, 10000n, 100000)
    testForRange(rng, 2n ** 16n, 10000)
    testForRange(rng, 2n ** 32n, 10000)
    testForRange(rng, 2n ** 32n + 1n, 10000)
    testForRange(rng, 2n ** 64n + 1n, 10000)
    testForRange(rng, 2n ** 64n + 3n * 5n * 7n * 11n, 10000)
    testForRange(rng, 2n ** 96n + 1n, 10000)
    testForRange(rng, 2n ** 96n + 3n * 5n * 7n * 11n, 10000)
    testForRange(rng, 2n ** 256n + 2n ** 33n + 11n, 10000)
  })
})
