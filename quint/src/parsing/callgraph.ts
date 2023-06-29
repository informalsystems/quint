/**
 * Compute the call graph of Quint definitions. Technically, it is a "uses"
 * graph, as it also captures type aliases.
 *
 * @author Igor Konnov, Informal Systems, 2023
 *
 * Copyright (c) Informal Systems 2022-2023. All rights reserved. Licensed
 * under the Apache 2.0.  See License.txt in the project root for license
 * information.
 */

import { Map, Set } from "immutable";

import { IRVisitor } from "../IRVisitor";
import { LookupTable } from "../names/lookupTable";
import { QuintApp, QuintDef, QuintName, QuintOpDef } from "../quintIr";

/**
 * The call graph is simply a mapping from the caller's id
 * to the set of callee's ids.
 */
export type CallGraph = Map<bigint, Set<bigint>>

/**
 * IR visitor that computes the call graph.  This class accumulates the graph in
 * its state. If you want to compute a new graph, create a new instance.
 */
export class CallGraphVisitor implements IRVisitor {
  private lookupTable: LookupTable
  private stack: QuintDef[]
  /**
   * The call graph computed by the visitor.
   */
  private _graph: CallGraph

  constructor (lookupTable: LookupTable) {
    this.lookupTable = lookupTable
    this._graph = Map()
    this.stack = []
  }

  get graph() {
    return this._graph
  }

  enterDef(def: QuintDef) {
    this.stack.push(def)
  }

  exitDef(_def: QuintDef) {
    this.stack.pop()
  }

  exitApp(app: QuintApp) {
    const lookupDef = this.lookupTable.get(app.id)
    if (lookupDef) {
      this.addUses(lookupDef.reference)
    }
  }

  exitName(name: QuintName) {
    const lookupDef = this.lookupTable.get(name.id)
    if (lookupDef) {
      this.addUses(lookupDef.reference)
    }
  }

  private addUses(usedId: bigint) {
    // Add the reference for every definition on the stack.
    // Hence, if we have nested definitions, top-level definitions
    // are also designated as callers of the definition.
    this.stack.forEach(def => {
      const callees = this.graph.get(def.id) ?? Set()
      this._graph = this._graph.set(def.id, callees.add(usedId))
    })
  }
}
