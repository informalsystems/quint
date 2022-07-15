/*
 * Compiler to runtime objects.
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2021. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { just, merge } from '@sweet-monads/maybe'

import { IRVisitor } from '../../IRVisitor'
import { Computable } from '../runtime'
import * as ir from '../../tntIr'

export class CompilerVisitor implements IRVisitor {
  // the stack of computable values
  private compStack: Computable[] = []

  topExpr () {
    return this.compStack[0]
  }

  enterLiteral (expr: ir.TntBool | ir.TntInt | ir.TntStr) {
    const comp = {
      eval: function () {
        return just<any>(expr.value)
      },
    }

    this.compStack.push(comp)
  }

  exitApp (app: ir.TntApp) {
    switch (app.opcode) {
      case 'iuminus':
        this.combineExprs(1, (n: bigint) => -n)
        break

      case 'iadd':
        this.combineExprs(2, (i: bigint, j: bigint) => i + j)
        break

      case 'isub':
        this.combineExprs(2, (i: bigint, j: bigint) => i - j)
        break

      case 'imul':
        this.combineExprs(2, (i: bigint, j: bigint) => i * j)
        break

      case 'idiv':
        this.combineExprs(2, (i: bigint, j: bigint) => i / j)
        break

      case 'imod':
        this.combineExprs(2, (i: bigint, j: bigint) => i % j)
        break

      case 'ipow':
        this.combineExprs(2, (i: bigint, j: bigint) => i ** j)
        break

      case 'igt':
        this.combineExprs(2, (i: bigint, j: bigint) => i > j)
        break

      case 'ilt':
        this.combineExprs(2, (i: bigint, j: bigint) => i < j)
        break

      case 'igte':
        this.combineExprs(2, (i: bigint, j: bigint) => i >= j)
        break

      case 'ilte':
        this.combineExprs(2, (i: bigint, j: bigint) => i <= j)
        break

      default:
    }
  }

  // pop nargs computable values, pass them the 'fun' function, and
  // push the combined computable value on the stack
  private combineExprs (nargs: number, fun: (...args: any[]) => any) {
    if (this.compStack.length >= nargs) {
      // pop nargs elements of the compStack
      const args = this.compStack.splice(-nargs, nargs)
      // produce the new computable value
      const comp = {
        eval: function () {
          // compute the values of the arguments at this point
          const values = args.map(a => a.eval())
          // if they are all defined, apply the function 'fun' to the arguments
          return merge(values).map(vs =>
            fun(...vs)
          )
        },
      }
      this.compStack.push(comp)
    } // else TODO: report an error to the listener
  }
}
