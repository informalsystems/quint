import * as p from '../generated/QuintParser'
import { IdGenerator } from '../idGenerator'
import { ParserRuleContext } from 'antlr4ts/ParserRuleContext'
import { QuintListener } from '../generated/QuintListener'
import {
  OpQualifier,
  QuintApp,
  QuintBuiltinApp,
  QuintDeclaration,
  QuintDef,
  QuintEx,
  QuintLambda,
  QuintLambdaParameter,
  QuintLet,
  QuintModule,
  QuintName,
  QuintOpDef,
  QuintStr,
} from '../ir/quintIr'
import {
  ConcreteFixedRow,
  QuintConstType,
  QuintSumType,
  QuintType,
  Row,
  RowField,
  isUnitType,
  unitType,
} from '../ir/quintTypes'
import { strict as assert } from 'assert'
import { SourceMap } from './quintParserFrontend'
import { compact, zipWith } from 'lodash'
import { Maybe, just, none } from '@sweet-monads/maybe'
import { TerminalNode } from 'antlr4ts/tree/TerminalNode'
import { QuintTypeDef } from '../ir/quintIr'
import { zip } from '../util'
import { QuintError } from '../quintError'
import { differentTagsError, lowercaseTypeError, tooManySpreadsError } from './parseErrors'
import { Loc } from '../ErrorMessage'

/**
 * An ANTLR4 listener that constructs QuintIr objects out of the abstract
 * syntax tree. This listener does the minimal work of translating the AST
 * into IR. All semantic checks and type checking must be done at later
 * phases, as the IR may be constructed by other means.
 *
 * @author Igor Konnov, Gabriela Moreira
 */
export class ToIrListener implements QuintListener {
  constructor(sourceLocation: string, idGen: IdGenerator) {
    this.sourceLocation = sourceLocation
    this.idGen = idGen
  }

  /**
   * The modules derived as a result of parsing
   */
  modules: QuintModule[] = []
  /**
   * The stack of types that can be used as a result of type parsing.
   */
  typeStack: QuintType[] = []

  sourceMap: SourceMap = new Map()

  /**
   * If errors occur in the listener, this array contains explanations.
   */
  errors: QuintError[] = []

  private sourceLocation: string = ''

  // the stack of definitions
  protected declarationStack: QuintDeclaration[] = []
  // the stack of expressions
  protected exprStack: QuintEx[] = []
  // the stack of parameter lists
  protected paramStack: QuintLambdaParameter[] = []
  // stack of names used as parameters and assumptions
  protected identOrHoleStack: string[] = []
  // the stack for imported names
  protected identOrStarStack: string[] = []
  // the stack of rows for records and unions
  protected rowStack: Row[] = []
  // the stack of variants for a sum
  protected variantStack: RowField[] = []
  // an internal counter to assign unique numbers
  protected idGen: IdGenerator

  // translate: module <name> { ... }
  exitModule(ctx: p.ModuleContext) {
    assert(this.typeStack.length === 0, 'type stack must be empty')
    assert(this.exprStack.length === 0, 'expression stack must be empty')
    assert(this.identOrHoleStack.length === 0, 'parameter stack must be empty')

    const moduleId = this.getId(ctx)

    const module: QuintModule = {
      id: moduleId,
      name: ctx.qualId().text,
      declarations: this.declarationStack,
    }

    this.declarationStack = []

    const doc = getDocText(ctx.DOCCOMMENT())

    if (doc) {
      this.modules.push({ ...module, doc })
      return
    }

    this.modules.push(module)
  }

  // translate: const x: type
  exitConst(ctx: p.ConstContext) {
    const typeTag = this.popType().unwrap()

    const id = this.getId(ctx)
    const constDef: QuintDef = {
      kind: 'const',
      name: ctx.qualId().text,
      typeAnnotation: typeTag,
      id,
    }
    this.declarationStack.push(constDef)
  }

  // translate: var x: type
  exitVar(ctx: p.VarContext) {
    const typeTag = this.popType().unwrap()

    const id = this.getId(ctx)
    const varDef: QuintDef = {
      kind: 'var',
      name: ctx.qualId().text,
      typeAnnotation: typeTag,
      id,
    }
    this.declarationStack.push(varDef)
  }

  exitLetIn(ctx: p.LetInContext) {
    const def = this.declarationStack.pop()
    const expr = this.exprStack.pop()

    const id = this.getId(ctx)
    if (def && expr) {
      const letExpr: QuintEx = { id, kind: 'let', opdef: def as QuintOpDef, expr }
      this.exprStack.push(letExpr)
    }
  }

  exitNondetOperDef(ctx: p.NondetOperDefContext) {
    const name = ctx.qualId().text
    let typeAnnotation: QuintType | undefined
    if (ctx.type()) {
      const maybeType = this.popType()
      if (maybeType.isJust()) {
        // the operator is tagged with a type
        typeAnnotation = maybeType.value
      }
    }
    const expr = this.exprStack.pop()
    if (!expr) {
      return
    }

    const id = this.getId(ctx)

    const def: QuintDef = {
      id,
      kind: 'def',
      name,
      qualifier: 'nondet',
      expr,
      typeAnnotation,
    }

    this.declarationStack.push(def)
  }

  // special case for: nondet x = e1; e2
  exitNondet(ctx: p.NondetContext) {
    const def = this.declarationStack.pop()
    const nested = this.exprStack.pop()

    const id = this.getId(ctx)
    if (nested && def?.kind === 'def') {
      const letExpr: QuintEx = {
        id,
        kind: 'let',
        opdef: def,
        expr: nested,
      }
      this.exprStack.push(letExpr)
    }
  }

  /** **************** translate operator definititons **********************/

  // translate a top-level or nested operator definition
  exitOperDef(ctx: p.OperDefContext) {
    const name = ctx.normalCallName().text
    const [params, typeTag] = this.processOpDefParams(ctx)
    // get the definition body
    const expr = this.exprStack.pop()

    // extract the qualifier
    let qualifier: OpQualifier = 'def'
    if (ctx.qualifier()) {
      const qtext = ctx.qualifier().text
      // case distinction to make the type checker happy
      if (
        qtext === 'pureval' ||
        qtext === 'puredef' ||
        qtext === 'val' ||
        qtext === 'def' ||
        qtext === 'action' ||
        qtext === 'run' ||
        qtext === 'temporal'
      ) {
        qualifier = qtext
      } else {
        const ls = this.locStr(ctx)
        // istanbul ignore next
        assert(false, `exitOperDef: ${ls}: Unexpected qualifier: ${qtext}`)
      }
    }

    if (params) {
      // if the definition has parameters, introduce a lambda
      let body = expr ?? this.undefinedDef(ctx)
      const id = this.getId(ctx)

      if (params.length > 0) {
        body = {
          id,
          kind: 'lambda',
          params,
          qualifier,
          expr: expr ?? this.undefinedDef(ctx),
        }
      }
      const def: QuintOpDef = {
        id,
        kind: 'def',
        name,
        qualifier,
        expr: body,
      }
      if (typeTag.isJust()) {
        def.typeAnnotation = typeTag.value
      }
      this.declarationStack.push(def)
    } else {
      const ls = this.locStr(ctx)
      // istanbul ignore next
      assert(false, `exitOperDef: ${ls}: undefined expr or params in exitOperDef`)
    }
  }

  // translate a top-level def
  exitOper(ctx: p.OperContext) {
    const def = this.declarationStack[this.declarationStack.length - 1]
    const ls = this.locStr(ctx)
    assert(def, `exitOper: ${ls}: undefined operDef in exitOper`)
  }

  // The definition parameters may be of two kinds: C-like and ML-like.
  // Handle them here.
  processOpDefParams(ctx: p.OperDefContext): [QuintLambdaParameter[], Maybe<QuintType>] {
    const params = popMany(this.paramStack, ctx.parameter().length)
    // types of the parameters and of the result
    const ntypes = ctx.type().length
    if (ntypes === 0) {
      return [params, none()]
    } else if (ntypes > 1) {
      // a C-like signature, combine it into an operator type
      const types = popMany(this.typeStack, ntypes)
      const id = this.getId(ctx)
      const fullType: Maybe<QuintType> = just({
        id,
        kind: 'oper',
        args: types.slice(0, -1),
        res: types[types.length - 1],
      })
      return [params, fullType]
    } else {
      // the only type is on the stack
      const fullType = this.popType()
      return [params, fullType]
    }
  }

  // assume name = expr
  exitAssume(ctx: any) {
    const expr = this.exprStack.pop()!
    const name = this.identOrHoleStack.pop()!
    const id = this.getId(ctx)
    const assume: QuintDef = {
      id,
      kind: 'assume',
      name: name,
      assumption: expr,
    }
    this.declarationStack.push(assume)
  }

  // import Foo, import Foo as F, import Foo.x, import Foo.*
  // import Foo from "./foo.qnt", import Foo as F from "./foo.qnt",
  // import Foo.x from "./foo.qnt", import Foo.* from "./foo.qnt"
  exitImportMod(ctx: p.ImportModContext) {
    const defName = ctx.identOrStar() ? this.identOrStarStack.pop()! : undefined
    const protoName = ctx.name()[0].text
    const qualifier = ctx.name().length > 1 ? ctx.name()[1].text : undefined
    // slice <path> from the quoted string "<path>", if the path is present
    const fromSource = ctx.fromSource() ? ctx.fromSource()!.text.slice(1, -1) : undefined
    const id = this.getId(ctx)
    const importDecl: QuintDeclaration = {
      id,
      kind: 'import',
      defName: defName,
      protoName: protoName,
      qualifiedName: qualifier,
      fromSource,
    }
    this.declarationStack.push(importDecl)
  }

  exitExportMod(ctx: p.ExportModContext) {
    const defName = ctx.identOrStar() ? this.identOrStarStack.pop()! : undefined
    const protoName = ctx.name()[0].text
    const qualifier = ctx.name().length > 1 ? ctx.name()[1].text : undefined
    const id = this.getId(ctx)
    const exportDecl: QuintDeclaration = {
      id,
      kind: 'export',
      defName: defName,
      protoName: protoName,
      qualifiedName: qualifier,
    }
    this.declarationStack.push(exportDecl)
  }

  // type T
  exitTypeAbstractDef(ctx: p.TypeAbstractDefContext) {
    const name = ctx.qualId()!.text
    const id = this.getId(ctx)

    if (name[0].match('[a-z]')) {
      this.errors.push(lowercaseTypeError(id, name))
    }

    const def: QuintTypeDef = {
      id,
      kind: 'typedef',
      name,
    }

    this.declarationStack.push(def)
  }

  // type Alias = set(int)
  exitTypeAliasDef(ctx: p.TypeAliasDefContext) {
    const name = ctx.qualId()!.text
    const type = this.popType().value
    const id = this.getId(ctx)

    if (name[0].match('[a-z]')) {
      this.errors.push(lowercaseTypeError(id, name))
    }

    const def: QuintTypeDef = {
      id,
      kind: 'typedef',
      name,
      type,
    }

    this.declarationStack.push(def)
  }

  // type T = | A | B(t1) | C(t2)
  exitTypeSumDef(ctx: p.TypeSumDefContext) {
    const name = ctx._typeName!.text!
    const id = this.getId(ctx)

    // Build the type declaraion
    const fields: RowField[] = popMany(this.variantStack, this.variantStack.length)
    const row: ConcreteFixedRow = { kind: 'row', fields, other: { kind: 'empty' } }
    const type: QuintSumType = { id, kind: 'sum', fields: row }
    const typeName: QuintConstType = { id, kind: 'const', name }
    const def: QuintTypeDef = {
      id: id,
      name,
      kind: 'typedef',
      type,
    }

    // Generate all the variant constructors implied by a variant type definition
    // a variant constructor is an operator that injects an expression
    // into the sum type by wrapping it in a label
    //
    // E.g., given the type definition
    //
    // ```
    // type T = A(int) | B
    // ```
    //
    // We will generate
    //
    // ```
    // def A(__AParam) = variant("A", __AParam)
    // val B = {}
    // ```
    //
    // Allowing users to write:
    //
    // ```
    // val a: T = A(42)
    // val b: T = B
    // ```
    const constructors: QuintOpDef[] = zip(fields, ctx.typeSumVariant()).map(
      ([{ fieldName, fieldType }, variantCtx]) => {
        // Mangle the parameter name to avoid clashes
        // This shouldn't be visible to users
        const paramName = `__${fieldName}Param`

        let qualifier: OpQualifier
        let expr: QuintEx
        let typeAnnotation: QuintType

        const label: QuintStr = { id: this.getId(variantCtx), kind: 'str', value: fieldName }
        if (isUnitType(fieldType)) {
          // Its a `val` cause it has no parameters
          //
          // E.g., for B we will produce
          //
          // ```
          // val B: T = variant("B", {})
          // ```
          qualifier = 'val'

          // The nullary variant constructor is actualy
          // a variant pairing a label with the unit.
          const wrappedExpr = unitValue(this.getId(variantCtx._sumLabel))

          typeAnnotation = typeName
          expr = {
            id: this.getId(variantCtx),
            kind: 'app',
            opcode: 'variant',
            args: [label, wrappedExpr],
          }
        } else {
          // Otherwise we will build a constructor that takes one parameter
          //
          // E.g., for A(int) we will produce a
          //
          // ```
          // def A(x:int): T = variant("A", x)
          // ```
          qualifier = 'def'

          const params = [{ id: this.getId(variantCtx.type()!), name: paramName }]
          const wrappedExpr: QuintName = { kind: 'name', name: paramName, id: this.getId(variantCtx._sumLabel) }
          const variant: QuintBuiltinApp = {
            id: this.getId(variantCtx),
            kind: 'app',
            opcode: 'variant',
            args: [label, wrappedExpr],
          }

          typeAnnotation = { kind: 'oper', args: [fieldType], res: typeName }
          expr = { id: this.getId(variantCtx), kind: 'lambda', params, qualifier, expr: variant }
        }

        return { id: this.getId(variantCtx), kind: 'def', name: fieldName, qualifier, typeAnnotation, expr }
      }
    )

    this.declarationStack.push(def, ...constructors)
  }

  exitTypeSumVariant(ctx: p.TypeSumVariantContext) {
    const fieldName = ctx._sumLabel!.text!
    const poppedType = this.popType().value
    // Check if we have an accompanying type, and if not, then synthesize the
    // unit type.
    //
    // I.e., we interpret a variant `A` as `A({})`.
    const fieldType: QuintType = poppedType ? poppedType : unitType(this.getId(ctx))
    this.variantStack.push({ fieldName, fieldType })
  }

  // module Foo = Proto(x = a, y = b)
  // module Foo = Proto(x = a, y = b) from "<path>"
  exitInstanceMod(ctx: p.InstanceModContext) {
    const protoName = ctx.moduleName().text
    const qualifiedName = ctx.qualifiedName()?.text
    const names = ctx.name()!
    const nexprs = ctx.expr().length
    const overrides: [QuintLambdaParameter, QuintEx][] = []
    // slice <path> from the quoted string "<path>", if the path is present
    const fromSource = ctx.fromSource() ? ctx.fromSource()!.text.slice(1, -1) : undefined
    if (nexprs > 0) {
      const exprs = popMany(this.exprStack, nexprs)
      for (let i = 0; i < nexprs; i++) {
        const id = this.getId(names[i])
        const name = names[i].text
        overrides.push([{ id, name }, exprs[i]])
      }
    }
    const identityOverride = ctx.MUL() !== undefined

    const id = this.getId(ctx)
    const instance: QuintDeclaration = {
      id,
      kind: 'instance',
      qualifiedName: qualifiedName,
      protoName,
      overrides,
      identityOverride,
      fromSource,
    }
    this.declarationStack.push(instance)
  }

  /** ******************* translate expressions **************************/

  // an identifier or a literal, e.g., foo, 42, "hello", false
  exitLiteralOrId(ctx: p.LiteralOrIdContext) {
    const ident = ctx.qualId()

    const id = this.getId(ctx)
    if (ident) {
      // identifier
      this.exprStack.push({
        id,
        kind: 'name',
        name: ident.text,
      })
    }
    const intNode = ctx.INT()
    if (intNode) {
      // integer literal
      this.exprStack.push({
        id,
        kind: 'int',
        value: BigInt(intNode.text.replaceAll('_', '')),
      })
    }
    const boolNode = ctx.BOOL()
    if (boolNode) {
      // Boolean literal
      this.exprStack.push({
        id,
        kind: 'bool',
        value: boolNode.text === 'true',
      })
    }
    const strNode = ctx.STRING()
    if (strNode) {
      // string, remove the quotes!
      this.exprStack.push({
        id,
        kind: 'str',
        value: strNode.text.slice(1, -1),
      })
    }
  }

  // list access, e.g., f[10]
  exitListApp(ctx: any) {
    this.pushApplication(ctx, 'nth', popMany(this.exprStack, 2))
  }

  // operator application in the normal form, e.g., MyOper("foo", 42)
  exitOperApp(ctx: p.OperAppContext) {
    const name = ctx.normalCallName().text
    let args: QuintEx[] = []
    if (ctx.argList()) {
      // this operator has at least one argument
      const wrappedArgs = this.exprStack.pop()
      if (wrappedArgs && wrappedArgs.kind === 'app') {
        args = wrappedArgs.args
      } else {
        const ls = this.locStr(ctx)
        // istanbul ignore next
        assert(false, `exitOperApp: ${ls}: expected wrapped arguments`)
      }
    } // else no arguments, e.g., set(), list()

    this.pushApplication(ctx, name, args)
  }

  // operator application via dot, e.g., S.union(T)
  exitDotCall(ctx: p.DotCallContext) {
    // pop: the first argument, operator name, the rest of arguments (wrapped)
    const wrappedArgs = ctx.argList() ? this.exprStack.pop() : undefined
    const name = ctx.nameAfterDot().text
    const callee = this.exprStack.pop()
    if (callee === undefined) {
      const ls = this.locStr(ctx)
      assert(false, `exitDotCall: ${ls} callee not found`)
    }
    const hasParen = ctx.LPAREN()
    if (hasParen) {
      // the UFCS form e_1.f(e_2, ..., e_n)
      let args: QuintEx[] = []
      if (wrappedArgs) {
        // n >= 2: there is at least one argument in parentheses
        if (wrappedArgs.kind === 'app' && wrappedArgs.opcode === 'wrappedArgs') {
          args = [callee!].concat(wrappedArgs.args)
        } else {
          const ls = this.locStr(ctx)
          // istanbul ignore next
          assert(false, `exitDotCall: ${ls} expected wrappedArgs, found: ${wrappedArgs.kind}`)
        }
      } else {
        // no arguments, as in e.g., s.head()
        args = [callee!]
      }
      // apply the operator to the arguments
      this.pushApplication(ctx, name, args)
    } else {
      // accessing a tuple element, a record field, or name in a module
      const id = this.getId(ctx)
      const m = name.match(/^_([1-9][0-9]?)$/)
      if (m) {
        // accessing a tuple element via _1, _2, _3, etc.
        const idx: QuintEx = {
          id,
          kind: 'int',
          value: BigInt(m[1]),
        }

        this.pushApplication(ctx, 'item', [callee!, idx])
      } else {
        const field: QuintEx = {
          id,
          kind: 'str',
          value: name,
        }
        this.pushApplication(ctx, 'field', [callee!, field])
      }
    }
  }

  // a list of arguments
  exitArgList(ctx: p.ArgListContext) {
    const nargs = ctx.expr().length
    const args = popMany(this.exprStack, nargs)
    // wrap the arguments with a temporary operator,
    // to be unwrapped later
    this.exprStack.push({
      id: 0n,
      kind: 'app',
      opcode: 'wrappedArgs',
      args,
    })
  }

  // a lambda operator over multiple parameters
  exitLambdaUnsugared(ctx: p.LambdaUnsugaredContext) {
    const expr = this.exprStack.pop()
    const params = popMany(this.paramStack, ctx.parameter().length)
    if (expr) {
      const id = this.getId(ctx)
      this.exprStack.push({
        id,
        kind: 'lambda',
        params: params,
        qualifier: 'def',
        expr,
      })
    } else {
      const ls = this.locStr(ctx)
      // istanbul ignore next
      assert(false, `exitLambda: ${ls}: expected an expression`)
    }
  }

  // a lambda operator over a single tuple parameter,
  // unpacked into named fields
  exitLambdaTupleSugar(ctx: p.LambdaTupleSugarContext) {
    const expr = this.exprStack.pop()
    const params = popMany(this.paramStack, ctx.parameter().length)

    if (expr) {
      const id = this.getId(ctx)
      // a fresh parameter to substitute for the tupled parameters
      const freshLambdaParam = { id, name: `quintTupledLambdaParam${id}` }
      const letBindingForTupleParams = params.reduce(this.letBindingForTupleParam(ctx, freshLambdaParam), expr)
      const untupledLambda: QuintEx = {
        id: this.getId(ctx),
        kind: 'lambda',
        params: [freshLambdaParam],
        qualifier: 'def',
        expr: letBindingForTupleParams,
      }
      this.exprStack.push(untupledLambda)
    } else {
      const ls = this.locStr(ctx)
      // istanbul ignore next
      assert(false, `exitLambda: ${ls}: expected an expression`)
    }
  }

  // a single parameter in a lambda expression: an identifier or '_'
  exitIdentOrHole(ctx: p.IdentOrHoleContext) {
    if (ctx.text === '_') {
      // a hole '_'
      this.identOrHoleStack.push('_')
    } else {
      // a variable name
      this.identOrHoleStack.push(ctx.qualId()!.text)
    }
  }

  exitParameter(ctx: p.ParameterContext) {
    const name = popMany(this.identOrHoleStack, 1)[0]

    const id = this.getId(ctx)
    this.paramStack.push({ id, name })
  }

  // an identifier or star '*' in import
  exitIdentOrStar(ctx: p.IdentOrStarContext) {
    if (ctx.text === '*') {
      // a hole '_'
      this.identOrStarStack.push('*')
    } else {
      // a variable name
      this.identOrStarStack.push(ctx.qualId()!.text)
    }
  }

  // tuple constructor, e.g., (1, 2, 3)
  exitTuple(ctx: p.TupleContext) {
    const args = popMany(this.exprStack, ctx.expr().length)

    this.pushApplication(ctx, 'Tup', args)
  }

  // pair constructor, e.g., 2 -> 3
  exitPair(ctx: p.PairContext) {
    const args = popMany(this.exprStack, ctx.expr().length)
    this.pushApplication(ctx, 'Tup', args)
  }

  // list constructor, e.g., [1, 2, 3]
  exitList(ctx: p.ListContext) {
    const args = popMany(this.exprStack, ctx.expr().length)
    this.pushApplication(ctx, 'List', args)
  }

  // field: expr, or ...record
  exitRecElem(ctx: p.RecElemContext) {
    const expr = this.exprStack.pop()!
    // Wrap a pair 'field: expr' or a singleton 'record' into a tuple,
    // so we would be able to extract them in `exitRecord`.
    // The tuple here is a temporary container and nothing else.
    // Hence, we do not even need a unique id for it.
    if (ctx.simpleId()) {
      // field: expr
      const id = this.getId(ctx)
      const nameEx: QuintEx = {
        id,
        kind: 'str',
        value: ctx.simpleId()?.text!,
      }
      this.exprStack.push({
        id: 0n,
        kind: 'app',
        opcode: 'Tup',
        args: [nameEx, expr],
      })
    } else {
      // ...expr
      this.exprStack.push({
        id: 0n,
        kind: 'app',
        opcode: 'Tup',
        args: [expr],
      })
    }
  }

  // record constructor, e.g., { name: "igor", year: 2021 }
  exitRecord(ctx: p.RecordContext) {
    const elems = popMany(this.exprStack, ctx.recElem().length)
    const spreads = elems.filter(e => e.kind === 'app' && e.args.length === 1)
    const pairs = elems.map(e => (e.kind === 'app' && e.args.length === 2 ? e.args : [])).filter(es => es.length > 0)

    if (spreads.length === 0) {
      // { field1: value1, field2: value2 }
      this.pushApplication(ctx, 'Rec', pairs.flat())
    } else if (spreads.length > 1) {
      // error
      const id = this.getId(ctx)
      this.errors.push(tooManySpreadsError(id))
    } else {
      // { ...record, field1: value1, field2: value2 }
      // translate to record.with("field1", value1).with("field2", value2)
      let record: QuintEx = (spreads[0] as QuintApp).args[0]
      for (const p of pairs) {
        const id = this.getId(ctx)
        record = {
          id,
          kind: 'app',
          opcode: 'with',
          args: [record, ...p],
        }
      }
      this.exprStack.push(record)
    }
  }

  // '+' or '-'
  exitPlusMinus(ctx: p.PlusMinusContext) {
    const opcode = ctx.PLUS() !== undefined ? 'iadd' : 'isub'
    const args = popMany(this.exprStack, 2)
    this.pushApplication(ctx, opcode, args)
  }

  // '*', '/', or '%'
  exitMultDiv(ctx: p.MultDivContext) {
    const op = ctx._op
    if (op) {
      let opcode = ''
      switch (op.type) {
        case p.QuintParser.MUL:
          opcode = 'imul'
          break
        case p.QuintParser.DIV:
          opcode = 'idiv'
          break
        case p.QuintParser.MOD:
          opcode = 'imod'
          break
      }
      const args = popMany(this.exprStack, 2)
      this.pushApplication(ctx, opcode, args)
    }
  }

  // integer power, e.g., x^y
  exitPow(ctx: any) {
    const args = popMany(this.exprStack, 2)
    this.pushApplication(ctx, 'ipow', args)
  }

  // unary minus, e.g., -x
  exitUminus(ctx: any) {
    const arg = this.exprStack.pop()
    if (arg) {
      this.pushApplication(ctx, 'iuminus', [arg])
    }
  }

  // x' = e
  exitAsgn(ctx: p.AsgnContext) {
    const id = this.getId(ctx)

    const lhs: QuintName = {
      id,
      kind: 'name',
      name: ctx.qualId().text,
    }
    const [rhs] = popMany(this.exprStack, 1)
    this.pushApplication(ctx, 'assign', [lhs, rhs])
  }

  // GT | LT | GE | LE | NE | EQ
  exitRelations(ctx: p.RelationsContext) {
    const op = ctx._op
    if (op) {
      let opcode = ''
      switch (op.type) {
        case p.QuintParser.GT:
          opcode = 'igt'
          break
        case p.QuintParser.GE:
          opcode = 'igte'
          break
        case p.QuintParser.LT:
          opcode = 'ilt'
          break
        case p.QuintParser.LE:
          opcode = 'ilte'
          break
        case p.QuintParser.EQ:
          opcode = 'eq'
          break
        case p.QuintParser.NE:
          opcode = 'neq'
          break
      }
      const args = popMany(this.exprStack, 2)
      this.pushApplication(ctx, opcode, args)
    }
  }

  exitErrorEq(ctx: p.ErrorEqContext) {
    // An error was already reported. We push a valid expression to recover from the error
    const args = popMany(this.exprStack, 2)
    this.pushApplication(ctx, 'eq', args)
  }

  // p and q
  exitAnd(ctx: any) {
    const args = popMany(this.exprStack, 2)
    this.pushApplication(ctx, 'and', args)
  }

  // p or q
  exitOr(ctx: any) {
    const args = popMany(this.exprStack, 2)
    this.pushApplication(ctx, 'or', args)
  }

  // p implies q
  exitImplies(ctx: any) {
    const args = popMany(this.exprStack, 2)
    this.pushApplication(ctx, 'implies', args)
  }

  // p iff q
  exitIff(ctx: any) {
    const args = popMany(this.exprStack, 2)
    this.pushApplication(ctx, 'iff', args)
  }

  // and { p, q, r }
  exitAndExpr(ctx: p.AndExprContext) {
    const args = popMany(this.exprStack, ctx.expr().length)
    this.pushApplication(ctx, 'and', args)
  }

  // or { p, q, r }
  exitOrExpr(ctx: p.OrExprContext) {
    const args = popMany(this.exprStack, ctx.expr().length)
    this.pushApplication(ctx, 'or', args)
  }

  // all { p, q, r }
  exitActionAll(ctx: p.ActionAllContext) {
    const args = popMany(this.exprStack, ctx.expr().length)
    this.pushApplication(ctx, 'actionAll', args)
  }

  // any { p, q, r }
  exitActionAny(ctx: p.ActionAnyContext) {
    const args = popMany(this.exprStack, ctx.expr().length)
    this.pushApplication(ctx, 'actionAny', args)
  }

  // if (p) e1 else e2
  exitIfElse(ctx: p.IfElseContext) {
    const args = popMany(this.exprStack, 3)
    this.pushApplication(ctx, 'ite', args)
  }

  // match expr {
  //    | Variant1(var1) => expr1
  //    | Variantk(_) => exprk    // a hole in the payload
  //    | ...
  //    | Variantn(varn) => exprn
  //    | _ => exprm              // A wildcard match, acting as a catchall
  // }
  //
  // The above is represented in the UFC using an exotic `matchVariant` operator of the form
  //
  // matchVariant(epxr, label1, (var1) => expr1, ..., labeln, (varn) => exprn, "_", (_) => exprm)
  exitMatchSumExpr(ctx: p.MatchSumExprContext) {
    const matchId = this.getId(ctx)

    // We will have one expression for the matched expression, plus one for each elimination case
    const exprs = popMany(this.exprStack, ctx._matchCase.length + 1)

    // The first expression is the one we are matching on
    // the syntax rules ensure that at least this expression is given
    const expr = exprs.shift()!

    // after shifting off the match expr, the remaing exprs are the cases of the match expression
    const cases: (QuintStr | QuintLambda)[] = zip(exprs, ctx._matchCase).reduce(
      (acc: (QuintStr | QuintLambda)[], matchCase: [QuintEx, p.MatchSumCaseContext]) =>
        acc.concat(this.formMatchCase(matchCase)),
      []
    )
    const matchExpr: QuintBuiltinApp = {
      id: matchId,
      kind: 'app',
      opcode: 'matchVariant',
      args: [expr].concat(cases),
    }
    this.exprStack.push(matchExpr)
  }

  // A helper for forming match expressions
  //
  // For a single case parsed `matchCase`, we form the pair of the variant label
  // and the lambda that will eliminate the value carried by the variant.
  //
  // E.g., `A(x) => <expr>` becomes `["A", (x) => <expr>]`
  private formMatchCase([caseExpr, caseCtx]: [QuintEx, p.MatchSumCaseContext]): (QuintStr | QuintLambda)[] {
    const labelId = this.getId(caseCtx)
    const elimId = this.getId(caseCtx)
    let label: string
    let params: QuintLambdaParameter[]
    if (caseCtx._wildCardMatch) {
      // a wildcard case: _ => expr
      label = '_'
      params = []
    } else if (caseCtx._variantMatch) {
      const variant = caseCtx._variantMatch
      let name: string
      if (variant._variantParam) {
        name = variant._variantParam.text
      } else {
        // We either have a hole or no param specified, in which case our lambda only needs a hole
        name = '_'
      }
      label = variant._variantLabel.text
      params = [{ name, id: this.getId(variant) }]
    } else {
      throw new Error('impossible: either _wildCardMatch or _variantMatch must be present')
    }
    const labelStr: QuintStr = { id: labelId, kind: 'str', value: label }
    const elim: QuintLambda = { id: elimId, kind: 'lambda', qualifier: 'def', expr: caseExpr, params }
    return [labelStr, elim]
  }

  /** ******************* translate types ********************************/

  // the integer type, that is, int
  exitTypeInt(ctx: p.TypeIntContext) {
    const id = this.getId(ctx)
    this.typeStack.push({ id, kind: 'int' })
  }

  // the Boolean type, that is, bool
  exitTypeBool(ctx: p.TypeBoolContext) {
    const id = this.getId(ctx)
    this.typeStack.push({ id, kind: 'bool' })
  }

  // the string type, that is, str
  exitTypeStr(ctx: p.TypeStrContext) {
    const id = this.getId(ctx)
    this.typeStack.push({ id, kind: 'str' })
  }

  // a type variable, a type constant, or a reference to a type alias
  exitTypeConstOrVar(ctx: p.TypeConstOrVarContext) {
    const name = ctx.qualId().text
    const id = this.getId(ctx)
    if (name[0].match('[a-z]')) {
      // a type variable from: a, b, ... z
      this.typeStack.push({ id, kind: 'var', name })
    } else {
      // a type constant, e.g., declared via typedef
      this.typeStack.push({ id, kind: 'const', name })
    }
  }

  // a set type, e.g., set(int)
  exitTypeSet(ctx: p.TypeSetContext) {
    const last = this.popType().unwrap()
    const id = this.getId(ctx)
    this.typeStack.push({ id, kind: 'set', elem: last })
  }

  // a list type, e.g., list(int)
  exitTypeList(ctx: p.TypeListContext) {
    const top = this.popType().unwrap()
    const id = this.getId(ctx)
    this.typeStack.push({ id, kind: 'list', elem: top })
  }

  // A function type, e.g., str => int
  exitTypeFun(ctx: p.TypeFunContext) {
    const res = this.popType().unwrap()
    const arg = this.popType().unwrap()
    const id = this.getId(ctx)
    this.typeStack.push({ id, kind: 'fun', arg, res })
  }

  // A tuple type, e.g., (int, bool)
  // the type stack contains the types of the elements
  exitTypeTuple(ctx: p.TypeTupleContext) {
    const elemTypes: QuintType[] = popMany(this.typeStack, ctx.type().length)
    const id = this.getId(ctx)

    const fields = elemTypes.map((t, i) => ({ fieldName: `${i}`, fieldType: t }))
    this.typeStack.push({
      id: id,
      kind: 'tup',
      fields: { kind: 'row', fields: fields, other: { kind: 'empty' } },
    })
  }

  exitRow(ctx: p.RowContext) {
    const names = ctx.rowLabel().map(n => n.text)
    const elemTypes: QuintType[] = popMany(this.typeStack, ctx.type().length)

    const fields = compact(
      zipWith(names, elemTypes, (name, elemType) => {
        if (name !== undefined && elemType !== undefined) {
          return { fieldName: name, fieldType: elemType }
        } else {
          return undefined
        }
      })
    )

    let other: Row = ctx._rowVar! ? { kind: 'var', name: ctx._rowVar!.text! } : { kind: 'empty' }

    const row: Row = { kind: 'row', fields, other }
    this.rowStack.push(row)
  }

  // A record type that is not a disjoint union, e.g.,
  // { name: str, year: int }
  // The row stack contains the row with the types of the fields.
  exitTypeRec(ctx: p.TypeRecContext) {
    const row = this.popRow()
    const id = this.getId(ctx)
    this.typeStack.push({ id, kind: 'rec', fields: row })
  }

  // A disjoint union type, e.g.,
  //   | { type: "ack", from: address }
  //   | { type: "syn", to: address }
  exitTypeUnionRec(ctx: p.TypeUnionRecContext) {
    const size = ctx.typeUnionRecOne().length
    const ls = this.locStr(ctx)
    assert(size > 0, `exitTypeUnionRec: ${ls}: size == 0`)
    const singletonUnions: QuintType[] = popMany(this.typeStack, size)
    if (singletonUnions && singletonUnions[0].kind === 'union') {
      const tag = singletonUnions[0].tag
      let records = singletonUnions[0].records
      const id = this.getId(ctx)
      for (let i = 1; i < size; i++) {
        const one = singletonUnions[i]
        if (one.kind === 'union') {
          if (one.tag === tag) {
            records = records.concat(one.records)
          } else {
            this.errors.push(differentTagsError(id, tag, one.tag))
          }
        } else {
          // istanbul ignore next
          assert(false, 'exitTypeUnionRec: no union in exitTypeUnionRec')
        }
      }
      this.typeStack.push({ id, kind: 'union', tag, records })
    } else {
      const ls = this.locStr(ctx)
      // istanbul ignore next
      assert(false, `exitTypeUnionRec: ${ls} no union in exitTypeUnionRec`)
    }
  }

  // One option of a disjoint union, e.g.,
  //   | { type: "ack", from: address }
  // The row stack contains the row with the types of the fields.
  exitTypeUnionRecOne(ctx: p.TypeUnionRecOneContext) {
    // the first name is the tag name (according to the grammar)
    const tagName = ctx.qualId().text
    const tagVal = ctx.STRING().toString().slice(1, -1)
    let records: { tagValue: string; fields: Row }[] = []
    if (ctx.row()) {
      const row = this.popRow()
      records = [{ tagValue: tagVal, fields: row }]
    }
    // construct a singleton disjoint union, which should be assembled above
    const singleton: QuintType = {
      id: 0n, // This ID will be discarded in assembly.
      kind: 'union',
      tag: tagName,
      records,
    }

    this.typeStack.push(singleton)
  }

  // an operator type, e.g., (int, str) => bool
  exitTypeOper(ctx: p.TypeOperContext) {
    const resType = this.popType().unwrap()
    const nargs = ctx.type().length - 1
    const argTypes: QuintType[] = popMany(this.typeStack, nargs)
    const id = this.getId(ctx)
    this.typeStack.push({
      id,
      kind: 'oper',
      args: argTypes,
      res: resType,
    })
  }

  exitDocumentedDeclaration(ctx: p.DocumentedDeclarationContext) {
    const doc = getDocText(ctx.DOCCOMMENT())

    if (doc) {
      // Pop last declaration and re-push it with the doc
      const decl = this.declarationStack.pop()!
      this.declarationStack.push({ doc, ...decl })
    }
  }

  // Generate an id and add it to the sourceMap
  private getId(ctx: ParserRuleContext): bigint {
    const id = this.idGen.nextId()
    this.sourceMap.set(id, this.loc(ctx))
    return id
  }

  /*
   * Produce a human-readable location string.
   */
  private locStr(ctx: ParserRuleContext) {
    const line = ctx.start.line
    const col = ctx.start.charPositionInLine
    return `${line}:${col}`
  }

  private loc(ctx: ParserRuleContext): Loc {
    if (ctx.stop) {
      // Try to use index. If not available, use column instead.
      // This is what works best with the information provided by the parser
      const endCol =
        ctx.stop.stopIndex !== 0
          ? ctx.start.charPositionInLine + (ctx.stop.stopIndex - ctx.start.startIndex)
          : ctx.stop.charPositionInLine
      return {
        source: this.sourceLocation,
        start: { line: ctx.start.line - 1, col: ctx.start.charPositionInLine, index: ctx.start.startIndex },
        end: { line: ctx.stop.line - 1, col: endCol, index: ctx.stop.stopIndex },
      }
    } else {
      return {
        source: this.sourceLocation,
        start: { line: ctx.start.line - 1, col: ctx.start.charPositionInLine, index: ctx.start.startIndex },
      }
    }
  }

  // Push the application of operator `name` to `args` onto the internal
  // stack of expressions
  private pushApplication(ctx: any, name: string, args: QuintEx[]) {
    const id = this.getId(ctx)
    this.exprStack.push({
      id,
      kind: 'app',
      opcode: name,
      args,
    })
  }

  // pop a type
  private popType(): Maybe<QuintType> {
    // the user has specified a type
    const tp = this.typeStack.pop()
    return tp ? just(tp) : none()
  }

  // pop a row
  private popRow(): Row {
    // the user has specified a row
    const tp = this.rowStack.pop()
    return tp!
  }

  private undefinedDef(ctx: any): QuintEx {
    const id = this.getId(ctx)
    return { id, kind: 'bool', value: true }
  }

  /**
   * Return a function that takes a QuintEx `body`, a QuintLambdaParameter `param`,
   * and the parameter's `index` and returns a let-in definition of the form
   * `let ${param.name} = ${freshParam.name}._${index} ; body`.
   *
   * Intended use: Reduce tupled Quint lambda parameters into an equivalent let-in
   * form ("tuple unboxing"). For example, `((a, b)) => body` can be reduced to
   * `freshParam => let a = freshParam._1; let b = freshParam._2; body`.
   *
   * @param ctx         parser context of the tuple-sugared lambda
   * @param freshParam  a fresh QuintLambdaParameter to substitute for the tupled parameters
   */
  private letBindingForTupleParam(ctx: p.LambdaTupleSugarContext, freshParam: QuintLambdaParameter) {
    return (body: QuintEx, param: QuintLambdaParameter, index: number): QuintLet => {
      return {
        id: this.getId(ctx),
        kind: 'let',
        opdef: {
          id: param.id,
          kind: 'def',
          name: param.name,
          qualifier: 'pureval',
          expr: {
            id: this.getId(ctx),
            kind: 'app',
            opcode: 'item',
            args: [
              { id: this.getId(ctx), kind: 'name', name: freshParam.name },
              { id: this.getId(ctx), kind: 'int', value: BigInt(index + 1) },
            ],
          },
        },
        expr: body,
      }
    }
  }
}

function popMany<T>(stack: T[], n: number): T[] {
  if (n === 0) {
    // Special case since splice(-0) returns the whole array
    return []
  }
  assert(stack.length >= n, 'popMany: too few elements in stack')

  return stack.splice(-n)
}

/* The comment content is the text of the comment minus the `/// ` prefix */
function getDocText(doc: TerminalNode[]): string {
  return doc.map(l => l.text.slice(4, -1)).join('\n')
}

// Helper to construct an empty record (the unit value)
function unitValue(id: bigint): QuintBuiltinApp {
  return {
    id,
    kind: 'app',
    opcode: 'Rec',
    args: [],
  }
}
