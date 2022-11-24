/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Inference for types. Uses constraint generation and solving to infer types
 * for each expression inside a module
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { ErrorTree } from '../errorTree'
import { walkModule } from '../IRVisitor'
import { LookupTableByModule } from '../lookupTable'
import { TntModule } from '../tntIr'
import { TypeScheme } from './base'
import { ConstraintGeneratorVisitor } from './constraintGenerator'
import { solveConstraint } from './constraintSolver'

/**
 * Infers an type for each expression in a TNT module
 *
 * @param tntModule: the TNT module to infer types for
 *
 * @returns a map from expression ids to their types when inferrence succeeds.
 *          Otherwise, a map from expression ids to the corresponding error for
 *          the problematic expressions.
 */
export function inferTypes(
  tntModule: TntModule, table: LookupTableByModule
): [Map<bigint, ErrorTree>, Map<bigint, TypeScheme>] {
  const visitor = new ConstraintGeneratorVisitor(solveConstraint, table)
  walkModule(visitor, tntModule)
  // Since all top level expressions are operator definitions, and all
  // constraints are solved at those, there's no need to solve anything else
  return [visitor.errors, visitor.types]
}
