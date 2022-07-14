/*
 * Compiler to runtime objects.
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2021. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { just } from '@sweet-monads/maybe'

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
      get: function () {
        return just<any>(expr.value)
      },
    }

    this.exprStack.push(comp)
  }
}
