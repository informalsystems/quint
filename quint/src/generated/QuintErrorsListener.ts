// Generated from ./src/generated/QuintErrors.g4 by ANTLR 4.9.0-SNAPSHOT



// Used for forming errors
import { quintErrorToString } from '../quintError'



import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { TypeFunContext } from "./QuintErrorsParser";
import { TypeOperContext } from "./QuintErrorsParser";
import { TypeSetContext } from "./QuintErrorsParser";
import { TypeListContext } from "./QuintErrorsParser";
import { TypeTupleContext } from "./QuintErrorsParser";
import { TypeRecContext } from "./QuintErrorsParser";
import { TypeUnionRecContext } from "./QuintErrorsParser";
import { TypeIntContext } from "./QuintErrorsParser";
import { TypeStrContext } from "./QuintErrorsParser";
import { TypeBoolContext } from "./QuintErrorsParser";
import { TypeConstOrVarContext } from "./QuintErrorsParser";
import { TypeParenContext } from "./QuintErrorsParser";
import { TypeAbstractDefContext } from "./QuintErrorsParser";
import { TypeAliasDefContext } from "./QuintErrorsParser";
import { TypeSumDefContext } from "./QuintErrorsParser";
import { DotCallContext } from "./QuintErrorsParser";
import { LambdaConsContext } from "./QuintErrorsParser";
import { OperAppContext } from "./QuintErrorsParser";
import { ListAppContext } from "./QuintErrorsParser";
import { PowContext } from "./QuintErrorsParser";
import { UminusContext } from "./QuintErrorsParser";
import { MultDivContext } from "./QuintErrorsParser";
import { PlusMinusContext } from "./QuintErrorsParser";
import { RelationsContext } from "./QuintErrorsParser";
import { AsgnContext } from "./QuintErrorsParser";
import { ErrorEqContext } from "./QuintErrorsParser";
import { AndExprContext } from "./QuintErrorsParser";
import { AndContext } from "./QuintErrorsParser";
import { OrExprContext } from "./QuintErrorsParser";
import { OrContext } from "./QuintErrorsParser";
import { IffContext } from "./QuintErrorsParser";
import { ImpliesContext } from "./QuintErrorsParser";
import { MatchContext } from "./QuintErrorsParser";
import { ActionAllContext } from "./QuintErrorsParser";
import { ActionAnyContext } from "./QuintErrorsParser";
import { LiteralOrIdContext } from "./QuintErrorsParser";
import { TupleContext } from "./QuintErrorsParser";
import { PairContext } from "./QuintErrorsParser";
import { RecordContext } from "./QuintErrorsParser";
import { ListContext } from "./QuintErrorsParser";
import { IfElseContext } from "./QuintErrorsParser";
import { LetInContext } from "./QuintErrorsParser";
import { NondetContext } from "./QuintErrorsParser";
import { ParenContext } from "./QuintErrorsParser";
import { BracesContext } from "./QuintErrorsParser";
import { ModulesContext } from "./QuintErrorsParser";
import { ModuleContext } from "./QuintErrorsParser";
import { DeclarationContext } from "./QuintErrorsParser";
import { ConstDefContext } from "./QuintErrorsParser";
import { OperDefContext } from "./QuintErrorsParser";
import { TypeDefContext } from "./QuintErrorsParser";
import { TypeSumVariantContext } from "./QuintErrorsParser";
import { NondetOperDefContext } from "./QuintErrorsParser";
import { QualifierContext } from "./QuintErrorsParser";
import { ImportModContext } from "./QuintErrorsParser";
import { ExportModContext } from "./QuintErrorsParser";
import { InstanceModContext } from "./QuintErrorsParser";
import { ModuleNameContext } from "./QuintErrorsParser";
import { NameContext } from "./QuintErrorsParser";
import { QualifiedNameContext } from "./QuintErrorsParser";
import { FromSourceContext } from "./QuintErrorsParser";
import { TypeContext } from "./QuintErrorsParser";
import { TypeUnionRecOneContext } from "./QuintErrorsParser";
import { RowContext } from "./QuintErrorsParser";
import { RowLabelContext } from "./QuintErrorsParser";
import { ExprContext } from "./QuintErrorsParser";
import { MatchSumExprContext } from "./QuintErrorsParser";
import { MatchSumCaseContext } from "./QuintErrorsParser";
import { MatchSumVariantContext } from "./QuintErrorsParser";
import { DeclarationOrExprContext } from "./QuintErrorsParser";
import { LambdaContext } from "./QuintErrorsParser";
import { LambdaUnsugaredContext } from "./QuintErrorsParser";
import { LambdaTupleSugarContext } from "./QuintErrorsParser";
import { IdentOrHoleContext } from "./QuintErrorsParser";
import { ParameterContext } from "./QuintErrorsParser";
import { IdentOrStarContext } from "./QuintErrorsParser";
import { ArgListContext } from "./QuintErrorsParser";
import { RecElemContext } from "./QuintErrorsParser";
import { NormalCallNameContext } from "./QuintErrorsParser";
import { NameAfterDotContext } from "./QuintErrorsParser";
import { OperatorContext } from "./QuintErrorsParser";
import { LiteralContext } from "./QuintErrorsParser";
import { QualIdContext } from "./QuintErrorsParser";
import { SimpleIdContext } from "./QuintErrorsParser";
import { EmptyContext } from "./QuintErrorsParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `QuintErrorsParser`.
 */
export interface QuintErrorsListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `typeFun`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeFun?: (ctx: TypeFunContext) => void;
	/**
	 * Exit a parse tree produced by the `typeFun`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeFun?: (ctx: TypeFunContext) => void;

	/**
	 * Enter a parse tree produced by the `typeOper`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeOper?: (ctx: TypeOperContext) => void;
	/**
	 * Exit a parse tree produced by the `typeOper`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeOper?: (ctx: TypeOperContext) => void;

	/**
	 * Enter a parse tree produced by the `typeSet`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeSet?: (ctx: TypeSetContext) => void;
	/**
	 * Exit a parse tree produced by the `typeSet`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeSet?: (ctx: TypeSetContext) => void;

	/**
	 * Enter a parse tree produced by the `typeList`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeList?: (ctx: TypeListContext) => void;
	/**
	 * Exit a parse tree produced by the `typeList`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeList?: (ctx: TypeListContext) => void;

	/**
	 * Enter a parse tree produced by the `typeTuple`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeTuple?: (ctx: TypeTupleContext) => void;
	/**
	 * Exit a parse tree produced by the `typeTuple`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeTuple?: (ctx: TypeTupleContext) => void;

	/**
	 * Enter a parse tree produced by the `typeRec`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeRec?: (ctx: TypeRecContext) => void;
	/**
	 * Exit a parse tree produced by the `typeRec`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeRec?: (ctx: TypeRecContext) => void;

	/**
	 * Enter a parse tree produced by the `typeUnionRec`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeUnionRec?: (ctx: TypeUnionRecContext) => void;
	/**
	 * Exit a parse tree produced by the `typeUnionRec`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeUnionRec?: (ctx: TypeUnionRecContext) => void;

	/**
	 * Enter a parse tree produced by the `typeInt`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeInt?: (ctx: TypeIntContext) => void;
	/**
	 * Exit a parse tree produced by the `typeInt`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeInt?: (ctx: TypeIntContext) => void;

	/**
	 * Enter a parse tree produced by the `typeStr`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeStr?: (ctx: TypeStrContext) => void;
	/**
	 * Exit a parse tree produced by the `typeStr`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeStr?: (ctx: TypeStrContext) => void;

	/**
	 * Enter a parse tree produced by the `typeBool`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeBool?: (ctx: TypeBoolContext) => void;
	/**
	 * Exit a parse tree produced by the `typeBool`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeBool?: (ctx: TypeBoolContext) => void;

	/**
	 * Enter a parse tree produced by the `typeConstOrVar`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeConstOrVar?: (ctx: TypeConstOrVarContext) => void;
	/**
	 * Exit a parse tree produced by the `typeConstOrVar`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeConstOrVar?: (ctx: TypeConstOrVarContext) => void;

	/**
	 * Enter a parse tree produced by the `typeParen`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterTypeParen?: (ctx: TypeParenContext) => void;
	/**
	 * Exit a parse tree produced by the `typeParen`
	 * labeled alternative in `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitTypeParen?: (ctx: TypeParenContext) => void;

	/**
	 * Enter a parse tree produced by the `typeAbstractDef`
	 * labeled alternative in `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	enterTypeAbstractDef?: (ctx: TypeAbstractDefContext) => void;
	/**
	 * Exit a parse tree produced by the `typeAbstractDef`
	 * labeled alternative in `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	exitTypeAbstractDef?: (ctx: TypeAbstractDefContext) => void;

	/**
	 * Enter a parse tree produced by the `typeAliasDef`
	 * labeled alternative in `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	enterTypeAliasDef?: (ctx: TypeAliasDefContext) => void;
	/**
	 * Exit a parse tree produced by the `typeAliasDef`
	 * labeled alternative in `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	exitTypeAliasDef?: (ctx: TypeAliasDefContext) => void;

	/**
	 * Enter a parse tree produced by the `typeSumDef`
	 * labeled alternative in `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	enterTypeSumDef?: (ctx: TypeSumDefContext) => void;
	/**
	 * Exit a parse tree produced by the `typeSumDef`
	 * labeled alternative in `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	exitTypeSumDef?: (ctx: TypeSumDefContext) => void;

	/**
	 * Enter a parse tree produced by the `dotCall`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterDotCall?: (ctx: DotCallContext) => void;
	/**
	 * Exit a parse tree produced by the `dotCall`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitDotCall?: (ctx: DotCallContext) => void;

	/**
	 * Enter a parse tree produced by the `lambdaCons`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterLambdaCons?: (ctx: LambdaConsContext) => void;
	/**
	 * Exit a parse tree produced by the `lambdaCons`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitLambdaCons?: (ctx: LambdaConsContext) => void;

	/**
	 * Enter a parse tree produced by the `operApp`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterOperApp?: (ctx: OperAppContext) => void;
	/**
	 * Exit a parse tree produced by the `operApp`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitOperApp?: (ctx: OperAppContext) => void;

	/**
	 * Enter a parse tree produced by the `listApp`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterListApp?: (ctx: ListAppContext) => void;
	/**
	 * Exit a parse tree produced by the `listApp`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitListApp?: (ctx: ListAppContext) => void;

	/**
	 * Enter a parse tree produced by the `pow`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterPow?: (ctx: PowContext) => void;
	/**
	 * Exit a parse tree produced by the `pow`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitPow?: (ctx: PowContext) => void;

	/**
	 * Enter a parse tree produced by the `uminus`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterUminus?: (ctx: UminusContext) => void;
	/**
	 * Exit a parse tree produced by the `uminus`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitUminus?: (ctx: UminusContext) => void;

	/**
	 * Enter a parse tree produced by the `multDiv`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterMultDiv?: (ctx: MultDivContext) => void;
	/**
	 * Exit a parse tree produced by the `multDiv`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitMultDiv?: (ctx: MultDivContext) => void;

	/**
	 * Enter a parse tree produced by the `plusMinus`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterPlusMinus?: (ctx: PlusMinusContext) => void;
	/**
	 * Exit a parse tree produced by the `plusMinus`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitPlusMinus?: (ctx: PlusMinusContext) => void;

	/**
	 * Enter a parse tree produced by the `relations`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterRelations?: (ctx: RelationsContext) => void;
	/**
	 * Exit a parse tree produced by the `relations`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitRelations?: (ctx: RelationsContext) => void;

	/**
	 * Enter a parse tree produced by the `asgn`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterAsgn?: (ctx: AsgnContext) => void;
	/**
	 * Exit a parse tree produced by the `asgn`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitAsgn?: (ctx: AsgnContext) => void;

	/**
	 * Enter a parse tree produced by the `errorEq`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterErrorEq?: (ctx: ErrorEqContext) => void;
	/**
	 * Exit a parse tree produced by the `errorEq`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitErrorEq?: (ctx: ErrorEqContext) => void;

	/**
	 * Enter a parse tree produced by the `andExpr`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterAndExpr?: (ctx: AndExprContext) => void;
	/**
	 * Exit a parse tree produced by the `andExpr`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitAndExpr?: (ctx: AndExprContext) => void;

	/**
	 * Enter a parse tree produced by the `and`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterAnd?: (ctx: AndContext) => void;
	/**
	 * Exit a parse tree produced by the `and`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitAnd?: (ctx: AndContext) => void;

	/**
	 * Enter a parse tree produced by the `orExpr`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterOrExpr?: (ctx: OrExprContext) => void;
	/**
	 * Exit a parse tree produced by the `orExpr`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitOrExpr?: (ctx: OrExprContext) => void;

	/**
	 * Enter a parse tree produced by the `or`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterOr?: (ctx: OrContext) => void;
	/**
	 * Exit a parse tree produced by the `or`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitOr?: (ctx: OrContext) => void;

	/**
	 * Enter a parse tree produced by the `iff`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterIff?: (ctx: IffContext) => void;
	/**
	 * Exit a parse tree produced by the `iff`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitIff?: (ctx: IffContext) => void;

	/**
	 * Enter a parse tree produced by the `implies`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterImplies?: (ctx: ImpliesContext) => void;
	/**
	 * Exit a parse tree produced by the `implies`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitImplies?: (ctx: ImpliesContext) => void;

	/**
	 * Enter a parse tree produced by the `match`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterMatch?: (ctx: MatchContext) => void;
	/**
	 * Exit a parse tree produced by the `match`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitMatch?: (ctx: MatchContext) => void;

	/**
	 * Enter a parse tree produced by the `actionAll`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterActionAll?: (ctx: ActionAllContext) => void;
	/**
	 * Exit a parse tree produced by the `actionAll`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitActionAll?: (ctx: ActionAllContext) => void;

	/**
	 * Enter a parse tree produced by the `actionAny`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterActionAny?: (ctx: ActionAnyContext) => void;
	/**
	 * Exit a parse tree produced by the `actionAny`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitActionAny?: (ctx: ActionAnyContext) => void;

	/**
	 * Enter a parse tree produced by the `literalOrId`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterLiteralOrId?: (ctx: LiteralOrIdContext) => void;
	/**
	 * Exit a parse tree produced by the `literalOrId`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitLiteralOrId?: (ctx: LiteralOrIdContext) => void;

	/**
	 * Enter a parse tree produced by the `tuple`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterTuple?: (ctx: TupleContext) => void;
	/**
	 * Exit a parse tree produced by the `tuple`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitTuple?: (ctx: TupleContext) => void;

	/**
	 * Enter a parse tree produced by the `pair`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterPair?: (ctx: PairContext) => void;
	/**
	 * Exit a parse tree produced by the `pair`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitPair?: (ctx: PairContext) => void;

	/**
	 * Enter a parse tree produced by the `record`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterRecord?: (ctx: RecordContext) => void;
	/**
	 * Exit a parse tree produced by the `record`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitRecord?: (ctx: RecordContext) => void;

	/**
	 * Enter a parse tree produced by the `list`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterList?: (ctx: ListContext) => void;
	/**
	 * Exit a parse tree produced by the `list`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitList?: (ctx: ListContext) => void;

	/**
	 * Enter a parse tree produced by the `ifElse`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterIfElse?: (ctx: IfElseContext) => void;
	/**
	 * Exit a parse tree produced by the `ifElse`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitIfElse?: (ctx: IfElseContext) => void;

	/**
	 * Enter a parse tree produced by the `letIn`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterLetIn?: (ctx: LetInContext) => void;
	/**
	 * Exit a parse tree produced by the `letIn`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitLetIn?: (ctx: LetInContext) => void;

	/**
	 * Enter a parse tree produced by the `nondet`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterNondet?: (ctx: NondetContext) => void;
	/**
	 * Exit a parse tree produced by the `nondet`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitNondet?: (ctx: NondetContext) => void;

	/**
	 * Enter a parse tree produced by the `paren`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterParen?: (ctx: ParenContext) => void;
	/**
	 * Exit a parse tree produced by the `paren`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitParen?: (ctx: ParenContext) => void;

	/**
	 * Enter a parse tree produced by the `braces`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterBraces?: (ctx: BracesContext) => void;
	/**
	 * Exit a parse tree produced by the `braces`
	 * labeled alternative in `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitBraces?: (ctx: BracesContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.modules`.
	 * @param ctx the parse tree
	 */
	enterModules?: (ctx: ModulesContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.modules`.
	 * @param ctx the parse tree
	 */
	exitModules?: (ctx: ModulesContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.module`.
	 * @param ctx the parse tree
	 */
	enterModule?: (ctx: ModuleContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.module`.
	 * @param ctx the parse tree
	 */
	exitModule?: (ctx: ModuleContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.declaration`.
	 * @param ctx the parse tree
	 */
	enterDeclaration?: (ctx: DeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.declaration`.
	 * @param ctx the parse tree
	 */
	exitDeclaration?: (ctx: DeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.constDef`.
	 * @param ctx the parse tree
	 */
	enterConstDef?: (ctx: ConstDefContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.constDef`.
	 * @param ctx the parse tree
	 */
	exitConstDef?: (ctx: ConstDefContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.operDef`.
	 * @param ctx the parse tree
	 */
	enterOperDef?: (ctx: OperDefContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.operDef`.
	 * @param ctx the parse tree
	 */
	exitOperDef?: (ctx: OperDefContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	enterTypeDef?: (ctx: TypeDefContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.typeDef`.
	 * @param ctx the parse tree
	 */
	exitTypeDef?: (ctx: TypeDefContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.typeSumVariant`.
	 * @param ctx the parse tree
	 */
	enterTypeSumVariant?: (ctx: TypeSumVariantContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.typeSumVariant`.
	 * @param ctx the parse tree
	 */
	exitTypeSumVariant?: (ctx: TypeSumVariantContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.nondetOperDef`.
	 * @param ctx the parse tree
	 */
	enterNondetOperDef?: (ctx: NondetOperDefContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.nondetOperDef`.
	 * @param ctx the parse tree
	 */
	exitNondetOperDef?: (ctx: NondetOperDefContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.qualifier`.
	 * @param ctx the parse tree
	 */
	enterQualifier?: (ctx: QualifierContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.qualifier`.
	 * @param ctx the parse tree
	 */
	exitQualifier?: (ctx: QualifierContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.importMod`.
	 * @param ctx the parse tree
	 */
	enterImportMod?: (ctx: ImportModContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.importMod`.
	 * @param ctx the parse tree
	 */
	exitImportMod?: (ctx: ImportModContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.exportMod`.
	 * @param ctx the parse tree
	 */
	enterExportMod?: (ctx: ExportModContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.exportMod`.
	 * @param ctx the parse tree
	 */
	exitExportMod?: (ctx: ExportModContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.instanceMod`.
	 * @param ctx the parse tree
	 */
	enterInstanceMod?: (ctx: InstanceModContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.instanceMod`.
	 * @param ctx the parse tree
	 */
	exitInstanceMod?: (ctx: InstanceModContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.moduleName`.
	 * @param ctx the parse tree
	 */
	enterModuleName?: (ctx: ModuleNameContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.moduleName`.
	 * @param ctx the parse tree
	 */
	exitModuleName?: (ctx: ModuleNameContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.name`.
	 * @param ctx the parse tree
	 */
	enterName?: (ctx: NameContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.name`.
	 * @param ctx the parse tree
	 */
	exitName?: (ctx: NameContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.qualifiedName`.
	 * @param ctx the parse tree
	 */
	enterQualifiedName?: (ctx: QualifiedNameContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.qualifiedName`.
	 * @param ctx the parse tree
	 */
	exitQualifiedName?: (ctx: QualifiedNameContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.fromSource`.
	 * @param ctx the parse tree
	 */
	enterFromSource?: (ctx: FromSourceContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.fromSource`.
	 * @param ctx the parse tree
	 */
	exitFromSource?: (ctx: FromSourceContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	enterType?: (ctx: TypeContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.type`.
	 * @param ctx the parse tree
	 */
	exitType?: (ctx: TypeContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.typeUnionRecOne`.
	 * @param ctx the parse tree
	 */
	enterTypeUnionRecOne?: (ctx: TypeUnionRecOneContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.typeUnionRecOne`.
	 * @param ctx the parse tree
	 */
	exitTypeUnionRecOne?: (ctx: TypeUnionRecOneContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.row`.
	 * @param ctx the parse tree
	 */
	enterRow?: (ctx: RowContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.row`.
	 * @param ctx the parse tree
	 */
	exitRow?: (ctx: RowContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.rowLabel`.
	 * @param ctx the parse tree
	 */
	enterRowLabel?: (ctx: RowLabelContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.rowLabel`.
	 * @param ctx the parse tree
	 */
	exitRowLabel?: (ctx: RowLabelContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.matchSumExpr`.
	 * @param ctx the parse tree
	 */
	enterMatchSumExpr?: (ctx: MatchSumExprContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.matchSumExpr`.
	 * @param ctx the parse tree
	 */
	exitMatchSumExpr?: (ctx: MatchSumExprContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.matchSumCase`.
	 * @param ctx the parse tree
	 */
	enterMatchSumCase?: (ctx: MatchSumCaseContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.matchSumCase`.
	 * @param ctx the parse tree
	 */
	exitMatchSumCase?: (ctx: MatchSumCaseContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.matchSumVariant`.
	 * @param ctx the parse tree
	 */
	enterMatchSumVariant?: (ctx: MatchSumVariantContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.matchSumVariant`.
	 * @param ctx the parse tree
	 */
	exitMatchSumVariant?: (ctx: MatchSumVariantContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.declarationOrExpr`.
	 * @param ctx the parse tree
	 */
	enterDeclarationOrExpr?: (ctx: DeclarationOrExprContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.declarationOrExpr`.
	 * @param ctx the parse tree
	 */
	exitDeclarationOrExpr?: (ctx: DeclarationOrExprContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.lambda`.
	 * @param ctx the parse tree
	 */
	enterLambda?: (ctx: LambdaContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.lambda`.
	 * @param ctx the parse tree
	 */
	exitLambda?: (ctx: LambdaContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.lambdaUnsugared`.
	 * @param ctx the parse tree
	 */
	enterLambdaUnsugared?: (ctx: LambdaUnsugaredContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.lambdaUnsugared`.
	 * @param ctx the parse tree
	 */
	exitLambdaUnsugared?: (ctx: LambdaUnsugaredContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.lambdaTupleSugar`.
	 * @param ctx the parse tree
	 */
	enterLambdaTupleSugar?: (ctx: LambdaTupleSugarContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.lambdaTupleSugar`.
	 * @param ctx the parse tree
	 */
	exitLambdaTupleSugar?: (ctx: LambdaTupleSugarContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.identOrHole`.
	 * @param ctx the parse tree
	 */
	enterIdentOrHole?: (ctx: IdentOrHoleContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.identOrHole`.
	 * @param ctx the parse tree
	 */
	exitIdentOrHole?: (ctx: IdentOrHoleContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.parameter`.
	 * @param ctx the parse tree
	 */
	enterParameter?: (ctx: ParameterContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.parameter`.
	 * @param ctx the parse tree
	 */
	exitParameter?: (ctx: ParameterContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.identOrStar`.
	 * @param ctx the parse tree
	 */
	enterIdentOrStar?: (ctx: IdentOrStarContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.identOrStar`.
	 * @param ctx the parse tree
	 */
	exitIdentOrStar?: (ctx: IdentOrStarContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.argList`.
	 * @param ctx the parse tree
	 */
	enterArgList?: (ctx: ArgListContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.argList`.
	 * @param ctx the parse tree
	 */
	exitArgList?: (ctx: ArgListContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.recElem`.
	 * @param ctx the parse tree
	 */
	enterRecElem?: (ctx: RecElemContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.recElem`.
	 * @param ctx the parse tree
	 */
	exitRecElem?: (ctx: RecElemContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.normalCallName`.
	 * @param ctx the parse tree
	 */
	enterNormalCallName?: (ctx: NormalCallNameContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.normalCallName`.
	 * @param ctx the parse tree
	 */
	exitNormalCallName?: (ctx: NormalCallNameContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.nameAfterDot`.
	 * @param ctx the parse tree
	 */
	enterNameAfterDot?: (ctx: NameAfterDotContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.nameAfterDot`.
	 * @param ctx the parse tree
	 */
	exitNameAfterDot?: (ctx: NameAfterDotContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.operator`.
	 * @param ctx the parse tree
	 */
	enterOperator?: (ctx: OperatorContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.operator`.
	 * @param ctx the parse tree
	 */
	exitOperator?: (ctx: OperatorContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.literal`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.literal`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.qualId`.
	 * @param ctx the parse tree
	 */
	enterQualId?: (ctx: QualIdContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.qualId`.
	 * @param ctx the parse tree
	 */
	exitQualId?: (ctx: QualIdContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.simpleId`.
	 * @param ctx the parse tree
	 */
	enterSimpleId?: (ctx: SimpleIdContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.simpleId`.
	 * @param ctx the parse tree
	 */
	exitSimpleId?: (ctx: SimpleIdContext) => void;

	/**
	 * Enter a parse tree produced by `QuintErrorsParser.empty`.
	 * @param ctx the parse tree
	 */
	enterEmpty?: (ctx: EmptyContext) => void;
	/**
	 * Exit a parse tree produced by `QuintErrorsParser.empty`.
	 * @param ctx the parse tree
	 */
	exitEmpty?: (ctx: EmptyContext) => void;
}

