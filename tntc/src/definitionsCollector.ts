/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Find and collect definitions from a TNT module, along with a default list for built-in
 * definitions. Collect both operator and type alias definitions. For scoped operators,
 * collect scope information.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { IRVisitor, walkModule } from './IRVisitor'
import { TntModule, TntVar, TntModuleDef, TntConst, TntOpDef, TntTypeDef, TntAssume, TntLambda, TntLet } from './tntIr'
import { TntType } from './tntTypes'
import { Identifier } from './identifier'

/**
 * A named operator defined. Can be scoped or module-wide (unscoped).
 */
export interface ValueDefinition {
  /* Same as TntDef kinds */
  kind: string
  /* The name given to the defined operator */
  identifier: Identifier
  /* Expression or definition id from where the name was collected */
  reference?: BigInt
  /* Optional scope, an id pointing to the TntIr node that introduces the name */
  scope?: bigint
}

// function valueDefinition(kind: string, identifier: string[], reference?: BigInt, scope?: bigint): ValueDefinition {
//   return {kind, identifier: new Identifier(...identifier), reference, scope}
// }

function defaultDef (identifier: string): ValueDefinition {
  return { kind: 'def', identifier: new Identifier(identifier) }
}

/**
 * A type alias definition
 */
export interface TypeDefinition {
  /* The alias given to the type */
  identifier: Identifier
  /* The type that is aliased (none for uninterpreted type) */
  type?: TntType
  /* Expression or definition id from where the type was collected */
  reference?: BigInt
}

/**
 * A lookup table aggregating operator and type alias definitions
 */
export interface DefinitionTable {
  /* Names for operators defined */
  valueDefinitions: ValueDefinition[]
  /* Type aliases defined */
  typeDefinitions: TypeDefinition[]
}

export type DefinitionTableByModule = Map<string, DefinitionTable>

/**
 * Built-in name definitions that are always included in definitions collection
 * This is a function instead of a constant to ensure a new instance is generated
 * every call
*/

export function emptyTable (): DefinitionTable {
  return {
    valueDefinitions: [],
    typeDefinitions: [],
  }
}

export function defaultDefinitions (): DefinitionTable {
  return {
    valueDefinitions: [
      defaultDef('not'),
      defaultDef('and'),
      defaultDef('or'),
      defaultDef('iff'),
      defaultDef('implies'),
      defaultDef('exists'),
      defaultDef('guess'),
      defaultDef('forall'),
      defaultDef('in'),
      defaultDef('notin'),
      defaultDef('union'),
      defaultDef('contains'),
      defaultDef('fold'),
      defaultDef('intersect'),
      defaultDef('exclude'),
      defaultDef('subseteq'),
      defaultDef('map'),
      defaultDef('applyTo'),
      defaultDef('filter'),
      defaultDef('powerset'),
      defaultDef('flatten'),
      defaultDef('seqs'),
      defaultDef('chooseSome'),
      defaultDef('isFinite'),
      defaultDef('cardinality'),
      defaultDef('get'),
      defaultDef('put'),
      defaultDef('keys'),
      defaultDef('mapOf'),
      defaultDef('setOfMaps'),
      defaultDef('update'),
      defaultDef('updateAs'),
      defaultDef('fields'),
      defaultDef('with'),
      defaultDef('tuples'),
      defaultDef('append'),
      defaultDef('concat'),
      defaultDef('head'),
      defaultDef('tail'),
      defaultDef('length'),
      defaultDef('nth'),
      defaultDef('indices'),
      defaultDef('replaceAt'),
      defaultDef('slice'),
      defaultDef('select'),
      defaultDef('foldl'),
      defaultDef('foldr'),
      defaultDef('to'),
      defaultDef('always'),
      defaultDef('eventually'),
      defaultDef('next'),
      defaultDef('stutter'),
      defaultDef('nostutter'),
      defaultDef('enabled'),
      defaultDef('weakFair'),
      defaultDef('strongFair'),
      defaultDef('guarantees'),
      defaultDef('existsConst'),
      defaultDef('forallConst'),
      defaultDef('chooseConst'),
      defaultDef('Bool'),
      defaultDef('Int'),
      defaultDef('Nat'),
      defaultDef('set'),
      defaultDef('seq'),
      defaultDef('tup'),
      defaultDef('tuple'),
      defaultDef('rec'),
      defaultDef('record'),
      defaultDef('igt'),
      defaultDef('ilt'),
      defaultDef('igte'),
      defaultDef('ilte'),
      defaultDef('iadd'),
      defaultDef('isub'),
      defaultDef('iuminus'),
      defaultDef('imul'),
      defaultDef('idiv'),
      defaultDef('imod'),
      defaultDef('ipow'),
      defaultDef('andAction'),
      defaultDef('orAction'),
      defaultDef('andExpr'),
      defaultDef('orExpr'),
      defaultDef('field'),
      defaultDef('item'),
      defaultDef('match'),
      defaultDef('assign'),
      defaultDef('of'),
      defaultDef('eq'),
      defaultDef('neq'),
      defaultDef('ite'),
      defaultDef('cross'),
      defaultDef('difference'),
    ],
    typeDefinitions: [],
  }
}
/**
 * Recursively iterate over a module's definition collecting all names and type aliases
 * into a definition table. Also includes all default definitions for built-in names.
 *
 * @param tntModule the TNT module to have definitions collected from
 *
 * @returns a lookup table with all defined values for the module
 */
export function collectDefinitions (tntModule: TntModule): DefinitionTableByModule {
  const visitor = new DefinitionsCollectorVisitor()
  walkModule(visitor, tntModule)
  const fullTable = visitor.tables

  fullTable.forEach(table => {
    table.valueDefinitions = table.valueDefinitions.filter(d => !d.identifier.isWildCard())
    table.valueDefinitions.push(...defaultDefinitions().valueDefinitions)
  })
  return fullTable
}

class DefinitionsCollectorVisitor implements IRVisitor {
  tables: DefinitionTableByModule = new Map<string, DefinitionTable>()

  private currentModuleName: string = ''
  private currentTable: DefinitionTable = emptyTable()
  private moduleStack: string[] = []
  private scopeStack: bigint[] = []

  enterModuleDef (def: TntModuleDef): void {
    this.moduleStack.push(def.module.name)

    this.updateCurrentModule()
  }

  exitModuleDef (def: TntModuleDef): void {
    // Collect all definitions namespaced to module
    const namespacedDefinitions = this.currentTable.valueDefinitions
      .filter(d => !d.scope)
      .map(d => {
        return { kind: d.kind, identifier: d.identifier.toChildOf(def.module.name), reference: d.reference }
      })

    this.moduleStack.pop()
    this.updateCurrentModule()

    if (this.moduleStack.length > 0) {
      this.currentTable.valueDefinitions.push(...namespacedDefinitions)
    }
  }

  enterVar (def: TntVar): void {
    this.collectValueDefinition(def.kind, def.name, def.id)
  }

  enterConst (def: TntConst): void {
    this.collectValueDefinition(def.kind, def.name, def.id)
  }

  enterOpDef (def: TntOpDef): void {
    if (this.scopeStack.length > 0) {
      const scope = this.scopeStack[this.scopeStack.length - 1]
      this.collectValueDefinition(def.kind, def.name, def.id, scope)
    } else {
      this.collectValueDefinition(def.kind, def.name, def.id)
    }
  }

  enterTypeDef (def: TntTypeDef): void {
    this.currentTable.typeDefinitions.push({
      identifier: new Identifier(def.name),
      type: def.type,
      reference: def.id,
    })
  }

  enterAssume (def: TntAssume): void {
    this.collectValueDefinition('assumption', def.name, def.id)
  }

  enterLambda (expr: TntLambda): void {
    expr.params.forEach(p => {
      this.collectValueDefinition('def', p, expr.id, expr.id)
    })
  }

  enterLet (def: TntLet): void {
    this.scopeStack.push(def.id)
  }

  exitLet (_: TntLet): void {
    this.scopeStack.pop()
  }

  private collectValueDefinition (kind: string, name: string, reference: bigint, scope?: bigint): void {
    this.currentTable.valueDefinitions.push({
      kind: kind,
      identifier: new Identifier(name),
      reference: reference,
      scope: scope,
    })
  }

  private updateCurrentModule (): void {
    if (this.moduleStack.length > 0) {
      this.currentModuleName = this.moduleStack[this.moduleStack.length - 1]

      let moduleTable = this.tables.get(this.currentModuleName)
      if (!moduleTable) {
        moduleTable = emptyTable()
        this.tables.set(this.currentModuleName, moduleTable)
      }
      this.currentTable = moduleTable
    }
  }
}
