/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Pretty printing for IR components.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { TntModule, TntDef, TntEx } from './tntIr'
import { TntType } from './tntTypes'

/**
 * Pretty prints a module
 *
 * @param tntModule the TNT module to be formatted
 *
 * @returns a string with the pretty printed definition
 */
export function moduleToString (tntModule: TntModule): string {
  const defs = tntModule.defs.map(definitionToString).join('\n  ')
  return `module ${tntModule.name} {\n  ${defs}\n}`
}

/**
 * Pretty prints a definition
 *
 * @param def the TNT expression to be formatted
 *
 * @returns a string with the pretty printed definition
 */
export function definitionToString (def: TntDef): string {
  const typeAnnotation = def.type ? `: ${typeToString(def.type)}` : ''
  switch (def.kind) {
    case 'def':
      return `${def.qualifier} ${def.name}${typeAnnotation} = ${expressionToString(def.expr)}`
    case 'var':
      return `var ${def.name}${typeAnnotation}`
    case 'const':
      return `const ${def.name}${typeAnnotation}`
    case 'assume':
      return `assume ${def.name} = ${expressionToString(def.assumption)}`
    case 'typedef':
      if (def.type) {
        return `type ${def.name} = ${typeToString(def.type)}`
      } else {
        return `type ${def.name}`
      }
    case 'import':
      return `import ${def.path}.${def.name}`
    case 'instance': {
      const overrides = def.overrides.map(o => `${o[0]} = ${expressionToString(o[1])}`).join(', ')
      return `module ${def.name} = ${def.protoName}(${overrides})`
    }
    case 'module':
      return moduleToString(def.module)
  }
}

/**
 * Pretty prints an expression
 *
 * @param expr the TNT expression to be formatted
 *
 * @returns a string with the pretty printed expression
 */
export function expressionToString (expr: TntEx): string {
  switch (expr.kind) {
    case 'name':
      return expr.name
    case 'bool':
    case 'int':
      return expr.value.toString()
    case 'str':
      return `"${expr.value}"`
    case 'app':
      return `${expr.opcode}(${expr.args.map(expressionToString).join(', ')})`
    case 'lambda':
      return `(${expr.params.join(', ')} => ${expressionToString(expr.expr)})`
    case 'let':
      return `${definitionToString(expr.opdef)} { ${expressionToString(expr.expr)} }`
  }
}

/**
 * Pretty prints a type
 *
 * @param type the TNT type to be formatted
 *
 * @returns a string with the pretty printed type
 */
export function typeToString (type: TntType): string {
  switch (type.kind) {
    case 'bool':
    case 'int':
    case 'str':
      return type.kind
    case 'const':
    case 'var':
      return type.name
    case 'set':
    case 'list':
      return `${type.kind}(${typeToString(type.elem)})`
    case 'fun':
      return `(${typeToString(type.arg)} -> ${typeToString(type.res)})`
    case 'oper': {
      const args = type.args.map(typeToString).join(', ')
      return `(${args}) => ${typeToString(type.res)}`
    }
    case 'tup':
      return `(${type.elems.map(typeToString).join(', ')})`
    case 'rec': {
      const fields = type.fields.map(f => `${f.fieldName}: ${typeToString(f.fieldType)}`).join(', ')
      return `{ ${fields} }`
    }
    case 'union': {
      const records = type.records.map(rec => {
        const fields = rec.fields.map(f => `${f.fieldName}: ${typeToString(f.fieldType)}`).join(', ')
        return `| { ${type.tag}: "${rec.tagValue}", ${fields} }`
      })
      return records.join('\n')
    }
  }
}
