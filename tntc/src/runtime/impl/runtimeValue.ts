/*
 * Implementation of evaluation results in the runtime.
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { Set, ValueObject, is as immutableIs } from 'immutable'

import { expressionToString } from '../../IRprinting'

import { EvalResult } from '../runtime'
import { TntEx } from '../../tntIr'

/** The default entry point of this module */
export default rv

/**
 * A factory of runtime values that should be used to instantiate new values.
 */

export const rv = {
  mkBool: (value: boolean): RuntimeValue => {
    return new RuntimeValueBool(value)
  },

  mkInt: (value: bigint): RuntimeValue => {
    return new RuntimeValueInt(value)
  },

  mkSet: (elems: Iterable<RuntimeValue>): RuntimeValue => {
    return new RuntimeValueSet(Set(elems))
  },

  mkInterval: (first: bigint, last: bigint): RuntimeValue => {
    return new RuntimeValueInterval(first, last)
  },
}

/**
 * A runtime value produced and consumed by the simulator.  The structure of
 * the runtime values is not exposed to the users.
 *
 * Since runtime values are internal to the simulator, we implement the
 * set-like operations over all runtime values. This simplifies the simulator
 * code, as it does not have to distinguish between iterable values and
 * non-iterable ones. Of course, this may lead to ill-typed operations. Type
 * correctness of the input must be checked by the type checker.
 */
export interface RuntimeValue
  extends EvalResult, ValueObject, Iterable<RuntimeValue> {

  /**
   * Can the runtime value behave like a set? Effectively, this means
   * that the value returns a sequence of elements, when it is iterated.
   */
  isSetLike: boolean

  /**
   * Transform this runtime value into the normal form, so it can be
   * added to an immutable set:
   *
   *  - integers and literals are already in the normal form,
   *  - immutable sets are in the normal form,
   *  - intervals and powers set are converted to immutable sets.
   */
  normalForm (): RuntimeValue

  /**
   * If the result is set-like, transform it to an immutable
   * set via iteration. Otherwise, return an empty set.
   * This is useful for special sets such as intervals.
   *
   * @return an immutable set of results
   * (probably much larger than the original object)
   */
  toSet (): Set<RuntimeValue>

  /**
   * If the result contains a Boolean value, return it. Otherwise, return false.
   *
   * @return the stored Boolean value (if it's Boolean), or false.
   */
  toBool (): boolean

  /**
   * If the result contains an integer value, return it. Otherwise, return 0n.
   *
   * @return the stored integer value (if it's integer) or 0n.
   */
  toInt (): bigint

  /**
    * If the result is set-like, does it contain contain a value?
    * If the result is not set-like, return false.
    *
    * @param elem evaluation result to check for membership
    * @return true, if `value` appears in the result
    */
  contains (value: RuntimeValue): boolean

  /**
    * If this runtime value is set-like, does it contain all elements of
    * another set-like runtime value?
    *
    * @param superset set-like collection of runtime values
    * @result true if all elements of this are included
    * or equal to the elements of `superset`
    */
  isSubset (superset: RuntimeValue): boolean
}

/**
 * The default implementation of the common methods.
 * This implementation is hidden from the module user.
 */
abstract class RuntimeValueBase implements RuntimeValue {
  isSetLike: boolean

  constructor (isSetLike: boolean) {
    this.isSetLike = isSetLike
  }

  [Symbol.iterator] () {
    return {
      next (): IteratorResult<RuntimeValue> {
        return { done: true, value: undefined }
      },
    }
  }

  normalForm (): RuntimeValue {
    if (!this.isSetLike) {
      return this
    } else {
      return new RuntimeValueSet(this.toSet())
    }
  }

  toSet (): Set<RuntimeValue> {
    // the default transformation to a set is done via iteration
    let set = Set.of<RuntimeValue>()
    for (const e of this) {
      set = set.add(e.normalForm())
    }
    return set
  }

  toBool (): boolean {
    if (this instanceof RuntimeValueBool) {
      return (this as RuntimeValueBool).value
    } else {
      return false
    }
  }

  toInt (): bigint {
    if (this instanceof RuntimeValueInt) {
      return (this as RuntimeValueInt).value
    } else {
      return 0n
    }
  }

  contains (elem: RuntimeValue): boolean {
    // the default search is done via iteration, which is the worst case
    let found = false
    // the element may be in a special form (e.g., an interval), normalize
    const elemNorm = elem.normalForm()
    for (const other of this) {
      if (other.equals(elemNorm)) {
        found = true
      }
    }

    return found
  }

  isSubset (superset: RuntimeValue): boolean {
    // Do O(m * n) tests, where m and n are the cardinalities of lhs and rhs.
    // Maybe we should use a cardinality test, when it's possible.
    for (const e of this) {
      if (!superset.contains(e)) {
        return false
      }
    }

    return true
  }

  equals (other: unknown): boolean {
    if (typeof other !== 'object' || other === null) {
      return false
    }
    if (!(other instanceof RuntimeValueBase)) {
      return false
    }
    if (this instanceof RuntimeValueBool && other instanceof RuntimeValueBool) {
      return this.value === other.value
    }
    if (this instanceof RuntimeValueInt && other instanceof RuntimeValueInt) {
      return this.value === other.value
    }
    if (this instanceof RuntimeValueSet && other instanceof RuntimeValueSet) {
      return immutableIs(this.set, other.set)
    }
    if (this instanceof RuntimeValueInterval &&
        other instanceof RuntimeValueInterval) {
      return this.first === other.first && this.last === other.last
    }
    if (this.isSetLike && other.isSetLike) {
      // for instance, an interval and an explicit set
      return immutableIs(this.toSet(), other.toSet())
    }

    return false
  }

  hashCode (): number {
    // the default implementation, to make it compatible with RuntimeValue
    return 0
  }

  toTntEx (): TntEx {
    // the default implementation, to make it compatible with RuntimeValue
    return {
      id: 0n,
      kind: 'bool',
      value: false,
    }
  }
}

class RuntimeValueBool extends RuntimeValueBase implements RuntimeValue {
  value: boolean

  constructor (value: boolean) {
    super(false)
    this.value = value
  }

  hashCode (): number {
    return this.value ? 1 : 0
  }

  toTntEx (): TntEx {
    return {
      id: 0n,
      kind: 'bool',
      value: this.value,
    }
  }
}

class RuntimeValueInt extends RuntimeValueBase implements ValueObject {
  value: bigint

  constructor (value: bigint) {
    super(false)
    this.value = value
  }

  hashCode (): number {
    // wrap to a 32-bit unsigned integer and convert to a number
    return Number(BigInt.asUintN(32, this.value))
  }

  toTntEx (): TntEx {
    return {
      id: 0n,
      kind: 'int',
      value: this.value,
    }
  }
}

class RuntimeValueSet extends RuntimeValueBase implements RuntimeValue {
  set: Set<RuntimeValue>

  constructor (set: Set<RuntimeValue>) {
    super(true)
    this.set = set
  }

  [Symbol.iterator] () {
    return this.set[Symbol.iterator]()
  }

  hashCode (): number {
    return this.set.hashCode()
  }

  isSubset (superset: RuntimeValue): boolean {
    if (superset instanceof RuntimeValueSet) {
      // do a (hopefully) less expensive test
      return this.set.isSubset(superset.set)
    } else {
      // do the default test via iteration
      return super.isSubset(superset)
    }
  }

  toSet (): Set<RuntimeValue> {
    return this.set
  }

  contains (elem: RuntimeValue): boolean {
    // do a (hopefully) less expensive test
    return this.set.includes(elem.normalForm())
  }

  toTntEx (): TntEx {
    // Sets are tricky, as we have to normalize them when producing TntEx.
    // The most common normal form is the one that sorts sets according
    // to their string representation. Instead of computing the string
    // representation multiple times, we cache it in `__str` and then forget it.
    function cacheStr (e: TntEx) {
      return {
        ...e,
        __str: expressionToString(e),
      }
    }
    // Normalize the elements by sorting them
    const elems: (TntEx & { __str?: string })[] =
      this.set
        .map(e => e.toTntEx())
        .map(cacheStr)
        .toArray()
        .sort((e1, e2) => e1.__str.localeCompare(e2.__str))
    // erase the string cache
    elems.forEach(e => delete e.__str)
    // return the expression set(...elems)
    return {
      id: 0n,
      kind: 'app',
      opcode: 'set',
      args: elems,
    }
  }
}

class RuntimeValueInterval extends RuntimeValueBase implements RuntimeValue {
  first: bigint
  last: bigint

  constructor (first: bigint, last: bigint) {
    super(true)
    this.first = first
    this.last = last
  }

  [Symbol.iterator] () {
    return new IntervalIterator(this.first, this.last)
  }

  hashCode (): number {
    // wrap the sum to a 32-bit unsigned integer and convert to a number
    return Number(BigInt.asUintN(32, this.first + this.last))
  }

  contains (elem: RuntimeValue): boolean {
    if (elem instanceof RuntimeValueInt) {
      return this.first <= elem.value && elem.value <= this.last
    } else {
      return false
    }
  }

  toTntEx (): TntEx {
    // simply enumerate the values in the interval first..last
    const elems: TntEx[] = []
    for (const i of this) {
      elems.push(i.toTntEx())
    }
    // return the expression set(...elems)
    return {
      id: 0n,
      kind: 'app',
      opcode: 'set',
      args: elems,
    }
  }
}

// an iterator over intervals
class IntervalIterator implements Iterator<RuntimeValue> {
  private current: bigint
  private end: bigint

  constructor (first: bigint, last: bigint) {
    this.current = first
    this.end = last
  }

  next (): IteratorResult<RuntimeValue> {
    if (this.current <= this.end) {
      return {
        done: false,
        value: new RuntimeValueInt(this.current++),
      }
    } else {
      return { done: true, value: undefined }
    }
  }
}
