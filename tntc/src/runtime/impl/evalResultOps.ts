/*
 * Operations over EvalResult. This is an implementation module.
 * It should be used exclusively by the TNT simulator and transpiler.
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { Maybe, none, just } from '@sweet-monads/maybe'
import { Set, isSet, is as immutableIs } from 'immutable'

import {
  EvalResult, Interval, isInterval, isIterable
} from '../runtime'

/**
 * If a set is represented with a special form, e.g., intervals,
 * transform it to an immutable set via iteration.
 *
 * @param iterable an iterable collection of results
 * @return an immutable set of results
 * (probably much larger than the original object)
 */
export const toSet = (iterable: Iterable<EvalResult>): Set<EvalResult> => {
  if (isSet(iterable)) {
    return iterable as Set<EvalResult>
  } else {
    let set = Set.of<EvalResult>()
    for (const e of iterable as Iterable<EvalResult>) {
      set = set.add(e)
    }
    return set
  }
}

/**
  * If a value is iterable, convert it to an immutable set via toSet.
  *
  * @param value an evaluation result, maybe not Iterable
  * @return either the original value, if it is not iterable, or
  * an immutable set of results (probably much larger than the original object)
  */
export const toSetIfIterable = (value: EvalResult): EvalResult => {
  if (isSet(value) || !isIterable(value)) {
    return value
  } else {
    let set = Set.of<EvalResult>()
    for (const e of value as Iterable<EvalResult>) {
      set = set.add(e)
    }
    return set
  }
}

// does a set (as an iterable) contain an element?
export function
contains (iterable: Iterable<EvalResult>, elem: EvalResult): boolean {
  if (isSet(iterable)) {
    // do a (hopefully) less expensive test
    return iterable.includes(elem)
  } else {
    let found = false
    for (const other of iterable) {
      if (eq(elem, other)) {
        found = true
      }
    }

    return found
  }
}

// Is one set a subset of another (as iterables)?
export function isSubset
(from: Iterable<EvalResult>, to: Iterable<EvalResult>): boolean {
  if (isSet(from) && isSet(to)) {
    // do a (hopefully) less expensive test
    return from.isSubset(to)
  } else {
    // Do O(m * n) tests, where m and n are the cardinalities of lhs and rhs.
    // Maybe we should use a cardinality test, when it's possible.
    for (const l of from) {
      if (!contains(to, l)) {
        return false
      }
    }

    return true
  }
}

// equality over evaluation results,
// as defined in TNT, not JavaScript
export function eq
(lhs: EvalResult, rhs: EvalResult): boolean {
  if (typeof lhs === 'bigint' || typeof lhs === 'boolean') {
    return lhs === rhs
  } else if (isSet(lhs) && isSet(rhs)) {
    // delegate equality to immutable-js
    return immutableIs(lhs, rhs)
  } else if (isInterval(lhs) && isInterval(rhs)) {
    // TS is smart enough to see the first condition, but not the second one
    const rhsInt = rhs as Interval
    return lhs.first === rhsInt.first && lhs.last === rhsInt.last
  } else if (isIterable(lhs) && isIterable(rhs)) {
    // The worst case, e.g., comparing an interval to a set.
    // TS is smart enough to see the first condition, but not the second one
    const rhsIter = rhs as Iterable<EvalResult>
    return isSubset(lhs, rhsIter) && isSubset(rhsIter, lhs)
  } else {
    return false
  }
}

/**
 * Apply `f` to every element of `iterable` and either:
 *
 *  - return `none`, if one of the results in `none`, or
 *  - return `just` of the unpacked results.
 */
export function flatMap<T, R>
(iterable: Iterable<T>, f: (arg: T) => Maybe<R>): Maybe<Array<R>> {
  const results: R[] = []
  for (const arg of iterable) {
    const res = f(arg)
    if (res.isNone()) {
      return none<Array<R>>()
    } else {
      const { value } = res
      results.push(value)
    }
  }

  return just(results)
}
