/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * This module is a wrapper for Quint's static analysis.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { LookupTable } from './lookupTable'
import { OpQualifier, QuintDef, QuintModule } from './quintIr'
import { TypeScheme } from './types/base'
import { TypeInferrer } from './types/inferrer'
import { EffectScheme } from './effects/base'
import { EffectInferrer } from './effects/inferrer'
import { ModeChecker } from './effects/modeChecker'
import { QuintError } from './quintError'
import { errorTreeToString } from './errorTree'
import { MultipleUpdatesChecker } from './effects/MultipleUpdatesChecker'

/* Products from static analysis */
export type AnalysisOutput = {
  types: Map<bigint, TypeScheme>
  effects: Map<bigint, EffectScheme>
  modes: Map<bigint, OpQualifier>
}

/* A tuple with a list of errors and the analysis output */
export type AnalysisResult = [[bigint, QuintError][], AnalysisOutput]

/**
 * Statically analyzes a Quint specification.
 *
 * This class is stateful and accumulates analyzed data for multiple modules.
 * Use it by calling the analyze method for each module and then calling the
 * getResult method to get the analysis result.
 *
 * @param lookupTable - The lookup tables for the modules.
 */
export class QuintAnalyzer {
  private effectInferrer: EffectInferrer
  private typeInferrer: TypeInferrer
  private modeChecker: ModeChecker
  private multipleUpdatesChecker: MultipleUpdatesChecker

  private errors: [bigint, QuintError][] = []
  private output: AnalysisOutput = { types: new Map(), effects: new Map(), modes: new Map() }

  constructor(lookupTable: LookupTable) {
    this.typeInferrer = new TypeInferrer(lookupTable)
    this.effectInferrer = new EffectInferrer(lookupTable)
    this.multipleUpdatesChecker = new MultipleUpdatesChecker()
    this.modeChecker = new ModeChecker()
  }

  setTable(lookupTable: LookupTable) {
    this.typeInferrer.setTable(lookupTable)
    this.effectInferrer.setTable(lookupTable)
  }

  setState(analysisOutput: AnalysisOutput) {
    this.typeInferrer.types = analysisOutput.types
    this.effectInferrer.effects = analysisOutput.effects
    this.modeChecker.suggestions = analysisOutput.modes
  }

  // I'm actually not using this right now. I'm not sure we need it, as new
  // expressions should get new ids.
  deleteResult(id: bigint) {
    this.typeInferrer.types.delete(id)
    this.typeInferrer.errors.delete(id)
    this.effectInferrer.effects.delete(id)
    this.effectInferrer.errors.delete(id)
    this.modeChecker.suggestions.delete(id)
    this.modeChecker.errors.delete(id)
  }

  analyze(module: QuintModule): void {
    const [typeErrMap, types] = this.typeInferrer.inferTypes(module.defs)
    const [effectErrMap, effects] = this.effectInferrer.inferEffects(module.defs)
    const updatesErrMap = this.multipleUpdatesChecker.checkEffects([...effects.values()])
    const [modeErrMap, modes] = this.modeChecker.checkModes(module.defs, effects)

    const errorTrees = [...typeErrMap, ...effectErrMap]

    // TODO: Type and effec checking should return QuintErrors instead of error trees
    this.errors.push(
      ...errorTrees.map(([id, err]): [bigint, QuintError] => {
        return [id, { code: 'QNT000', message: errorTreeToString(err), data: { trace: err } }]
      })
    )

    this.errors.push(...modeErrMap.entries(), ...updatesErrMap.entries())

    // We assume that ids are unique across modules, and map merging can be done
    // without collision checks
    this.output = {
      types: new Map([...this.output.types, ...types]),
      effects: new Map([...this.output.effects, ...effects]),
      modes: new Map([...this.output.modes, ...modes]),
    }
  }

  analyzeDef(def: QuintDef): void {
    const [typeErrMap, types] = this.typeInferrer.inferTypes([def])
    const [effectErrMap, effects] = this.effectInferrer.inferEffects([def])
    const updatesErrMap = this.multipleUpdatesChecker.checkEffects([...effects.values()])
    const [modeErrMap, modes] = this.modeChecker.checkModes([def], effects)

    const errorTrees = [...typeErrMap, ...effectErrMap]

    // TODO: Type and effec checking should return QuintErrors instead of error trees
    this.errors.push(
      ...errorTrees.map(([id, err]): [bigint, QuintError] => {
        return [id, { code: 'QNT000', message: errorTreeToString(err), data: { trace: err } }]
      })
    )

    this.errors.push(...modeErrMap.entries(), ...updatesErrMap.entries())

    // We assume that ids are unique across modules, and map merging can be done
    // without collision checks
    this.output = {
      types: new Map([...this.output.types, ...types]),
      effects: new Map([...this.output.effects, ...effects]),
      modes: new Map([...this.output.modes, ...modes]),
    }
  }

  getResult(): AnalysisResult {
    return [this.errors, this.output]
  }
}
