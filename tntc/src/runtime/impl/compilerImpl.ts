/*
 * Compiler to Computable values (in the runtime).
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { strict as assert } from 'assert'
import { Maybe, none, just, merge } from '@sweet-monads/maybe'
import { Set, isSet, is as immutableIs } from 'immutable'

import { IRVisitor } from '../../IRVisitor'
import { Computable, EvalResult, fail } from '../runtime'

import * as ir from '../../tntIr'

/**
 * Compiler visitor turns TNT definitions and expressions into Computable
 * objects, essentially, lazy JavaScript functions. Importantly, it does not do
 * any evaluation during the translation and thus delegates the actual
 * computation to the JavaScript engine. Since many of TNT operators may be
 * computationally expensive, it is crucial to maintain this separation of
 * compilation vs. computation.
 *
 * This class does not do any dynamic type checking, assuming that the type checker
 * will be run before the translation in the future. As we do not have the type
 * checker yet, computations may fail with weird JavaScript errors.
 */
export class CompilerVisitor implements IRVisitor {
  // the stack of computable values
  private compStack: Computable[] = []
  // the map of definition and variable names
  // as well as of definition parameters to translated values
  private context: Map<string, Computable> = new Map<string, Computable>()

  /**
   * Get a computable assigned to a name.
   *
   * @param name the definition name
   * @return the Computable value assigned to the name, or undefined
   */
  findByName (name: string) {
    return this.context.get(name)
  }

  exitOpDef (opdef: ir.TntOpDef) {
    // for now, we handle only 'val'
    assert(opdef.qualifier === 'val', `Expected 'val', found: ${opdef.qualifier}`)
    const defBody = this.compStack.pop()
    assert(defBody, `No expression for ${opdef.name} on compStack`)
    this.context.set(opdef.name, defBody)
  }

  enterLiteral (expr: ir.TntBool | ir.TntInt | ir.TntStr) {
    if (expr.kind === 'str') {
      throw new Error(`Found ${expr}, strings are not supported`)
    }

    this.compStack.push(this.mkLiteral(expr.value))
  }

  enterName (name: ir.TntName) {
    const comp = this.context.get(name.name)
    // this may happen, see: https://github.com/informalsystems/tnt/issues/129
    assert(comp, `Name ${name.name} not found (out of order?)`)
    this.compStack.push(comp)
  }

  exitApp (app: ir.TntApp) {
    switch (app.opcode) {
      case 'eq':
        this.applyFun(2, (x: any, y: any) => this.eq(x, y))
        break

      case 'neq':
        this.applyFun(2, (x: any, y: any) => !this.eq(x, y))
        break

      // conditional
      case 'ite':
        this.translateIfThenElse()
        break

      // Booleans
      case 'not':
        this.applyFun(1, (p: Boolean) => !p)
        break

      case 'and':
        this.applyFun(2, (p: Boolean, q: Boolean) => p && q)
        break

      case 'or':
        this.applyFun(2, (p: Boolean, q: Boolean) => p || q)
        break

      case 'implies':
        this.applyFun(2, (p: Boolean, q: Boolean) => !p || q)
        break

      case 'iff':
        this.applyFun(2, (p: Boolean, q: Boolean) => p === q)
        break

      // integers
      case 'iuminus':
        this.applyFun(1, (n: bigint) => -n)
        break

      case 'iadd':
        this.applyFun(2, (i: bigint, j: bigint) => i + j)
        break

      case 'isub':
        this.applyFun(2, (i: bigint, j: bigint) => i - j)
        break

      case 'imul':
        this.applyFun(2, (i: bigint, j: bigint) => i * j)
        break

      case 'idiv':
        this.applyFun(2, (i: bigint, j: bigint) => i / j)
        break

      case 'imod':
        this.applyFun(2, (i: bigint, j: bigint) => i % j)
        break

      case 'ipow':
        this.applyFun(2, (i: bigint, j: bigint) => i ** j)
        break

      case 'igt':
        this.applyFun(2, (i: bigint, j: bigint) => i > j)
        break

      case 'ilt':
        this.applyFun(2, (i: bigint, j: bigint) => i < j)
        break

      case 'igte':
        this.applyFun(2, (i: bigint, j: bigint) => i >= j)
        break

      case 'ilte':
        this.applyFun(2, (i: bigint, j: bigint) => i <= j)
        break

      case 'set':
        this.applyFun(app.args.length, (...values: any[]) => Set.of(...values))
        break

      case 'contains':
        this.applyFun(2, (set: any, value: any) => set.includes(value))
        break

      case 'in':
        this.applyFun(2, (value: any, set: any) => set.includes(value))
        break

      case 'subseteq':
        this.applyFun(2,
          function<A> (lhs: Set<A>, rhs: Set<A>): boolean {
            return lhs.isSubset(rhs)
          }
        )
        break

      case 'union':
        this.applyFun(2,
          function<A> (lhs: Set<A>, rhs: Set<A>): Set<A> {
            return lhs.union(rhs)
          }
        )
        break

      case 'intersect':
        this.applyFun(2,
          function<A> (lhs: Set<A>, rhs: Set<A>): Set<A> {
            return lhs.intersect(rhs)
          }
        )
        break

      case 'exclude':
        this.applyFun(2,
          function<A> (lhs: Set<A>, rhs: Set<A>): Set<A> {
            return lhs.subtract(rhs)
          }
        )
        break

      case 'exists':
        this.applyLambdaToSet(
          e => e,
          set => set.find(e => e === true) !== undefined
        )
        break

      case 'forall':
        this.applyLambdaToSet(
          e => e,
          set => set.find(e => e === false) === undefined
        )
        break

      case 'map':
        this.applyLambdaToSet(
          e => e,
          set => set.map(e => e)
        )
        break

      case 'filter':
        this.applyLambdaToSet(
          (r, e) => [e, r],
          (set) =>
            set
              .filter(([e, r]) => r === true)
              .map(([e, r]) => e)
        )
        break

      default:
        throw new Error(`Translation of ${app.opcode} is not implemented`)
    }
  }

  enterLambda (lam: ir.TntLambda) {
    // introduce a register for every parameter
    lam.params.forEach(p => {
      const withRegister = {
        // register is a placeholder where iterators can store their values
        register: none<any>(),
        eval: function () {
          return this.register
        },
      }
      this.context.set(p, withRegister)
    })
    // After this point, the body of lambda gets compiled.
    // The body of lambda may refer to the parameters via names,
    // which are translated to computables with registers.
  }

  exitLambda (lam: ir.TntLambda) {
    // The expression on the stack is the body of lambda.
    // However, we have to populate the registers to evaluate the expression.
    // Move the registers on the computation stack.
    lam.params.forEach(p => {
      const comp = this.context.get(p)
      if (comp !== undefined) {
        this.compStack.push(comp)
        this.context.delete(p)
      } else {
        throw new Error(`Corrupted lambda context, parameter ${p} not found`)
      }
    })
  }

  /**
    * A generalized application of a one-argument lambda expression
    * to a set, as required by `exists`, `forall`, `map`, and `filter`.
    *
    * This method expects `compStack` to look like follows:
    *
    * - `(top)` the register object, as `Computable & WithRegister`.
    * - `(top - 1)`: the lambda body, as `Computable`.
    * - `(top - 2)`: the set to iterate over, as `Computable`.
    *
    * The method evaluates the lambda body against each set
    * element and maps the result and the element with `evalAndElemMap`.
    * The resulting set is further transformed by `resultsMap`
    * and then it is saved on `compStack`.
    */
  private applyLambdaToSet<E, R, T>
  (evalAndElemMap: (res: EvalResult, elem: E) => R,
    resultsMap: (set: Set<R>) => T) {
    if (this.compStack.length <= 2) {
      throw new Error('Not enough parameters on compStack')
    }
    // the lambda parameter, which we iteratively set to each element
    const param = this.compStack.pop() as Computable & WithRegister<any>
    // the body of the lambda to apply
    const lambdaBody = this.compStack.pop() ?? fail
    // evaluate lambda against a single element of the set
    const evaluateElem = function (elem: E): Maybe<R> {
      // store the set element on the register
      param.register = just(elem)
      // Evaluate the predicate using the register.
      // We need deep equality here, as just is an object.
      return lambdaBody.eval().map(r => evalAndElemMap(r, elem))
    }
    this.applyFun(1, (set: Set<E>) => {
      if (isSet(set)) {
        // Evaluate all elements using `elemMap`.
        // For some of them, evaluation may fail. Hence, we map them to `Maybe`.
        // Is there other way to compose iterators of immutable-js with `Maybe`?
        const results = set.map(evaluateElem)
        if (results.find(e => e.isNone()) !== undefined) {
          // one of the results is undefined
          return none()
        } else {
          // all results are defined, call the set transformation
          return resultsMap(results.map(maybeGet) as Set<R>)
        }
      } else {
        throw new Error('Expected a set')
      }
    })
  }

  // make a `Computable` that always returns a given literal
  private mkLiteral (value: any) {
    return {
      eval: () => {
        return just<any>(value)
      },
    }
  }

  // pop nargs computable values, pass them the 'fun' function, and
  // push the combined computable value on the stack
  private applyFun (nargs: number, fun: (...args: any[]) => any) {
    if (this.compStack.length >= nargs) {
      // pop nargs elements of the compStack
      const args = this.compStack.splice(-nargs, nargs)
      // produce the new computable value
      const comp = {
        eval: () => {
          // compute the values of the arguments at this point
          const values = args.map(a => a.eval())
          // if they are all defined, apply the function 'fun' to the arguments
          return merge(values).map(vs => fun(...vs))
        },
      }
      this.compStack.push(comp)
    } else {
      throw new Error('Not enough arguments on the stack')
    }
  }

  // equality over evaluation results,
  // as defined in TNT, not JavaScript
  private eq (lhs: EvalResult, rhs: EvalResult): boolean {
    if (typeof lhs === 'bigint' || typeof lhs === 'boolean') {
      return lhs === rhs
    } else if (isSet(lhs) && isSet(rhs)) {
      return immutableIs(lhs, rhs)
    } else {
      return false
    }
  }

  // if-then-else requires special treatment,
  // as it should not evaluate both arms
  private translateIfThenElse () {
    if (this.compStack.length >= 3) {
      // pop 3 elements of the compStack
      const [cond, thenArm, elseArm] = this.compStack.splice(-3, 3)
      // produce the new computable value
      const comp = {
        eval: () => {
          // compute the values of the arguments at this point
          const v =
            cond.eval().map(pred => pred ? thenArm.eval() : elseArm.eval())
          return v.join()
        },
      }
      this.compStack.push(comp)
    } else {
      throw new Error('Not enough arguments on the stack')
    }
  }
}

// Unpack Maybe, when we know that it's defined.
// We need it to compose with the code that is not aware of Maybe.
// And it is annoying that Maybe does not have this function.
function maybeGet<T> (maybe: Maybe<T>): T {
  if (maybe.isJust()) {
    const { value } = maybe
    return value
  } else {
    throw new Error('Applied maybeGet to none()')
  }
}

// a computable value with register
interface WithRegister<T> {
  // register is a placeholder where iterators can put their values
  register: Maybe<T>
}
