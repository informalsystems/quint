/*
 * The interface to a pseudo random number generator. Currently, we are using
 * the "squares" fast random number generator.
 *
 * See: Bernard Widynski. Squares: A Fast Counter-Based RNG. Arxiv, May 5, 2020.
 *
 * [1]: https://arxiv.org/pdf/2004.06278v2.pdf
 *
 * We have tried to use the package 'squares-rng', but it was too hard to make
 * it run with NodeJS and VSCode, as 'squares-rng' is using the ESM modules.
 *
 * [squares-rng]: https://github.com/FlorisSteenkamp/squares-rng
 *
 * Hence, we have implemented the 'squares' function from the paper.  Whereas
 * the squares-rng package is using JS numbers and thus limits the number of
 * produced integers to 2^32, we are using big integers and thus free to
 * produce up to 2^64 integers, as in the original paper. Also, we are using a
 * different key.
 *
 * Igor Konnov, Informal Systems, 2023.
 *
 * Copyright (c) Informal Systems 2022-2023. All rights reserved.  Licensed
 * under the Apache 2.0.  See License.txt in the project root for license
 * information.
 */

/**
 * An interface to a random number generator that has the following property:
 * At any point in time we can extract the current state `s` and use it later to
 * reproduce the same sequence of numbers: `f[s], f[s + 1], ...`.
 */
export interface Rng {
  /**
   * Get the current state of the RNG, which can be reset with `setState`.
   */
  getState(): string

  /**
   * Reset the RNG with the previously obtained state.
   */
  setState(state: string): void

  /**
   * Produce the next pseudo-random big integer in the range [0, bound)
   * using the current state. Advance the state.
   *
   * @param bound a non-negative big integer that is used as the bound
   */
  next(bound: bigint): bigint
}

// 2^32 as bigint
const U32: bigint = 0x100000000n

// 2^64 as bigint
const U64: bigint = 0x10000000000000000n

/**
 * Create a new instance of Rng, initialized from the current time and
 * other system state. If you want to initialize the random number generator
 * with a seed, create a new instance first, and then call `setState`.
 */
export const newRng = (): Rng => {
  // Produce a random integer with the system RNG.
  // Since the system generator is using `number`,
  // the number is in the range of [0, 2^53).
  let state: bigint =
    BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
  return {
    getState: (): string => {
      return '0x' + state.toString(16)
    },

    setState: (s: string): void => {
      state = BigInt(s) % U64
    },

    next: (bound: bigint): bigint => {
      let input: bigint = bound > 0n ? bound : 1n
      let output: bigint = 0n
      let base: bigint = 1n
      while (input >= U32) {
        // produce pseudo-random least significant 32 bits,
        // while shifting the previous output to the left
        output = (output * U32) + squares64(state)
        // advance the RNG state
        state++
        // forget the least significant 32 bits of the input
        input /= U32
        // shift the base by 32 bits to the left
        base *= U32
      }
      // Now we have to be careful to make `output` in the range [0, bound).
      // Produce 32 bits. Since we are using the modulo operator here,
      // the result is not exactly the uniform distribution.
      // It may be biased towards some values, especially for
      // the small values of `bound. If it becomes a problem in the future,
      // we should figure out, how to make the distribution uniform.
      output = (squares64(state) % input) * base + output
      // advance the RNG state
      state++
      return output
    },
  }
}

/**
 * One of the keys used in this implementation. This is the key number 4.
 *
 * See: https://squaresrng.wixsite.com/rand
 */
const key: bigint = 0xfb9e125878fa6cb3n

/**
 * Our TypeScript implementation of the below C code from the paper [1].
 * We are not using the JS shift operators `<<` and `>>`, which go over
 * conversions to 32-bit integers. Instead, we simply use `/` and `%` over
 * bigint. One has to do measurements, to see what is more efficient.
 * Since the reproducibility and the ability to restore the state is the key
 * for us, and not the performance, this should be fine.
 *
 * This implementation produces up to 2^64 pseudo random unsigned
 * 32-bit integers, in contrast to the squares-rng package, which
 * produces up to 2^32 pseudo random unsigned 32-bit integers.
 *
 * The C code from the paper [1]:
 *
 * ```c
 * inline static uint32_t squares(uint64_t ctr, uint64_t key) {
 *   uint64_t x, y, z;
 *   y = x = ctr * key; z = y + key;
 *   x = x*x + y; x = (x>>32) | (x<<32); // round 1
 *   x = x*x + z; x = (x>>32) | (x<<32); // round 2
 *   return (x*x + y) >> 32; // round 3
 * }
 * ```
 */
const squares64 = (counter: bigint): bigint => {
  let x = (counter * key) % U64
  let y = x
  let z = (y + key) % U64
  x = (((x * x) % U64) + y) % U64
  // round 1
  x = ((x / U32) + ((x * U32) % U64)) % U64
  x = (((x * x) % U64) + z) % U64
  // round 2
  x = ((x / U32) + ((x * U32) % U64)) % U64
  // round 3
  return ((((x * x) % U64) + y) % U64) / U32
}