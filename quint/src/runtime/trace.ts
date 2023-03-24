/*
 * Data structures for recording execution traces.
 *
 * Igor Konnov, 2023
 *
 * Copyright (c) Informal Systems 2022-2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { QuintApp } from '../quintIr'
import { RuntimeValue } from './impl/runtimeValue'

/**
 * A snapshot of how a single operator (e.g., an action) was executed.
 * In stack-based languages, this usually corresponds to a stack frame.
 * In Quint, it is simply the applied operator and the arguments.
 */
export interface ExecutionFrame {
  /**
   * The operator that was applied in this frame. 
   */
  app: QuintApp,
  /**
   * The actual runtime values that were used in the call.
   */
  args: RuntimeValue[]
  /**
   * The frames of the operators that were called by this operator.
   */ 
  subframes: ExecutionFrame[]
}

/**
 * A trace that is recorded when evaluating an action or an expression.
 * Since we are following the operator hierarchy, this trace is not just
 * a list, but it is a tree with ordered children.
 */
export interface ExecutionTree {
  /**
   * The top-level frames that were produced in an execution.
   * Normally, frames is a single-element array. However, the simulator
   * may produce multiple frames, when it executes several actions in a row.
   */
  frames: ExecutionFrame[]
}
