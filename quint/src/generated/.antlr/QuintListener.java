// Generated from /Users/mahtab/Quint-Original/quint/quint/src/generated/Quint.g4 by ANTLR 4.13.1


// Used for forming errors
import { quintErrorToString } from '../quintError'


import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link QuintParser}.
 */
public interface QuintListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link QuintParser#modules}.
	 * @param ctx the parse tree
	 */
	void enterModules(QuintParser.ModulesContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#modules}.
	 * @param ctx the parse tree
	 */
	void exitModules(QuintParser.ModulesContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#module}.
	 * @param ctx the parse tree
	 */
	void enterModule(QuintParser.ModuleContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#module}.
	 * @param ctx the parse tree
	 */
	void exitModule(QuintParser.ModuleContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#documentedDeclaration}.
	 * @param ctx the parse tree
	 */
	void enterDocumentedDeclaration(QuintParser.DocumentedDeclarationContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#documentedDeclaration}.
	 * @param ctx the parse tree
	 */
	void exitDocumentedDeclaration(QuintParser.DocumentedDeclarationContext ctx);
	/**
	 * Enter a parse tree produced by the {@code const}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterConst(QuintParser.ConstContext ctx);
	/**
	 * Exit a parse tree produced by the {@code const}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitConst(QuintParser.ConstContext ctx);
	/**
	 * Enter a parse tree produced by the {@code var}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterVar(QuintParser.VarContext ctx);
	/**
	 * Exit a parse tree produced by the {@code var}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitVar(QuintParser.VarContext ctx);
	/**
	 * Enter a parse tree produced by the {@code assume}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterAssume(QuintParser.AssumeContext ctx);
	/**
	 * Exit a parse tree produced by the {@code assume}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitAssume(QuintParser.AssumeContext ctx);
	/**
	 * Enter a parse tree produced by the {@code instance}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterInstance(QuintParser.InstanceContext ctx);
	/**
	 * Exit a parse tree produced by the {@code instance}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitInstance(QuintParser.InstanceContext ctx);
	/**
	 * Enter a parse tree produced by the {@code oper}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterOper(QuintParser.OperContext ctx);
	/**
	 * Exit a parse tree produced by the {@code oper}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitOper(QuintParser.OperContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeDefs}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterTypeDefs(QuintParser.TypeDefsContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeDefs}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitTypeDefs(QuintParser.TypeDefsContext ctx);
	/**
	 * Enter a parse tree produced by the {@code importDef}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterImportDef(QuintParser.ImportDefContext ctx);
	/**
	 * Exit a parse tree produced by the {@code importDef}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitImportDef(QuintParser.ImportDefContext ctx);
	/**
	 * Enter a parse tree produced by the {@code exportDef}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void enterExportDef(QuintParser.ExportDefContext ctx);
	/**
	 * Exit a parse tree produced by the {@code exportDef}
	 * labeled alternative in {@link QuintParser#declaration}.
	 * @param ctx the parse tree
	 */
	void exitExportDef(QuintParser.ExportDefContext ctx);
	/**
	 * Enter a parse tree produced by the {@code annotatedOperDef}
	 * labeled alternative in {@link QuintParser#operDef}.
	 * @param ctx the parse tree
	 */
	void enterAnnotatedOperDef(QuintParser.AnnotatedOperDefContext ctx);
	/**
	 * Exit a parse tree produced by the {@code annotatedOperDef}
	 * labeled alternative in {@link QuintParser#operDef}.
	 * @param ctx the parse tree
	 */
	void exitAnnotatedOperDef(QuintParser.AnnotatedOperDefContext ctx);
	/**
	 * Enter a parse tree produced by the {@code deprecatedOperDef}
	 * labeled alternative in {@link QuintParser#operDef}.
	 * @param ctx the parse tree
	 */
	void enterDeprecatedOperDef(QuintParser.DeprecatedOperDefContext ctx);
	/**
	 * Exit a parse tree produced by the {@code deprecatedOperDef}
	 * labeled alternative in {@link QuintParser#operDef}.
	 * @param ctx the parse tree
	 */
	void exitDeprecatedOperDef(QuintParser.DeprecatedOperDefContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeAbstractDef}
	 * labeled alternative in {@link QuintParser#typeDef}.
	 * @param ctx the parse tree
	 */
	void enterTypeAbstractDef(QuintParser.TypeAbstractDefContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeAbstractDef}
	 * labeled alternative in {@link QuintParser#typeDef}.
	 * @param ctx the parse tree
	 */
	void exitTypeAbstractDef(QuintParser.TypeAbstractDefContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeAliasDef}
	 * labeled alternative in {@link QuintParser#typeDef}.
	 * @param ctx the parse tree
	 */
	void enterTypeAliasDef(QuintParser.TypeAliasDefContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeAliasDef}
	 * labeled alternative in {@link QuintParser#typeDef}.
	 * @param ctx the parse tree
	 */
	void exitTypeAliasDef(QuintParser.TypeAliasDefContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeSumDef}
	 * labeled alternative in {@link QuintParser#typeDef}.
	 * @param ctx the parse tree
	 */
	void enterTypeSumDef(QuintParser.TypeSumDefContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeSumDef}
	 * labeled alternative in {@link QuintParser#typeDef}.
	 * @param ctx the parse tree
	 */
	void exitTypeSumDef(QuintParser.TypeSumDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#typeDefHead}.
	 * @param ctx the parse tree
	 */
	void enterTypeDefHead(QuintParser.TypeDefHeadContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#typeDefHead}.
	 * @param ctx the parse tree
	 */
	void exitTypeDefHead(QuintParser.TypeDefHeadContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#sumTypeDefinition}.
	 * @param ctx the parse tree
	 */
	void enterSumTypeDefinition(QuintParser.SumTypeDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#sumTypeDefinition}.
	 * @param ctx the parse tree
	 */
	void exitSumTypeDefinition(QuintParser.SumTypeDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#typeSumVariant}.
	 * @param ctx the parse tree
	 */
	void enterTypeSumVariant(QuintParser.TypeSumVariantContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#typeSumVariant}.
	 * @param ctx the parse tree
	 */
	void exitTypeSumVariant(QuintParser.TypeSumVariantContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#qualifier}.
	 * @param ctx the parse tree
	 */
	void enterQualifier(QuintParser.QualifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#qualifier}.
	 * @param ctx the parse tree
	 */
	void exitQualifier(QuintParser.QualifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#importMod}.
	 * @param ctx the parse tree
	 */
	void enterImportMod(QuintParser.ImportModContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#importMod}.
	 * @param ctx the parse tree
	 */
	void exitImportMod(QuintParser.ImportModContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#exportMod}.
	 * @param ctx the parse tree
	 */
	void enterExportMod(QuintParser.ExportModContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#exportMod}.
	 * @param ctx the parse tree
	 */
	void exitExportMod(QuintParser.ExportModContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#instanceMod}.
	 * @param ctx the parse tree
	 */
	void enterInstanceMod(QuintParser.InstanceModContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#instanceMod}.
	 * @param ctx the parse tree
	 */
	void exitInstanceMod(QuintParser.InstanceModContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#moduleName}.
	 * @param ctx the parse tree
	 */
	void enterModuleName(QuintParser.ModuleNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#moduleName}.
	 * @param ctx the parse tree
	 */
	void exitModuleName(QuintParser.ModuleNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#name}.
	 * @param ctx the parse tree
	 */
	void enterName(QuintParser.NameContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#name}.
	 * @param ctx the parse tree
	 */
	void exitName(QuintParser.NameContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#qualifiedName}.
	 * @param ctx the parse tree
	 */
	void enterQualifiedName(QuintParser.QualifiedNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#qualifiedName}.
	 * @param ctx the parse tree
	 */
	void exitQualifiedName(QuintParser.QualifiedNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#fromSource}.
	 * @param ctx the parse tree
	 */
	void enterFromSource(QuintParser.FromSourceContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#fromSource}.
	 * @param ctx the parse tree
	 */
	void exitFromSource(QuintParser.FromSourceContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeConst}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeConst(QuintParser.TypeConstContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeConst}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeConst(QuintParser.TypeConstContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeApp}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeApp(QuintParser.TypeAppContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeApp}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeApp(QuintParser.TypeAppContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeFun}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeFun(QuintParser.TypeFunContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeFun}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeFun(QuintParser.TypeFunContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeOper}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeOper(QuintParser.TypeOperContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeOper}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeOper(QuintParser.TypeOperContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeParen}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeParen(QuintParser.TypeParenContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeParen}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeParen(QuintParser.TypeParenContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeBool}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeBool(QuintParser.TypeBoolContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeBool}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeBool(QuintParser.TypeBoolContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeSet}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeSet(QuintParser.TypeSetContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeSet}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeSet(QuintParser.TypeSetContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeUnit}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeUnit(QuintParser.TypeUnitContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeUnit}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeUnit(QuintParser.TypeUnitContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeRec}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeRec(QuintParser.TypeRecContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeRec}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeRec(QuintParser.TypeRecContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeStr}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeStr(QuintParser.TypeStrContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeStr}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeStr(QuintParser.TypeStrContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeInt}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeInt(QuintParser.TypeIntContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeInt}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeInt(QuintParser.TypeIntContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeList}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeList(QuintParser.TypeListContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeList}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeList(QuintParser.TypeListContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeTuple}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeTuple(QuintParser.TypeTupleContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeTuple}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeTuple(QuintParser.TypeTupleContext ctx);
	/**
	 * Enter a parse tree produced by the {@code typeVarCase}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void enterTypeVarCase(QuintParser.TypeVarCaseContext ctx);
	/**
	 * Exit a parse tree produced by the {@code typeVarCase}
	 * labeled alternative in {@link QuintParser#type}.
	 * @param ctx the parse tree
	 */
	void exitTypeVarCase(QuintParser.TypeVarCaseContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#typeVar}.
	 * @param ctx the parse tree
	 */
	void enterTypeVar(QuintParser.TypeVarContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#typeVar}.
	 * @param ctx the parse tree
	 */
	void exitTypeVar(QuintParser.TypeVarContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#row}.
	 * @param ctx the parse tree
	 */
	void enterRow(QuintParser.RowContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#row}.
	 * @param ctx the parse tree
	 */
	void exitRow(QuintParser.RowContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#rowLabel}.
	 * @param ctx the parse tree
	 */
	void enterRowLabel(QuintParser.RowLabelContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#rowLabel}.
	 * @param ctx the parse tree
	 */
	void exitRowLabel(QuintParser.RowLabelContext ctx);
	/**
	 * Enter a parse tree produced by the {@code letIn}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterLetIn(QuintParser.LetInContext ctx);
	/**
	 * Exit a parse tree produced by the {@code letIn}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitLetIn(QuintParser.LetInContext ctx);
	/**
	 * Enter a parse tree produced by the {@code uminus}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterUminus(QuintParser.UminusContext ctx);
	/**
	 * Exit a parse tree produced by the {@code uminus}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitUminus(QuintParser.UminusContext ctx);
	/**
	 * Enter a parse tree produced by the {@code operApp}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterOperApp(QuintParser.OperAppContext ctx);
	/**
	 * Exit a parse tree produced by the {@code operApp}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitOperApp(QuintParser.OperAppContext ctx);
	/**
	 * Enter a parse tree produced by the {@code actionAny}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterActionAny(QuintParser.ActionAnyContext ctx);
	/**
	 * Exit a parse tree produced by the {@code actionAny}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitActionAny(QuintParser.ActionAnyContext ctx);
	/**
	 * Enter a parse tree produced by the {@code errorEq}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterErrorEq(QuintParser.ErrorEqContext ctx);
	/**
	 * Exit a parse tree produced by the {@code errorEq}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitErrorEq(QuintParser.ErrorEqContext ctx);
	/**
	 * Enter a parse tree produced by the {@code braces}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterBraces(QuintParser.BracesContext ctx);
	/**
	 * Exit a parse tree produced by the {@code braces}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitBraces(QuintParser.BracesContext ctx);
	/**
	 * Enter a parse tree produced by the {@code lambdaCons}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterLambdaCons(QuintParser.LambdaConsContext ctx);
	/**
	 * Exit a parse tree produced by the {@code lambdaCons}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitLambdaCons(QuintParser.LambdaConsContext ctx);
	/**
	 * Enter a parse tree produced by the {@code tuple}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterTuple(QuintParser.TupleContext ctx);
	/**
	 * Exit a parse tree produced by the {@code tuple}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitTuple(QuintParser.TupleContext ctx);
	/**
	 * Enter a parse tree produced by the {@code paren}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterParen(QuintParser.ParenContext ctx);
	/**
	 * Exit a parse tree produced by the {@code paren}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitParen(QuintParser.ParenContext ctx);
	/**
	 * Enter a parse tree produced by the {@code multDiv}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterMultDiv(QuintParser.MultDivContext ctx);
	/**
	 * Exit a parse tree produced by the {@code multDiv}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitMultDiv(QuintParser.MultDivContext ctx);
	/**
	 * Enter a parse tree produced by the {@code and}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterAnd(QuintParser.AndContext ctx);
	/**
	 * Exit a parse tree produced by the {@code and}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitAnd(QuintParser.AndContext ctx);
	/**
	 * Enter a parse tree produced by the {@code record}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterRecord(QuintParser.RecordContext ctx);
	/**
	 * Exit a parse tree produced by the {@code record}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitRecord(QuintParser.RecordContext ctx);
	/**
	 * Enter a parse tree produced by the {@code pow}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterPow(QuintParser.PowContext ctx);
	/**
	 * Exit a parse tree produced by the {@code pow}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitPow(QuintParser.PowContext ctx);
	/**
	 * Enter a parse tree produced by the {@code actionAll}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterActionAll(QuintParser.ActionAllContext ctx);
	/**
	 * Exit a parse tree produced by the {@code actionAll}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitActionAll(QuintParser.ActionAllContext ctx);
	/**
	 * Enter a parse tree produced by the {@code dotCall}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterDotCall(QuintParser.DotCallContext ctx);
	/**
	 * Exit a parse tree produced by the {@code dotCall}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitDotCall(QuintParser.DotCallContext ctx);
	/**
	 * Enter a parse tree produced by the {@code ifElse}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterIfElse(QuintParser.IfElseContext ctx);
	/**
	 * Exit a parse tree produced by the {@code ifElse}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitIfElse(QuintParser.IfElseContext ctx);
	/**
	 * Enter a parse tree produced by the {@code plusMinus}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterPlusMinus(QuintParser.PlusMinusContext ctx);
	/**
	 * Exit a parse tree produced by the {@code plusMinus}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitPlusMinus(QuintParser.PlusMinusContext ctx);
	/**
	 * Enter a parse tree produced by the {@code or}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterOr(QuintParser.OrContext ctx);
	/**
	 * Exit a parse tree produced by the {@code or}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitOr(QuintParser.OrContext ctx);
	/**
	 * Enter a parse tree produced by the {@code match}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterMatch(QuintParser.MatchContext ctx);
	/**
	 * Exit a parse tree produced by the {@code match}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitMatch(QuintParser.MatchContext ctx);
	/**
	 * Enter a parse tree produced by the {@code iff}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterIff(QuintParser.IffContext ctx);
	/**
	 * Exit a parse tree produced by the {@code iff}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitIff(QuintParser.IffContext ctx);
	/**
	 * Enter a parse tree produced by the {@code orExpr}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterOrExpr(QuintParser.OrExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code orExpr}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitOrExpr(QuintParser.OrExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code list}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterList(QuintParser.ListContext ctx);
	/**
	 * Exit a parse tree produced by the {@code list}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitList(QuintParser.ListContext ctx);
	/**
	 * Enter a parse tree produced by the {@code pair}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterPair(QuintParser.PairContext ctx);
	/**
	 * Exit a parse tree produced by the {@code pair}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitPair(QuintParser.PairContext ctx);
	/**
	 * Enter a parse tree produced by the {@code unit}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterUnit(QuintParser.UnitContext ctx);
	/**
	 * Exit a parse tree produced by the {@code unit}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitUnit(QuintParser.UnitContext ctx);
	/**
	 * Enter a parse tree produced by the {@code asgn}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterAsgn(QuintParser.AsgnContext ctx);
	/**
	 * Exit a parse tree produced by the {@code asgn}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitAsgn(QuintParser.AsgnContext ctx);
	/**
	 * Enter a parse tree produced by the {@code literalOrId}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterLiteralOrId(QuintParser.LiteralOrIdContext ctx);
	/**
	 * Exit a parse tree produced by the {@code literalOrId}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitLiteralOrId(QuintParser.LiteralOrIdContext ctx);
	/**
	 * Enter a parse tree produced by the {@code listApp}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterListApp(QuintParser.ListAppContext ctx);
	/**
	 * Exit a parse tree produced by the {@code listApp}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitListApp(QuintParser.ListAppContext ctx);
	/**
	 * Enter a parse tree produced by the {@code relations}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterRelations(QuintParser.RelationsContext ctx);
	/**
	 * Exit a parse tree produced by the {@code relations}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitRelations(QuintParser.RelationsContext ctx);
	/**
	 * Enter a parse tree produced by the {@code implies}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterImplies(QuintParser.ImpliesContext ctx);
	/**
	 * Exit a parse tree produced by the {@code implies}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitImplies(QuintParser.ImpliesContext ctx);
	/**
	 * Enter a parse tree produced by the {@code andExpr}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterAndExpr(QuintParser.AndExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code andExpr}
	 * labeled alternative in {@link QuintParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitAndExpr(QuintParser.AndExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#matchSumExpr}.
	 * @param ctx the parse tree
	 */
	void enterMatchSumExpr(QuintParser.MatchSumExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#matchSumExpr}.
	 * @param ctx the parse tree
	 */
	void exitMatchSumExpr(QuintParser.MatchSumExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#matchSumCase}.
	 * @param ctx the parse tree
	 */
	void enterMatchSumCase(QuintParser.MatchSumCaseContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#matchSumCase}.
	 * @param ctx the parse tree
	 */
	void exitMatchSumCase(QuintParser.MatchSumCaseContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#matchSumVariant}.
	 * @param ctx the parse tree
	 */
	void enterMatchSumVariant(QuintParser.MatchSumVariantContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#matchSumVariant}.
	 * @param ctx the parse tree
	 */
	void exitMatchSumVariant(QuintParser.MatchSumVariantContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#declarationOrExpr}.
	 * @param ctx the parse tree
	 */
	void enterDeclarationOrExpr(QuintParser.DeclarationOrExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#declarationOrExpr}.
	 * @param ctx the parse tree
	 */
	void exitDeclarationOrExpr(QuintParser.DeclarationOrExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#lambda}.
	 * @param ctx the parse tree
	 */
	void enterLambda(QuintParser.LambdaContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#lambda}.
	 * @param ctx the parse tree
	 */
	void exitLambda(QuintParser.LambdaContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#lambdaUnsugared}.
	 * @param ctx the parse tree
	 */
	void enterLambdaUnsugared(QuintParser.LambdaUnsugaredContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#lambdaUnsugared}.
	 * @param ctx the parse tree
	 */
	void exitLambdaUnsugared(QuintParser.LambdaUnsugaredContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#lambdaTupleSugar}.
	 * @param ctx the parse tree
	 */
	void enterLambdaTupleSugar(QuintParser.LambdaTupleSugarContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#lambdaTupleSugar}.
	 * @param ctx the parse tree
	 */
	void exitLambdaTupleSugar(QuintParser.LambdaTupleSugarContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#identOrHole}.
	 * @param ctx the parse tree
	 */
	void enterIdentOrHole(QuintParser.IdentOrHoleContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#identOrHole}.
	 * @param ctx the parse tree
	 */
	void exitIdentOrHole(QuintParser.IdentOrHoleContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#parameter}.
	 * @param ctx the parse tree
	 */
	void enterParameter(QuintParser.ParameterContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#parameter}.
	 * @param ctx the parse tree
	 */
	void exitParameter(QuintParser.ParameterContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#annotatedParameter}.
	 * @param ctx the parse tree
	 */
	void enterAnnotatedParameter(QuintParser.AnnotatedParameterContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#annotatedParameter}.
	 * @param ctx the parse tree
	 */
	void exitAnnotatedParameter(QuintParser.AnnotatedParameterContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#identOrStar}.
	 * @param ctx the parse tree
	 */
	void enterIdentOrStar(QuintParser.IdentOrStarContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#identOrStar}.
	 * @param ctx the parse tree
	 */
	void exitIdentOrStar(QuintParser.IdentOrStarContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#argList}.
	 * @param ctx the parse tree
	 */
	void enterArgList(QuintParser.ArgListContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#argList}.
	 * @param ctx the parse tree
	 */
	void exitArgList(QuintParser.ArgListContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#recElem}.
	 * @param ctx the parse tree
	 */
	void enterRecElem(QuintParser.RecElemContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#recElem}.
	 * @param ctx the parse tree
	 */
	void exitRecElem(QuintParser.RecElemContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#normalCallName}.
	 * @param ctx the parse tree
	 */
	void enterNormalCallName(QuintParser.NormalCallNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#normalCallName}.
	 * @param ctx the parse tree
	 */
	void exitNormalCallName(QuintParser.NormalCallNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#nameAfterDot}.
	 * @param ctx the parse tree
	 */
	void enterNameAfterDot(QuintParser.NameAfterDotContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#nameAfterDot}.
	 * @param ctx the parse tree
	 */
	void exitNameAfterDot(QuintParser.NameAfterDotContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#operator}.
	 * @param ctx the parse tree
	 */
	void enterOperator(QuintParser.OperatorContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#operator}.
	 * @param ctx the parse tree
	 */
	void exitOperator(QuintParser.OperatorContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#literal}.
	 * @param ctx the parse tree
	 */
	void enterLiteral(QuintParser.LiteralContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#literal}.
	 * @param ctx the parse tree
	 */
	void exitLiteral(QuintParser.LiteralContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#qualId}.
	 * @param ctx the parse tree
	 */
	void enterQualId(QuintParser.QualIdContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#qualId}.
	 * @param ctx the parse tree
	 */
	void exitQualId(QuintParser.QualIdContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#simpleId}.
	 * @param ctx the parse tree
	 */
	void enterSimpleId(QuintParser.SimpleIdContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#simpleId}.
	 * @param ctx the parse tree
	 */
	void exitSimpleId(QuintParser.SimpleIdContext ctx);
	/**
	 * Enter a parse tree produced by {@link QuintParser#identifier}.
	 * @param ctx the parse tree
	 */
	void enterIdentifier(QuintParser.IdentifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link QuintParser#identifier}.
	 * @param ctx the parse tree
	 */
	void exitIdentifier(QuintParser.IdentifierContext ctx);
}