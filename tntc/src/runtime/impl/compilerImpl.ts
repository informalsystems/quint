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
import { Set, isSet } from 'immutable'
import isEqual from 'lodash.isequal'

import { IRVisitor } from '../../IRVisitor'
import { Computable, fail } from '../runtime'

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
        // Equality is a very general operator.
        // In the current implementation,
        // it would only work for scalar values: Booleans and integers.
        this.applyFun(2, (x: any, y: any) => x === y)
        break

      case 'neq':
        // For the moment, we are using the JS inequality.
        // In the future, we should negate the more general form of equality.
        this.applyFun(2, (x: any, y: any) => x !== y)
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

      case 'exists':
        this.translateExists()
        break

      default:
        throw new Error(`Translation of ${app.opcode} is not implemented`)
    }
  }

  private translateExists () {
    if (this.compStack.length <= 2) {
      throw new Error('Not enough parameters on compStack')
    }
    // the predicate parameter, which we iteratively set to each element
    const param = this.compStack.pop() as Computable & WithRegister<any>
    // the body of the predicate, usually, a lambda
    const pred = this.compStack.pop() ?? fail
    // the iterator body
    const exists = function (elem: any): boolean {
      // store the set element on the register
      param.register = just(elem)
      // Evaluate the predicate using the register.
      // We need deep equality here, as just is an object.
      return isEqual(pred.eval(), just(true))
    }
    this.applyFun(1, (set: any) => {
      if (isSet(set)) {
        return set.find(exists) !== undefined
      } else {
        throw new Error('Expected a set')
      }
    })
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

// a computable value with register
interface WithRegister<T> {
  // register is a placeholder where iterators can put their values
  register: Maybe<T>
}
