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
  // the stack of expressions
  private exprStack: Computable[] = []

  topExpr () {
    return this.exprStack[0]
  }

  enterLiteral (expr: ir.TntBool | ir.TntInt | ir.TntStr) {
    const comp = {
      eval: function () {
        return just<any>(expr.value)
      },
    }

    this.exprStack.push(comp)
  }

  exitApp (app: ir.TntApp) {
    switch (app.opcode) {
      case 'iuminus':
        this.onUnaryMinus()
        break

      case 'iadd':
        this.onBinArith((i, j) => i + j)
        break

      case 'isub':
        this.onBinArith((i, j) => i - j)
        break

      case 'imul':
        this.onBinArith((i, j) => i * j)
        break

      case 'idiv':
        this.onBinArith((i, j) => i / j)
        break

      case 'imod':
        this.onBinArith((i, j) => i % j)
        break

      case 'ipow':
        this.onBinArith((i, j) => i ** j)
        break

      case 'igt':
        this.onBinArith((i, j) => i > j)
        break

      case 'ilt':
        this.onBinArith((i, j) => i < j)
        break

      case 'igte':
        this.onBinArith((i, j) => i >= j)
        break

      case 'ilte':
        this.onBinArith((i, j) => i <= j)
        break

      default:
    }
  }

  // pop two arithmetic values, combine them, and push the outcome
  private onBinArith (combine: (i: bigint, j: bigint) => (bigint | Boolean)) {
    const rhs = this.exprStack.pop()
    const lhs = this.exprStack.pop()
    if (lhs !== undefined && rhs !== undefined) {
      const comp = {
        eval: function () {
          return merge([lhs.eval(), rhs.eval()]).map(args =>
            combine(args[0], args[1])
          )
        },
      }
      this.exprStack.push(comp)
    }
  }

  // pop an arithmetic value and negate
  private onUnaryMinus () {
    const arg = this.exprStack.pop()
    if (arg !== undefined) {
      const comp = {
        eval: function () {
          return arg.eval().map(a => -a)
        },
      }
      this.exprStack.push(comp)
    }
  }
}
