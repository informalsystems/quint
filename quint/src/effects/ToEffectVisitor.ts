/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * A visitor for the effects parser
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { Effect, Variables, emptyVariables } from './base'
import { EffectListener } from '../generated/EffectListener'
import * as p from '../generated/EffectParser'

/**
 * An ANTLR4 listener that constructs Effect objects out of the abstract
 * syntax tree.
 */
export class ToEffectVisitor implements EffectListener {
  // The resulting effect
  effect?: Effect = undefined

  // Stack of lists of effects, each list will hold the effects of an arrow effect
  private arrowEffectsStack: Effect[][] = []
  private variablesStack: Variables[] = []
  private stateVars: string[] = []

  private pushEffect(effect: Effect): void {
    this.effect = effect
    // If inside an arrow effect, push it this effect to the arrow's effects list
    if (this.arrowEffectsStack.length > 0) {
      this.arrowEffectsStack[this.arrowEffectsStack.length - 1].push(effect)
    }
  }

  exitReadOnly() {
    const variables = this.variablesStack.pop()!
    const effect: Effect = { kind: 'concrete', read: variables, update: emptyVariables, temporal: emptyVariables }
    this.pushEffect(effect)
  }

  exitUpdateOnly() {
    const variables = this.variablesStack.pop()!
    const effect: Effect = { kind: 'concrete', read: emptyVariables, update: variables, temporal: emptyVariables }
    this.pushEffect(effect)
  }

  exitTemporalOnly() {
    const variables = this.variablesStack.pop()!
    const effect: Effect = { kind: 'concrete', read: emptyVariables, update: emptyVariables, temporal: variables }
    this.pushEffect(effect)
  }

  exitReadAndUpdate() {
    const update = this.variablesStack.pop()!
    const read = this.variablesStack.pop()!

    const effect: Effect = { kind: 'concrete', read, update, temporal: emptyVariables }
    this.pushEffect(effect)
  }

  exitReadAndTemporal() {
    const temporal = this.variablesStack.pop()!
    const read = this.variablesStack.pop()!

    const effect: Effect = { kind: 'concrete', read, update: emptyVariables, temporal }
    this.pushEffect(effect)
  }

  exitPure() {
    const effect: Effect = { kind: 'concrete', read: emptyVariables, update: emptyVariables, temporal: emptyVariables }
    this.pushEffect(effect)
  }

  exitQuantifiedEffect(ctx: p.QuantifiedEffectContext) {
    const name = ctx.IDENTIFIER().text
    const effect: Effect = { kind: 'quantified', name }
    this.pushEffect(effect)
  }

  enterArrowEffect() {
    this.arrowEffectsStack.push([])
  }

  exitArrowEffect() {
    const effects = this.arrowEffectsStack.pop()!
    const result = effects.pop()!
    const effect: Effect = { kind: 'arrow', params: effects, result }
    this.pushEffect(effect)
  }

  exitVars(ctx: p.VarsContext) {
    const names: string[] = ctx.IDENTIFIER().map(i => i.text)
    const unionVariables: Variables[] = names.map(name => ({ kind: 'quantified', name }))
    if (this.stateVars.length > 0) {
      unionVariables.push({ kind: 'concrete', vars: this.stateVars })
    }

    if (unionVariables.length === 0) {
      this.variablesStack.push({ kind: 'concrete', vars: [] })
    } else if (unionVariables.length === 1) {
      this.variablesStack.push(unionVariables[0])
    } else {
      this.variablesStack.push({ kind: 'union', variables: unionVariables })
    }

    this.stateVars = []
  }

  exitStateVarRef(ctx: p.StateVarRefContext) {
    const varRef = ctx.IDENTIFIER().text
    this.stateVars.push(varRef)
  }
}
