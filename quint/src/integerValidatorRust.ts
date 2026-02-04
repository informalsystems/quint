/* ----------------------------------------------------------------------------------
 * Copyright 2025 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Validator for integer literals to ensure they fit within the Rust evaluator's
 * i64 range.
 *
 * @author Yassine Boukhari
 */

import { QuintEx, QuintModule } from './ir/quintIr'
import { QuintError } from './quintError'
import { IRVisitor, walkExpression, walkModule } from './ir/IRVisitor'

const I64_MIN = -(2n ** 63n)
const I64_MAX = 2n ** 63n - 1n

function createError(value: bigint, context: string, id: bigint): QuintError {
  return {
    code: 'QNT600',
    message:
      `Integer literal ${value}${context} is outside i64 range. ` +
      `The Rust evaluator uses i64 for integer arithmetic.`,
    reference: id,
  }
}

/**
 * Scan modules and expressions for integer literals outside i64 range.
 */
export function validateIntegerBounds(modules: QuintModule[], exprs: QuintEx[], context: string = ''): QuintError[] {
  const errors: QuintError[] = []
  const contextMsg = context ? ` in ${context}` : ''

  const visitor: IRVisitor = {
    enterLiteral(expr) {
      if (expr.kind === 'int' && (expr.value < I64_MIN || expr.value > I64_MAX)) {
        errors.push(createError(expr.value, contextMsg, expr.id))
      }
    },
  }

  modules.forEach(m => walkModule(visitor, m))
  exprs.forEach(e => walkExpression(visitor, e))

  return errors
}
