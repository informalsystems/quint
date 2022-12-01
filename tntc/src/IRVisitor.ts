/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Visitor pattern implementation for TNT IR components. Use this to navigate the IR instead
 * of implementing a recursion over it yourself.
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import * as ir from './tntIr'
import * as t from './tntTypes'

/**
 * Interface to be implemented by visitor classes.
 * Optionally defines functions for each IR component.
 */
export interface IRVisitor {
  /** General components */
  enterExpr?: (_expr: ir.TntEx) => void
  exitExpr?: (_expr: ir.TntEx) => void
  enterDef?: (_def: ir.TntDef) => void
  exitDef?: (_def: ir.TntDef) => void
  enterType?: (_type: t.TntType) => void
  exitType?: (_type: t.TntType) => void

  /** Definitions */
  enterOpDef?: (_def: ir.TntOpDef) => void
  exitOpDef?: (_def: ir.TntOpDef) => void
  enterConst?: (_def: ir.TntConst) => void
  exitConst?: (_def: ir.TntConst) => void
  enterVar?: (_def: ir.TntVar) => void
  exitVar?: (_def: ir.TntVar) => void
  enterAssume?: (_def: ir.TntAssume) => void
  exitAssume?: (_def: ir.TntAssume) => void
  enterTypeDef?: (_def: ir.TntTypeDef) => void
  exitTypeDef?: (_def: ir.TntTypeDef) => void
  enterImport?: (_def: ir.TntImport) => void
  exitImport?: (_def: ir.TntImport) => void
  enterInstance?: (_def: ir.TntInstance) => void
  exitInstance?: (_def: ir.TntInstance) => void
  enterModuleDef?: (_def: ir.TntModuleDef) => void
  exitModuleDef?: (_def: ir.TntModuleDef) => void

  /** Expressions */
  enterName?: (_expr: ir.TntName) => void
  exitName?: (_expr: ir.TntName) => void
  enterLiteral?: (_expr: ir.TntBool | ir.TntInt | ir.TntStr) => void
  exitLiteral?: (_expr: ir.TntBool | ir.TntInt | ir.TntStr) => void
  enterApp?: (_expr: ir.TntApp) => void
  exitApp?: (_expr: ir.TntApp) => void
  enterLambda?: (_expr: ir.TntLambda) => void
  exitLambda?: (_expr: ir.TntLambda) => void
  enterLet?: (_expr: ir.TntLet) => void
  exitLet?: (_expr: ir.TntLet) => void

  /** Types */
  enterLiteralType?: (_type: t.TntBoolType | t.TntIntType | t.TntStrType) => void
  exitLiteralType?: (_type: t.TntBoolType | t.TntIntType | t.TntStrType) => void
  enterConstType?: (_type: t.TntConstType) => void
  exitConstType?: (_type: t.TntConstType) => void
  enterVarType?: (_type: t.TntVarType) => void
  exitVarType?: (_type: t.TntVarType) => void
  enterSetType?: (_type: t.TntSetType) => void
  exitSetType?: (_type: t.TntSetType) => void
  enterSeqType?: (_type: t.TntSeqType) => void
  exitSeqType?: (_type: t.TntSeqType) => void
  enterFunType?: (_type: t.TntFunType) => void
  exitFunType?: (_type: t.TntFunType) => void
  enterOperType?: (_type: t.TntOperType) => void
  exitOperType?: (_type: t.TntOperType) => void
  enterTupleType?: (_type: t.TntTupleType) => void
  exitTupleType?: (_type: t.TntTupleType) => void
  enterRecordType?: (_type: t.TntRecordType) => void
  exitRecordType?: (_type: t.TntRecordType) => void
  enterUnionType?: (_type: t.TntUnionType) => void
  exitUnionType?: (_type: t.TntUnionType) => void

  /** Row types */
  enterRow?: (_row: t.Row) => void
  exitRow?: (_row: t.Row) => void
  enterConcreteRow?: (_row: t.ConcreteRow) => void
  exitConcreteRow?: (_row: t.ConcreteRow) => void
  enterVarRow?: (_row: t.VarRow) => void
  exitVarRow?: (_row: t.VarRow) => void
  enterEmptyRow?: (_row: t.EmptyRow) => void
  exitEmptyRow?: (_row: t.EmptyRow) => void
}

/**
 * Navigates a TNT module with a visitor, invoking the correspondent function for each
 * found IR component.
 *
 * @param visitor: the IRVisitor instance with the functions to be invoked
 * @param tntModule: the TNT module to be navigated
 *
 * @returns nothing, any collected information has to be a state inside the IRVisitor instance.
 */
export function walkModule(visitor: IRVisitor, tntModule: ir.TntModule): void {
  const moduleDef: ir.TntModuleDef = {
    kind: 'module', id: tntModule.id + 1n, module: tntModule,
  }
  walkDefinition(visitor, moduleDef)
}

/**
 * Navigates a TNT type with a visitor, invoking the correspondent function for each
 * inner type.
 *
 * @param visitor: the IRVisitor instance with the functions to be invoked
 * @param type: the TNT type to be navigated
 *
 * @returns nothing, any collected information has to be a state inside the IRVisitor instance.
 */
export function walkType(visitor: IRVisitor, type: t.TntType): void {
  if (visitor.enterType) {
    visitor.enterType(type)
  }

  switch (type.kind) {
    case 'bool':
    case 'int':
    case 'str':
      if (visitor.enterLiteralType) {
        visitor.enterLiteralType(type)
      }
      if (visitor.exitLiteralType) {
        visitor.exitLiteralType(type)
      }
      break
    case 'const':
      if (visitor.enterConstType) {
        visitor.enterConstType(type)
      }
      if (visitor.exitConstType) {
        visitor.exitConstType(type)
      }
      break
    case 'var':
      if (visitor.enterVarType) {
        visitor.enterVarType(type)
      }
      if (visitor.exitVarType) {
        visitor.exitVarType(type)
      }
      break
    case 'set':
      if (visitor.enterSetType) {
        visitor.enterSetType(type)
      }

      walkType(visitor, type.elem)

      if (visitor.exitSetType) {
        visitor.exitSetType(type)
      }
      break
    case 'list':
      if (visitor.enterSeqType) {
        visitor.enterSeqType(type)
      }

      walkType(visitor, type.elem)

      if (visitor.exitSeqType) {
        visitor.exitSeqType(type)
      }
      break
    case 'fun':
      if (visitor.enterFunType) {
        visitor.enterFunType(type)
      }
      // Functions, walk both argument and result
      walkType(visitor, type.arg)
      walkType(visitor, type.res)

      if (visitor.exitFunType) {
        visitor.exitFunType(type)
      }
      break

    case 'oper':
      if (visitor.enterOperType) {
        visitor.enterOperType(type)
      }
      // Operators, walk all arguments and result
      type.args.forEach(arg => walkType(visitor, arg))
      walkType(visitor, type.res)

      if (visitor.exitOperType) {
        visitor.exitOperType(type)
      }
      break

    case 'tup':
      if (visitor.enterTupleType) {
        visitor.enterTupleType(type)
      }
      // Tuples, walk all elements
      walkRow(visitor, type.fields)

      if (visitor.exitTupleType) {
        visitor.exitTupleType(type)
      }
      break

    case 'rec':
      if (visitor.enterRecordType) {
        visitor.enterRecordType(type)
      }
      // Records, walk all fields
      walkRow(visitor, type.fields)

      if (visitor.exitRecordType) {
        visitor.exitRecordType(type)
      }
      break

    case 'union':
      if (visitor.enterUnionType) {
        visitor.enterUnionType(type)
      }
      // Variants, walk all fields for all records
      type.records.forEach(record => {
        walkRow(visitor, record.fields)
      })

      if (visitor.exitUnionType) {
        visitor.exitUnionType(type)
      }
      break
  }

  if (visitor.exitType) {
    visitor.exitType(type)
  }
}

function walkDefinition(visitor: IRVisitor, def: ir.TntDef): void {
  if (visitor.enterDef) {
    visitor.enterDef(def)
  }
  if (ir.isAnnotatedDef(def)) {
    walkType(visitor, def.typeAnnotation)
  } else if (ir.isTypeAlias(def)) {
    walkType(visitor, def.type)
  }

  switch (def.kind) {
    case 'const':
      if (visitor.enterConst) {
        visitor.enterConst(def)
      }
      if (visitor.exitConst) {
        visitor.exitConst(def)
      }
      break
    case 'var':
      if (visitor.enterVar) {
        visitor.enterVar(def)
      }
      if (visitor.exitVar) {
        visitor.exitVar(def)
      }
      break
    case 'def':
      if (visitor.enterOpDef) {
        visitor.enterOpDef(def)
      }
      walkExpression(visitor, def.expr)

      if (visitor.exitOpDef) {
        visitor.exitOpDef(def)
      }
      break
    case 'typedef':
      if (visitor.enterTypeDef) {
        visitor.enterTypeDef(def)
      }
      if (visitor.exitTypeDef) {
        visitor.exitTypeDef(def)
      }
      break
    case 'instance':
      if (visitor.enterInstance) {
        visitor.enterInstance(def)
      }
      def.overrides.forEach(e => walkExpression(visitor, e[1]))
      if (visitor.exitInstance) {
        visitor.exitInstance(def)
      }
      break
    case 'module':
      if (visitor.enterModuleDef) {
        visitor.enterModuleDef(def)
      }
      def.module.defs.forEach(def => walkDefinition(visitor, def))

      if (visitor.exitModuleDef) {
        visitor.exitModuleDef(def)
      }
      break
    case 'import':
      if (visitor.enterImport) {
        visitor.enterImport(def)
      }
      if (visitor.exitImport) {
        visitor.exitImport(def)
      }
      break
    case 'assume':
      if (visitor.enterAssume) {
        visitor.enterAssume(def)
      }
      walkExpression(visitor, def.assumption)

      if (visitor.exitAssume) {
        visitor.exitAssume(def)
      }
      break
  }
  if (visitor.exitDef) {
    visitor.exitDef(def)
  }
}

function walkExpression(visitor: IRVisitor, expr: ir.TntEx): void {
  if (visitor.enterExpr) {
    visitor.enterExpr(expr)
  }

  switch (expr.kind) {
    case 'name':
      if (visitor.enterName) {
        visitor.enterName(expr)
      }
      if (visitor.exitName) {
        visitor.exitName(expr)
      }
      break
    case 'bool':
    case 'int':
    case 'str':
      if (visitor.enterLiteral) {
        visitor.enterLiteral(expr)
      }
      if (visitor.exitLiteral) {
        visitor.exitLiteral(expr)
      }
      break
    case 'app': {
      if (visitor.enterApp) {
        visitor.enterApp(expr)
      }
      expr.args.forEach(arg => walkExpression(visitor, arg))

      if (visitor.exitApp) {
        visitor.exitApp(expr)
      }
      break
    }
    case 'lambda':
      if (visitor.enterLambda) {
        visitor.enterLambda(expr)
      }

      walkExpression(visitor, expr.expr)

      if (visitor.exitLambda) {
        visitor.exitLambda(expr)
      }
      break
    case 'let':
      if (visitor.enterLet) {
        visitor.enterLet(expr)
      }

      walkDefinition(visitor, expr.opdef)
      walkExpression(visitor, expr.expr)

      if (visitor.exitLet) {
        visitor.exitLet(expr)
      }
      break
  }

  if (visitor.exitExpr) {
    visitor.exitExpr(expr)
  }
}

function walkRow(visitor: IRVisitor, r: t.Row) {
  if (visitor.enterRow) {
    visitor.enterRow(r)
  }
  switch (r.kind) {
    case 'row':
      if (visitor.enterConcreteRow) {
        visitor.enterConcreteRow(r)
      }

      r.fields.forEach(field => walkType(visitor, field.fieldType))
      walkRow(visitor, r.other)

      if (visitor.exitConcreteRow) {
        visitor.exitConcreteRow(r)
      }
      break
    case 'var':
      if (visitor.enterVarRow) {
        visitor.enterVarRow(r)
      }
      if (visitor.exitVarRow) {
        visitor.exitVarRow(r)
      }
      break
    case 'empty':
      if (visitor.enterEmptyRow) {
        visitor.enterEmptyRow(r)
      }
      if (visitor.exitEmptyRow) {
        visitor.exitEmptyRow(r)
      }
  }
  if (visitor.exitRow) {
    visitor.exitRow(r)
  }
}
