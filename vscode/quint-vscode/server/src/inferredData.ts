/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Infer types, effects and modes for quint modules, reporting the result and
 * possible errors in LSP-friendly format.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import {
  Effect,
  Loc,
  LookupTableByModule,
  OpQualifier,
  QuintModule,
  TypeScheme,
  checkModes,
  effectToString,
  inferEffects,
  inferTypes,
  typeSchemeToString
} from "@informalsystems/quint"
import { Diagnostic } from "vscode-languageserver"
import { diagnosticsFromErrorMap } from "./reporting"

interface InferredEffects {
  effects: Map<Loc, string>
  originalEffects: Map<bigint, Effect>
}

interface InferredTypes {
  types: Map<Loc, string>
  originalTypes: Map<bigint, TypeScheme>
}

interface InferredModes {
  modes: Map<bigint, OpQualifier>
}

/* Interface with inferred types, effects and modes */
export type InferredData = InferredEffects & InferredTypes & InferredModes

/**
 * Check types, effects and modes for a module.
 *
 * @param quintModule: the Quint module to infer information for
 * @param sourceMap: a map from expression ids to their locations
 * @param table: the lookup table for the module and any used modules
 *
 * @returns a promise with the inferred data or a list of diagnostics
 */
export function checkTypesAndEffects(
  quintModule: QuintModule, sourceMap: Map<bigint, Loc>, table: LookupTableByModule
): Promise<InferredData> {
  const [typeDiags, types] = checkTypes(quintModule, sourceMap, table)
  const [effectDiags, effects] = checkEffects(quintModule, sourceMap, table)
  const [modeDiags, modes] = checkDefinitionModes(quintModule, sourceMap, effects)

  const diagnostics = typeDiags.concat(effectDiags).concat(modeDiags)
  if (diagnostics.length > 0) {
    return new Promise((_resolve, reject) => reject(diagnostics))
  } else {
    return new Promise((resolve, _reject) => resolve({ ...types, ...effects, ...modes }))
  }
}

function checkEffects(
  quintModule: QuintModule, sourceMap: Map<bigint, Loc>, table: LookupTableByModule
): [Diagnostic[], InferredEffects] {
  const [errors, inferredEffects] = inferEffects(table, quintModule)
  const effects: Map<Loc, string> = new Map<Loc, string>()
  const diagnostics = diagnosticsFromErrorMap(errors, sourceMap)

  inferredEffects.forEach((effect, id) => effects.set(sourceMap.get(id)!, effectToString(effect)))

  return [diagnostics, { effects, originalEffects: inferredEffects }]
}

function checkTypes(
  quintModule: QuintModule, sourceMap: Map<bigint, Loc>, table: LookupTableByModule
): [Diagnostic[], InferredTypes] {
  const [errors, inferredTypes] = inferTypes(table, quintModule)
  const types: Map<Loc, string> = new Map<Loc, string>()
  const diagnostics = diagnosticsFromErrorMap(errors, sourceMap)

  inferredTypes.forEach((type, id) => types.set(sourceMap.get(id)!, typeSchemeToString(type)))

  return [diagnostics, { types, originalTypes: inferredTypes }]
}


function checkDefinitionModes(
  quintModule: QuintModule, sourceMap: Map<bigint, Loc>, inferredEffects: InferredEffects
): [Diagnostic[], InferredModes] {
  const [errors, modes] = checkModes(quintModule, inferredEffects.originalEffects)
  const diagnostics = diagnosticsFromErrorMap(errors, sourceMap)

  return [diagnostics, { modes }]
}
