import { TntEx, TntDef, TntModule, TntConst, TntName } from './tntIr'
import { TntType, TntTypeVar, TntTypeConst } from './tntTypes'

export interface IRVisitor {
  visitExpr?: (expr: TntEx) => void

  visitDef?: (def: TntDef) => void

  visitConst?: (cons: TntConst) => void

  visitName?: (nameExpr: TntName) => void

  visitTypeVar?: (typeVar: TntTypeVar) => void
  visitTypeConst?: (typeConst: TntTypeConst) => void
}

export function walkModule (visitor: IRVisitor, tntModule: TntModule): void {
  tntModule.defs.forEach(def => {
    if (visitor.visitDef) {
      visitor.visitDef(def)
    }

    switch (def.kind) {
      case 'const':
        if (visitor.visitConst) {
          visitor.visitConst(def)
        }
        if (def.type) {
          walkType(visitor, def.type)
        }
        break
      case 'var':
        if (def.type) {
          walkType(visitor, def.type)
        }
        break
      case 'def':
        if (def.type) {
          walkType(visitor, def.type)
        }
        break
      case 'typedef':
        if (def.type) {
          walkType(visitor, def.type)
        }
        break
      case 'instance':
      case 'module':
      case 'import':
      case 'assume':
    }
  })
}

function walkType (visitor: IRVisitor, tntType: TntType) {
  switch (tntType.kind) {
    case 'const':
      if (visitor.visitTypeConst) {
        visitor.visitTypeConst(tntType)
      }
      break
    case 'var':
      if (visitor.visitTypeVar) {
        visitor.visitTypeVar(tntType)
      }
      break

    case 'set':
    case 'seq':
      // Generic constructors, check parameter
      walkType(visitor, tntType.elem)
      break

    case 'fun':
      // Functions, check both argument and result
      walkType(visitor, tntType.arg)
      walkType(visitor, tntType.res)
      break

    case 'oper':
      // Operators, check all arguments and result
      tntType.args.forEach(arg => walkType(visitor, arg))
      walkType(visitor, tntType.res)
      break

    case 'tuple':
      // Tuples, check all elements
      tntType.elems.forEach(elem => walkType(visitor, elem))
      break

    case 'record':
      // Records, check all fields
      tntType.fields.forEach(field => walkType(visitor, field.fieldType))
      break

    case 'union':
      // Variants, check all fields for all records
      tntType.records.forEach(record => {
        record.fields.forEach(field => walkType(visitor, field.fieldType))
      })
      break
  }
}
