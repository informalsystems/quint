/* ----------------------------------------------------------------------------------
 * Copyright 2022-2024 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Constraint generation for Quint's type system
 *
 * @author Gabriela Moreira
 *
 * @module
 */

import { IRVisitor } from '../ir/IRVisitor'
import {
  QuintApp,
  QuintAssume,
  QuintBool,
  QuintConst,
  QuintDeclaration,
  QuintEx,
  QuintInstance,
  QuintInt,
  QuintLambda,
  QuintLet,
  QuintName,
  QuintOpDef,
  QuintStr,
  QuintVar,
} from '../ir/quintIr'
import { ConcreteRow, QuintType, QuintVarType, Row } from '../ir/quintTypes'
import { expressionToString, typeToString } from '../ir/IRprinting'
import { Either, left, mergeInMany, right } from '@sweet-monads/either'
import { Error, ErrorTree, buildErrorLeaf } from '../errorTree'
import { getSignatures } from './builtinSignatures'
import { Constraint, OperatorInfo, QuantifiedVariables, Signature, TypeScheme, toScheme } from './base'
import { Substitutions } from './substitutions'
import { LookupTable } from '../names/base'
import {
  fieldConstraints,
  fieldNamesConstraints,
  itemConstraints,
  matchConstraints,
  recordConstructorConstraints,
  tupleConstructorConstraints,
  variantConstraints,
  withConstraints,
} from './specialConstraints'
import { FreshVarGenerator } from '../FreshVarGenerator'

export type SolvingFunctionType = (
  _table: LookupTable,
  _constraint: Constraint
) => Either<Map<bigint, ErrorTree>, Substitutions>

// `validateArity(opName, args, pred, msg)` is `right(null)` if
// if `pred(args.length) === true`, and otherwise `left(err)`, where `err`
// is constructed using the given `opName` and `msg`.
//
// `msg` should contain a textual description of the expected argument
// length, e.g., ("1", "2", "even number of", ...).
//
// Use this for operators that cannot be typed in the Quint type system.
function validateArity(
  opcode: string,
  args: [QuintEx, QuintType][],
  pred: (arity: number) => boolean,
  msg: string
): Either<Error, null> {
  if (!pred(args.length)) {
    return left(
      buildErrorLeaf(
        `Checking arity for application of ${opcode}`,
        `Operator expects ${msg} arguments but was given ${args.length}`
      )
    )
  } else {
    return right(null)
  }
}

// A visitor that collects types and constraints for a module's expressions
//
// NOTE: Assumes all type applications have been resolved by typeApplicationResolution first
export class ConstraintGeneratorVisitor implements IRVisitor {
  // Inject dependency to allow manipulation in unit tests
  constructor(solvingFunction: SolvingFunctionType, table: LookupTable, types?: Map<bigint, TypeScheme>) {
    this.solvingFunction = solvingFunction
    this.table = table
    this.freshVarGenerator = new FreshVarGenerator()
    if (types) {
      this.types = types
    }
  }

  protected types: Map<bigint, TypeScheme> = new Map()
  protected errors: Map<bigint, ErrorTree> = new Map<bigint, ErrorTree>()
  protected freshVarGenerator: FreshVarGenerator
  protected table: LookupTable

  private constraints: Constraint[] = []
  private solvingFunction: SolvingFunctionType
  private builtinSignatures: Map<string, Signature> = getSignatures()

  // A map to save which type variables were free when we started visiting an opdef or an assume
  protected tvs: Map<bigint, QuantifiedVariables> = new Map()
  // Temporary type map only for types in scope for a certain declaration
  protected typesInScope: Map<bigint, TypeScheme> = new Map()

  // Track location descriptions for error tree traces
  private location: string = ''

  getResult(): [Map<bigint, ErrorTree>, Map<bigint, TypeScheme>] {
    return [this.errors, this.types]
  }

  enterExpr(e: QuintEx) {
    this.location = `Generating constraints for ${expressionToString(e)}`
  }

  exitVar(e: QuintVar) {
    this.addToResults(e.id, right(toScheme(e.typeAnnotation)))
  }

  exitConst(e: QuintConst) {
    this.addToResults(e.id, right(toScheme(e.typeAnnotation)))
  }

  exitInstance(def: QuintInstance) {
    if (this.errors.size !== 0) {
      return
    }

    def.overrides.forEach(([name, ex]) => {
      this.addToResults(name.id, this.typeForName(name.name, name.id, 2).map(toScheme))

      this.fetchResult(name.id).chain((originalType: TypeScheme) => {
        return this.fetchResult(ex.id).map((expressionType: TypeScheme) => {
          this.constraints.push({ kind: 'eq', types: [originalType.type, expressionType.type], sourceId: ex.id })
        })
      })
    })

    if (this.constraints.length > 0) {
      this.solveConstraints()
    }
  }

  //     n: t ∈ Γ
  // ----------------- (NAME)
  //  Γ ⊢ n: (t, true)
  exitName(e: QuintName) {
    if (this.errors.size !== 0) {
      return
    }
    this.addToResults(e.id, this.typeForName(e.name, e.id, 2).map(toScheme))
  }

  // Literals have always the same type and the empty constraint
  exitLiteral(e: QuintBool | QuintInt | QuintStr) {
    this.addToResults(e.id, right(toScheme({ kind: e.kind })))
  }

  //   op: q ∈ Γ   Γ ⊢  p0, ..., pn: (t0, c0), ..., (tn, cn)   a is fresh
  // ------------------------------------------------------------------------ (APP)
  //    Γ ⊢ op(p0, ..., pn): (a, q ~ (t0, ..., tn) => a ∧ c0 ∧ ... ∧ cn)
  exitApp(e: QuintApp) {
    if (this.errors.size !== 0) {
      return
    }

    const argsResult: Either<Error, Array<[QuintEx, QuintType]>> = mergeInMany(
      e.args.map(e => {
        return this.fetchResult(e.id).map((r: TypeScheme) => [e, r.type] as [QuintEx, QuintType])
      })
    )

    const definedSignature = this.typeForName(e.opcode, e.id, e.args.length)
    const a: QuintType = { kind: 'var', name: this.freshVarGenerator.freshVar('_t') }

    // Default result type
    let result = a

    if (argsResult.isRight()) {
      const results = argsResult.value

      // Apply different logic based on opcode
      switch (e.opcode) {
        case 'Rec': {
          if (validateArity(e.opcode, results, l => l % 2 === 0, 'even number of').isRight()) {
            const recordResult = recordConstructorConstraints(e.id, results, a)
            if (recordResult.isRight()) {
              // We know recordResult.value should be our expected type
              this.constraints.push(...recordResult.value)
            }
          }
          break
        }
        case 'field': {
          if (validateArity(e.opcode, results, l => l === 2, '2').isRight()) {
            const fieldResult = fieldConstraints(e.id, results, a)
            if (fieldResult.isRight()) {
              this.constraints.push(...fieldResult.value)
            }
          }
          break
        }
        case 'fieldNames': {
          if (validateArity(e.opcode, results, l => l === 1, '1').isRight()) {
            const fieldNamesResult = fieldNamesConstraints(e.id, results, a)
            if (fieldNamesResult.isRight()) {
              this.constraints.push(...fieldNamesResult.value)
            }
          }
          break
        }
        case 'with': {
          if (validateArity(e.opcode, results, l => l === 3, '3').isRight()) {
            const withResult = withConstraints(e.id, results, a)
            if (withResult.isRight()) {
              this.constraints.push(...withResult.value)
            }
          }
          break
        }
        case 'item': {
          if (validateArity(e.opcode, results, l => l === 2, '2').isRight()) {
            const itemResult = itemConstraints(e.id, results, a)
            if (itemResult.isRight()) {
              this.constraints.push(...itemResult.value)
            }
          }
          break
        }
        case 'variant': {
          if (validateArity(e.opcode, results, l => l === 2, '2').isRight()) {
            const variantResult = variantConstraints(e.id, results, a)
            if (variantResult.isRight()) {
              this.constraints.push(...variantResult.value)
            }
          }
          break
        }
        case 'match': {
          if (validateArity(e.opcode, results, l => l === 2, '2').isRight()) {
            const matchResult = matchConstraints(e.id, results, a)
            if (matchResult.isRight()) {
              this.constraints.push(...matchResult.value)
            }
          }
          break
        }
        case 'matchVariant': {
          if (validateArity(e.opcode, results, l => l % 2 === 1, 'odd number of').isRight()) {
            const matchResult = matchConstraints(e.id, results, a)
            if (matchResult.isRight()) {
              this.constraints.push(...matchResult.value)
            }
          }
          break
        }
        case 'Tup': {
          const tupleResult = tupleConstructorConstraints(e.id, results, a)
          if (tupleResult.isRight()) {
            this.constraints.push(...tupleResult.value)
          }
          break
        }
        default: {
          // For all other operators, use the defined signature
          definedSignature.chain((sig: QuintType) => {
            const operatorInfo: OperatorInfo = {
              operatorName: e.opcode,
              operatorSignature: typeToString(sig),
              argumentPosition: undefined
            }

            // Add operator information for collection operations
            if (e.opcode === 'map' || e.opcode === 'filter' || e.opcode === 'reduce') {
              operatorInfo.argumentPosition = 1
              // For map and filter, we expect a Set as the first argument
              if (e.opcode === 'map' || e.opcode === 'filter') {
                const firstArgType = results[0][1]
                if (firstArgType.kind === 'list') {
                  const err = buildErrorLeaf(
                    `Operator ${e.opcode} expects a Set but got a List`,
                    `Expected: Set[_t]\nGot: List[${typeToString(firstArgType)}]\nType signature for ${e.opcode} is ${typeToString(sig)}`
                  )
                  this.errors.set(e.id, err)
                  return left(err)
                }
              }
            } else if (e.opcode === 'fold' || e.opcode === 'foldl' || e.opcode === 'foldr') {
              operatorInfo.argumentPosition = 2
            } else if (e.opcode === 'contains' || e.opcode === 'indexOf' || e.opcode === 'slice') {
              operatorInfo.argumentPosition = 1
            } else if (e.args.length > 0) {
              // For other operators with arguments, default to first argument position
              operatorInfo.argumentPosition = 1
            }

            // Add constraints for each argument
            const argTypes = results.map(([_, t]) => t)
            const constraint: Constraint = {
              kind: 'eq',
              types: [sig, { kind: 'fun', arg: { kind: 'tup', fields: { kind: 'row', fields: argTypes.map((t, i) => ({ fieldName: i.toString(), fieldType: t })), other: { kind: 'empty' } } }, res: result }],
              sourceId: e.id,
              operatorInfo
            }
            this.constraints.push(constraint)
            return right(null)
          })
        }
      }
    }

    this.addToResults(e.id, right(toScheme(result)))
  }

  enterLambda(expr: QuintLambda) {
    expr.params.forEach(p => {
      // Use a more descriptive format for parameter type variables
      const paramTypeVar: QuintType = p.typeAnnotation || { 
        kind: 'var', 
        name: this.freshVarGenerator.freshVar('t_' + (p.name === '_' ? 'param' : p.name)) 
      }
      this.typesInScope.set(p.id, toScheme(paramTypeVar))
    })
  }

  //    Γ ∪ {p0: t0, ..., pn: tn} ⊢ e: (te, c)    t0, ..., tn are fresh
  // ---------------------------------------------------------------------- (LAMBDA)
  //            Γ ⊢ (p0, ..., pn) => e: ((t0, ..., tn) => te, c)
  exitLambda(e: QuintLambda) {
    if (this.errors.size !== 0) {
      return
    }

    // Get parameter types
    const paramTypesResult = mergeInMany(
      e.params.map(p =>
        this.fetchResult(p.id).map(paramType => {
          // If parameter has a type annotation, create a constraint
          if (p.typeAnnotation) {
            this.constraints.push({
              kind: 'eq',
              types: [p.typeAnnotation, paramType.type],
              sourceId: p.id,
            })
          }
          return paramType.type
        })
      )
    )

    // Get body type
    const bodyResult = this.fetchResult(e.expr.id)

    if (paramTypesResult.isRight() && bodyResult.isRight()) {
      const paramTypes = paramTypesResult.value
      const bodyType = bodyResult.value

      // Simple case: (x: A) => B becomes A => B
      if (paramTypes.length === 1) {
        const lambdaType: QuintType = {
          kind: 'fun',
          arg: paramTypes[0],
          res: bodyType.type,
        }
        this.addToResults(e.id, right(toScheme(lambdaType)))
      } else {
        // Multiple params: (x: A, y: B) => C becomes (A, B) => C
        // Represented as an operator type
        const lambdaType: QuintType = {
          kind: 'oper',
          args: paramTypes,
          res: bodyType.type,
        }
        this.addToResults(e.id, right(toScheme(lambdaType)))
      }
    }
  }

  //   Γ ⊢ e1: (t1, c1)  s = solve(c1)     s(Γ ∪ {n: t1}) ⊢ e2: (t2, c2)
  // ------------------------------------------------------------------------ (LET-OPDEF)
  //               Γ ⊢ val n = e1 { e2 }: (quantify(t2), c1 ∧ c2)
  exitLet(e: QuintLet) {
    if (this.errors.size !== 0) {
      return
    }

    // The opdef (which can be a val) has been typechecked
    const opdefResult = this.fetchResult(e.opdef.id)
    if (opdefResult.isRight()) {
      // Add the defined name to the environment
      this.typesInScope.set(e.opdef.id, opdefResult.value)

      // Typecheck the body with the new environment
      const exprResult = this.fetchResult(e.expr.id)
      if (exprResult.isRight()) {
        this.addToResults(e.id, right(exprResult.value))
      }
    }
  }

  exitDecl(_def: QuintDeclaration) {
    this.solveConstraints()
  }

  enterOpDef(def: QuintOpDef) {
    if (this.errors.size === 0) {
      this.tvs.set(def.id, this.freeNamesInScope())
    }
  }

  exitOpDef(def: QuintOpDef) {
    if (this.errors.size !== 0) {
      return
    }

    const exprResult = this.fetchResult(def.expr.id)
    if (exprResult.isRight()) {
      const t = exprResult.value

      // A name is polymorphic if its free type variables don't overlap with the
      // free variables of already defined names.
      const generalTypes = variablesDifference(
        freeTypes(t),
        def.id && this.tvs.has(def.id) ? this.tvs.get(def.id)! : { typeVariables: new Set(), rowVariables: new Set() }
      )
      const generalSchema = quantify(generalTypes, t.type)

      // If the type is annotated, check that the annotation is general enough
      if (def.typeAnnotation) {
        this.constraints.push({ kind: 'eq', types: [t.type, def.typeAnnotation], sourceId: def.id })
      }

      // If it is a pure declaration (without an implementation), use annotated type
      if (def.qualifier === 'pureval' || def.qualifier === 'puredef') {
        if (def.typeAnnotation) {
          const declaredSchema = toScheme(def.typeAnnotation)
          this.types.set(def.id, declaredSchema)
        } else {
          this.types.set(def.id, generalSchema)
        }
      }
      // If it is an ordinary definition, we add the generalized type to our schema context
      else {
        this.types.set(def.id, generalSchema)
      }
    } else {
      // For declaration, if the inference failed but we have an annotation,
      // we can still use the annotation type for checking the usages of this def.
      if (def.typeAnnotation && (def.qualifier === 'pureval' || def.qualifier === 'puredef') && def.id) {
        this.types.set(def.id, toScheme(def.typeAnnotation))
      }
    }
  }

  enterAssume(e: QuintAssume) {
    if (this.errors.size === 0) {
      this.tvs.set(e.id, this.freeNamesInScope())
    }
  }

  exitAssume(e: QuintAssume) {
    if (this.errors.size !== 0) {
      return
    }

    const assumptionResult = this.fetchResult(e.assumption.id)
    if (assumptionResult.isRight()) {
      const t = assumptionResult.value
      this.constraints.push({ kind: 'eq', types: [t.type, { kind: 'bool' }], sourceId: e.id })
      this.addToResults(e.id, right(toScheme({ kind: 'bool' })))
    } else {
      this.addToResults(e.id, right(toScheme({ kind: 'bool' })))
    }
  }

  private addToResults(exprId: bigint, result: Either<Error, TypeScheme>): void {
    result
      .map((type: TypeScheme) => {
        this.types.set(exprId, type)
        this.typesInScope.set(exprId, type)
      })
      .mapLeft((error: Error) => {
        const tree = typeof error === 'string' ? buildErrorLeaf(this.location, error) : error
        this.errors.set(exprId, tree as ErrorTree)
      })
  }

  private fetchResult(id: bigint): Either<ErrorTree, TypeScheme> {
    const t = this.typesInScope.get(id)
    if (t) {
      return right(t)
    } else {
      return left(
        buildErrorLeaf(
          this.location,
          `Couldn't find a type for declaration/expression with id ${id}. This is probably a definition with a type error that we failed to report properly.`
        )
      )
    }
  }

  private solveConstraints(): Either<void, Substitutions> {
    const c: Constraint =
      this.constraints.length == 0
        ? { kind: 'empty' }
        : { kind: 'conjunction', constraints: this.constraints, sourceId: 0n }

    const result = this.solvingFunction(this.table, c)
    this.constraints = []

    return result.mapLeft((newErrors: Map<bigint, ErrorTree>) => {
      newErrors.forEach((newError: ErrorTree, id: bigint) => {
        if (!this.errors.has(id)) {
          this.errors.set(id, newError)
        }
      })
    })
  }

  private typeForName(name: string, nameId: bigint, arity: number): Either<ErrorTree, QuintType> {
    // Search in the lookup table for the name
    let defId: bigint | undefined = undefined

    // Check if it's a built-in operator
    const bltSig = this.builtinSignatures.get(name)
    if (bltSig) {
      const sig = bltSig(arity)
      return right(this.newInstance(sig))
    }

    // Look through all definitions
    for (const [id, def] of this.table.entries()) {
      if (def.kind === 'def' && def.name === name) {
        defId = id
        break
      }
    }

    if (defId === undefined) {
      return left(
        buildErrorLeaf(
          `Looking for definition of ${name}`,
          `Couldn't find a definition for ${name}.
Did you forget to declare a variable or operator? Or maybe the name is not visible here.`
        )
      )
    }

    // Non-built-in name
    const typeDef = this.types.get(defId)
    if (typeDef) {
      return right(this.newInstance(typeDef))
    } else {
      return left(
        buildErrorLeaf(
          `Looking up the type of ${name}`,
          `Couldn't find a type for ${name}. This is probably an error in the typechecking logic. Please file a bug report.`
        )
      )
    }
  }

  // Creates a fresh instance of a polymorphic type
  private newInstance(t: TypeScheme): QuintType {
    const tvs: Map<string, QuintVarType> = new Map(
      [...t.typeVariables].map(tv => [tv, { kind: 'var', name: this.freshVarGenerator.freshVar('_t') } as QuintVarType])
    )
    const rvs: Map<string, Row> = new Map(
      [...t.rowVariables].map(rv => [rv, { kind: 'var', name: this.freshVarGenerator.freshVar('_r') } as Row])
    )

    return instantiateVariables(t.type, tvs, rvs)
  }

  // Calculate all type and row variables in scope
  private freeNamesInScope(): QuantifiedVariables {
    return [...this.typesInScope.values()].reduce(
      (acc, t) => {
        const free = freeTypes(t)
        free.typeVariables.forEach(tv => acc.typeVariables.add(tv))
        free.rowVariables.forEach(rv => acc.rowVariables.add(rv))
        return acc
      },
      { typeVariables: new Set(), rowVariables: new Set() } as QuantifiedVariables
    )
  }
}

function quantify(tvs: QuantifiedVariables, type: QuintType): TypeScheme {
  return { ...tvs, type }
}

function freeTypes(t: TypeScheme): QuantifiedVariables {
  return { typeVariables: new Set([...t.typeVariables]), rowVariables: new Set([...t.rowVariables]) }
}

function variablesDifference(a: QuantifiedVariables, b: QuantifiedVariables): QuantifiedVariables {
  return {
    typeVariables: new Set([...a.typeVariables].filter(v => !b.typeVariables.has(v))),
    rowVariables: new Set([...a.rowVariables].filter(v => !b.rowVariables.has(v))),
  }
}

// Replace type *variables* in a type with given substitutions
function instantiateVariables(type: QuintType, tvs: Map<string, QuintVarType>, rvs: Map<string, Row>): QuintType {
  if (type.kind === 'var') {
    return tvs.get(type.name) || type
  } else if (type.kind === 'set') {
    return { ...type, elem: instantiateVariables(type.elem, tvs, rvs) }
  } else if (type.kind === 'list') {
    return { ...type, elem: instantiateVariables(type.elem, tvs, rvs) }
  } else if (type.kind === 'oper') {
    const args = type.args.map(t => instantiateVariables(t, tvs, rvs))
    return { ...type, args, res: instantiateVariables(type.res, tvs, rvs) }
  } else if (type.kind === 'fun') {
    return {
      ...type,
      arg: instantiateVariables(type.arg, tvs, rvs),
      res: instantiateVariables(type.res, tvs, rvs),
    }
  } else if (type.kind === 'tup') {
    return {
      ...type,
      fields: instantiateVariablesForRow(type.fields, tvs, rvs),
    }
  } else if (type.kind === 'rec') {
    return {
      ...type,
      fields: instantiateVariablesForRow(type.fields, tvs, rvs),
    }
  } else if (type.kind === 'sum') {
    return {
      ...type,
      fields: instantiateVariablesForRow(type.fields, tvs, rvs) as ConcreteRow,
    }
  } else {
    return type
  }
}

// Replace row *variables* in a row with given substitutions
function instantiateVariablesForRow(row: Row, tvs: Map<string, QuintVarType>, rvs: Map<string, Row>): Row {
  if (row.kind === 'var') {
    return rvs.get(row.name) || row
  } else if (row.kind === 'empty') {
    return row
  } else if (row.kind === 'row') {
    const newFields = row.fields.map(field => ({
      fieldName: field.fieldName,
      fieldType: instantiateVariables(field.fieldType, tvs, rvs),
    }))

    return {
      kind: 'row',
      fields: newFields,
      other: instantiateVariablesForRow(row.other, tvs, rvs),
    }
  }

  return row
}
