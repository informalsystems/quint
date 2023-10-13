// Generated from ./src/generated/QuintErrors.g4 by ANTLR 4.9.0-SNAPSHOT



// Used for forming errors
import { quintErrorToString } from '../quintError'



import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { QuintErrorsListener } from "./QuintErrorsListener";

export class QuintErrorsParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly T__21 = 22;
	public static readonly T__22 = 23;
	public static readonly T__23 = 24;
	public static readonly T__24 = 25;
	public static readonly T__25 = 26;
	public static readonly T__26 = 27;
	public static readonly T__27 = 28;
	public static readonly T__28 = 29;
	public static readonly T__29 = 30;
	public static readonly T__30 = 31;
	public static readonly T__31 = 32;
	public static readonly T__32 = 33;
	public static readonly T__33 = 34;
	public static readonly T__34 = 35;
	public static readonly T__35 = 36;
	public static readonly T__36 = 37;
	public static readonly T__37 = 38;
	public static readonly T__38 = 39;
	public static readonly STRING = 40;
	public static readonly BOOL = 41;
	public static readonly INT = 42;
	public static readonly AND = 43;
	public static readonly OR = 44;
	public static readonly IFF = 45;
	public static readonly IMPLIES = 46;
	public static readonly SET = 47;
	public static readonly LIST = 48;
	public static readonly MAP = 49;
	public static readonly MATCH = 50;
	public static readonly PLUS = 51;
	public static readonly MINUS = 52;
	public static readonly MUL = 53;
	public static readonly DIV = 54;
	public static readonly MOD = 55;
	public static readonly GT = 56;
	public static readonly LT = 57;
	public static readonly GE = 58;
	public static readonly LE = 59;
	public static readonly NE = 60;
	public static readonly EQ = 61;
	public static readonly ASGN = 62;
	public static readonly LPAREN = 63;
	public static readonly RPAREN = 64;
	public static readonly IDENTIFIER = 65;
	public static readonly DOCCOMMENT = 66;
	public static readonly LINE_COMMENT = 67;
	public static readonly COMMENT = 68;
	public static readonly WS = 69;
	public static readonly RULE_modules = 0;
	public static readonly RULE_module = 1;
	public static readonly RULE_declaration = 2;
	public static readonly RULE_constDef = 3;
	public static readonly RULE_operDef = 4;
	public static readonly RULE_typeDef = 5;
	public static readonly RULE_typeSumVariant = 6;
	public static readonly RULE_nondetOperDef = 7;
	public static readonly RULE_qualifier = 8;
	public static readonly RULE_importMod = 9;
	public static readonly RULE_exportMod = 10;
	public static readonly RULE_instanceMod = 11;
	public static readonly RULE_moduleName = 12;
	public static readonly RULE_name = 13;
	public static readonly RULE_qualifiedName = 14;
	public static readonly RULE_fromSource = 15;
	public static readonly RULE_type = 16;
	public static readonly RULE_typeUnionRecOne = 17;
	public static readonly RULE_row = 18;
	public static readonly RULE_rowLabel = 19;
	public static readonly RULE_expr = 20;
	public static readonly RULE_matchSumExpr = 21;
	public static readonly RULE_matchSumCase = 22;
	public static readonly RULE_matchSumVariant = 23;
	public static readonly RULE_declarationOrExpr = 24;
	public static readonly RULE_lambda = 25;
	public static readonly RULE_lambdaUnsugared = 26;
	public static readonly RULE_lambdaTupleSugar = 27;
	public static readonly RULE_identOrHole = 28;
	public static readonly RULE_parameter = 29;
	public static readonly RULE_identOrStar = 30;
	public static readonly RULE_argList = 31;
	public static readonly RULE_recElem = 32;
	public static readonly RULE_normalCallName = 33;
	public static readonly RULE_nameAfterDot = 34;
	public static readonly RULE_operator = 35;
	public static readonly RULE_literal = 36;
	public static readonly RULE_qualId = 37;
	public static readonly RULE_simpleId = 38;
	public static readonly RULE_empty = 39;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"modules", "module", "declaration", "constDef", "operDef", "typeDef", 
		"typeSumVariant", "nondetOperDef", "qualifier", "importMod", "exportMod", 
		"instanceMod", "moduleName", "name", "qualifiedName", "fromSource", "type", 
		"typeUnionRecOne", "row", "rowLabel", "expr", "matchSumExpr", "matchSumCase", 
		"matchSumVariant", "declarationOrExpr", "lambda", "lambdaUnsugared", "lambdaTupleSugar", 
		"identOrHole", "parameter", "identOrStar", "argList", "recElem", "normalCallName", 
		"nameAfterDot", "operator", "literal", "qualId", "simpleId", "empty",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'module'", "'{'", "'}'", "'const'", "'var'", "':'", "'assume'", 
		"','", "';'", "'type'", "'|'", "'nondet'", "'val'", "'def'", "'pure'", 
		"'action'", "'run'", "'temporal'", "'import'", "'.'", "'from'", "'as'", 
		"'export'", "'->'", "'=>'", "'['", "']'", "'int'", "'str'", "'bool'", 
		"'^'", "'''", "'all'", "'any'", "'if'", "'else'", "'_'", "'...'", "'::'", 
		undefined, undefined, undefined, "'and'", "'or'", "'iff'", "'implies'", 
		"'Set'", "'List'", "'Map'", "'match'", "'+'", "'-'", "'*'", "'/'", "'%'", 
		"'>'", "'<'", "'>='", "'<='", "'!='", "'=='", "'='", "'('", "')'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, "STRING", "BOOL", 
		"INT", "AND", "OR", "IFF", "IMPLIES", "SET", "LIST", "MAP", "MATCH", "PLUS", 
		"MINUS", "MUL", "DIV", "MOD", "GT", "LT", "GE", "LE", "NE", "EQ", "ASGN", 
		"LPAREN", "RPAREN", "IDENTIFIER", "DOCCOMMENT", "LINE_COMMENT", "COMMENT", 
		"WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(QuintErrorsParser._LITERAL_NAMES, QuintErrorsParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return QuintErrorsParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "QuintErrors.g4"; }

	// @Override
	public get ruleNames(): string[] { return QuintErrorsParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return QuintErrorsParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(QuintErrorsParser._ATN, this);
	}
	// @RuleVersion(0)
	public modules(): ModulesContext {
		let _localctx: ModulesContext = new ModulesContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, QuintErrorsParser.RULE_modules);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 81;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 80;
				this.module();
				}
				}
				this.state = 83;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === QuintErrorsParser.T__0 || _la === QuintErrorsParser.DOCCOMMENT);
			this.state = 85;
			this.match(QuintErrorsParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public module(): ModuleContext {
		let _localctx: ModuleContext = new ModuleContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, QuintErrorsParser.RULE_module);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 90;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === QuintErrorsParser.DOCCOMMENT) {
				{
				{
				this.state = 87;
				this.match(QuintErrorsParser.DOCCOMMENT);
				}
				}
				this.state = 92;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 93;
			this.match(QuintErrorsParser.T__0);
			this.state = 94;
			this.qualId();
			this.state = 95;
			this.match(QuintErrorsParser.T__1);
			this.state = 105;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 99;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 96;
							this.match(QuintErrorsParser.DOCCOMMENT);
							}
							}
						}
						this.state = 101;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
					}
					this.state = 102;
					this.declaration();
					}
					}
				}
				this.state = 107;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
			}
			this.state = 108;
			this.match(QuintErrorsParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let _localctx: DeclarationContext = new DeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, QuintErrorsParser.RULE_declaration);
		try {
			this.state = 129;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 110;
				this.match(QuintErrorsParser.T__3);
				this.state = 111;
				this.constDef();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 112;
				this.match(QuintErrorsParser.T__4);
				this.state = 113;
				this.qualId();
				this.state = 114;
				this.match(QuintErrorsParser.T__5);
				this.state = 115;
				this.type(0);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 117;
				this.match(QuintErrorsParser.T__6);
				this.state = 118;
				this.identOrHole();
				this.state = 119;
				this.match(QuintErrorsParser.ASGN);
				this.state = 120;
				this.expr(0);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 122;
				this.instanceMod();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 123;
				this.operDef();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 124;
				this.typeDef();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 125;
				this.importMod();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 126;
				this.exportMod();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 127;
				this.matchWildcard();

				                const m = "[QNT000] expected one of definition, const, var, import/export, assume"
				                this.notifyErrorListeners(m)
				              
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constDef(): ConstDefContext {
		let _localctx: ConstDefContext = new ConstDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, QuintErrorsParser.RULE_constDef);
		try {
			this.state = 137;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 131;
				this.qualId();
				this.state = 132;
				this.match(QuintErrorsParser.T__5);
				this.state = 133;
				this.type(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 135;
				this.matchWildcard();

				                const m = "[QNT015] expected a constant definition"
				                this.notifyErrorListeners(m)
				         
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public operDef(): OperDefContext {
		let _localctx: OperDefContext = new OperDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, QuintErrorsParser.RULE_operDef);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 139;
			this.qualifier();
			this.state = 140;
			this.normalCallName();
			this.state = 177;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				{
				this.state = 141;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 150;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__36 || _la === QuintErrorsParser.IDENTIFIER) {
					{
					this.state = 142;
					this.parameter();
					this.state = 147;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la === QuintErrorsParser.T__7) {
						{
						{
						this.state = 143;
						this.match(QuintErrorsParser.T__7);
						this.state = 144;
						this.parameter();
						}
						}
						this.state = 149;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					}
				}

				this.state = 152;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 155;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
				case 1:
					{
					this.state = 153;
					this.match(QuintErrorsParser.T__5);
					this.state = 154;
					this.type(0);
					}
					break;
				}
				}
				break;

			case 2:
				{
				this.state = 157;
				this.match(QuintErrorsParser.T__5);
				this.state = 158;
				this.type(0);
				}
				break;

			case 3:
				{
				this.state = 159;
				this.match(QuintErrorsParser.LPAREN);
				{
				this.state = 160;
				this.parameter();
				this.state = 161;
				this.match(QuintErrorsParser.T__5);
				this.state = 162;
				this.type(0);
				this.state = 170;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__7) {
					{
					{
					this.state = 163;
					this.match(QuintErrorsParser.T__7);
					this.state = 164;
					this.parameter();
					this.state = 165;
					this.match(QuintErrorsParser.T__5);
					this.state = 166;
					this.type(0);
					}
					}
					this.state = 172;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				this.state = 173;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 174;
				this.match(QuintErrorsParser.T__5);
				this.state = 175;
				this.type(0);
				}
				break;
			}
			this.state = 181;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				{
				this.state = 179;
				this.match(QuintErrorsParser.ASGN);
				this.state = 180;
				this.expr(0);
				}
				break;
			}
			this.state = 184;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				{
				this.state = 183;
				this.match(QuintErrorsParser.T__8);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeDef(): TypeDefContext {
		let _localctx: TypeDefContext = new TypeDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, QuintErrorsParser.RULE_typeDef);
		let _la: number;
		try {
			let _alt: number;
			this.state = 207;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				_localctx = new TypeAbstractDefContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 186;
				this.match(QuintErrorsParser.T__9);
				this.state = 187;
				this.qualId();
				}
				break;

			case 2:
				_localctx = new TypeAliasDefContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 188;
				this.match(QuintErrorsParser.T__9);
				this.state = 189;
				this.qualId();
				this.state = 190;
				this.match(QuintErrorsParser.ASGN);
				this.state = 191;
				this.type(0);
				}
				break;

			case 3:
				_localctx = new TypeSumDefContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 193;
				this.match(QuintErrorsParser.T__9);
				this.state = 194;
				(_localctx as TypeSumDefContext)._typeName = this.qualId();
				this.state = 195;
				this.match(QuintErrorsParser.ASGN);
				this.state = 197;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__10) {
					{
					this.state = 196;
					this.match(QuintErrorsParser.T__10);
					}
				}

				this.state = 199;
				this.typeSumVariant();
				this.state = 204;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 14, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 200;
						this.match(QuintErrorsParser.T__10);
						this.state = 201;
						this.typeSumVariant();
						}
						}
					}
					this.state = 206;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 14, this._ctx);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeSumVariant(): TypeSumVariantContext {
		let _localctx: TypeSumVariantContext = new TypeSumVariantContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, QuintErrorsParser.RULE_typeSumVariant);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 209;
			_localctx._sumLabel = this.simpleId("variant label");
			this.state = 214;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 16, this._ctx) ) {
			case 1:
				{
				this.state = 210;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 211;
				this.type(0);
				this.state = 212;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nondetOperDef(): NondetOperDefContext {
		let _localctx: NondetOperDefContext = new NondetOperDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, QuintErrorsParser.RULE_nondetOperDef);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 216;
			this.match(QuintErrorsParser.T__11);
			this.state = 217;
			this.qualId();
			this.state = 220;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__5) {
				{
				this.state = 218;
				this.match(QuintErrorsParser.T__5);
				this.state = 219;
				this.type(0);
				}
			}

			this.state = 222;
			this.match(QuintErrorsParser.ASGN);
			this.state = 223;
			this.expr(0);
			this.state = 225;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__8) {
				{
				this.state = 224;
				this.match(QuintErrorsParser.T__8);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public qualifier(): QualifierContext {
		let _localctx: QualifierContext = new QualifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, QuintErrorsParser.RULE_qualifier);
		try {
			this.state = 236;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 19, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 227;
				this.match(QuintErrorsParser.T__12);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 228;
				this.match(QuintErrorsParser.T__13);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 229;
				this.match(QuintErrorsParser.T__14);
				this.state = 230;
				this.match(QuintErrorsParser.T__12);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 231;
				this.match(QuintErrorsParser.T__14);
				this.state = 232;
				this.match(QuintErrorsParser.T__13);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 233;
				this.match(QuintErrorsParser.T__15);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 234;
				this.match(QuintErrorsParser.T__16);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 235;
				this.match(QuintErrorsParser.T__17);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public importMod(): ImportModContext {
		let _localctx: ImportModContext = new ImportModContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, QuintErrorsParser.RULE_importMod);
		try {
			this.state = 256;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 23, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 238;
				this.match(QuintErrorsParser.T__18);
				this.state = 239;
				this.name();
				this.state = 240;
				this.match(QuintErrorsParser.T__19);
				this.state = 241;
				this.identOrStar();
				this.state = 244;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 20, this._ctx) ) {
				case 1:
					{
					this.state = 242;
					this.match(QuintErrorsParser.T__20);
					this.state = 243;
					this.fromSource();
					}
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 246;
				this.match(QuintErrorsParser.T__18);
				this.state = 247;
				this.name();
				this.state = 250;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 21, this._ctx) ) {
				case 1:
					{
					this.state = 248;
					this.match(QuintErrorsParser.T__21);
					this.state = 249;
					this.name();
					}
					break;
				}
				this.state = 254;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 22, this._ctx) ) {
				case 1:
					{
					this.state = 252;
					this.match(QuintErrorsParser.T__20);
					this.state = 253;
					this.fromSource();
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exportMod(): ExportModContext {
		let _localctx: ExportModContext = new ExportModContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, QuintErrorsParser.RULE_exportMod);
		try {
			this.state = 269;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 258;
				this.match(QuintErrorsParser.T__22);
				this.state = 259;
				this.name();
				this.state = 260;
				this.match(QuintErrorsParser.T__19);
				this.state = 261;
				this.identOrStar();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 263;
				this.match(QuintErrorsParser.T__22);
				this.state = 264;
				this.name();
				this.state = 267;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 24, this._ctx) ) {
				case 1:
					{
					this.state = 265;
					this.match(QuintErrorsParser.T__21);
					this.state = 266;
					this.name();
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public instanceMod(): InstanceModContext {
		let _localctx: InstanceModContext = new InstanceModContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, QuintErrorsParser.RULE_instanceMod);
		let _la: number;
		try {
			this.state = 317;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 30, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 271;
				this.match(QuintErrorsParser.T__18);
				this.state = 272;
				this.moduleName();
				this.state = 273;
				this.match(QuintErrorsParser.LPAREN);
				{
				this.state = 274;
				this.name();
				this.state = 275;
				this.match(QuintErrorsParser.ASGN);
				this.state = 276;
				this.expr(0);
				this.state = 284;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__7) {
					{
					{
					this.state = 277;
					this.match(QuintErrorsParser.T__7);
					this.state = 278;
					this.name();
					this.state = 279;
					this.match(QuintErrorsParser.ASGN);
					this.state = 280;
					this.expr(0);
					}
					}
					this.state = 286;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				this.state = 287;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 288;
				this.match(QuintErrorsParser.T__19);
				this.state = 289;
				this.match(QuintErrorsParser.MUL);
				this.state = 292;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
				case 1:
					{
					this.state = 290;
					this.match(QuintErrorsParser.T__20);
					this.state = 291;
					this.fromSource();
					}
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 294;
				this.match(QuintErrorsParser.T__18);
				this.state = 295;
				this.moduleName();
				this.state = 296;
				this.match(QuintErrorsParser.LPAREN);
				{
				this.state = 297;
				this.name();
				this.state = 298;
				this.match(QuintErrorsParser.ASGN);
				this.state = 299;
				this.expr(0);
				this.state = 307;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__7) {
					{
					{
					this.state = 300;
					this.match(QuintErrorsParser.T__7);
					this.state = 301;
					this.name();
					this.state = 302;
					this.match(QuintErrorsParser.ASGN);
					this.state = 303;
					this.expr(0);
					}
					}
					this.state = 309;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				this.state = 310;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 311;
				this.match(QuintErrorsParser.T__21);
				this.state = 312;
				this.qualifiedName();
				this.state = 315;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 29, this._ctx) ) {
				case 1:
					{
					this.state = 313;
					this.match(QuintErrorsParser.T__20);
					this.state = 314;
					this.fromSource();
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public moduleName(): ModuleNameContext {
		let _localctx: ModuleNameContext = new ModuleNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, QuintErrorsParser.RULE_moduleName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 319;
			this.qualId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public name(): NameContext {
		let _localctx: NameContext = new NameContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, QuintErrorsParser.RULE_name);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 321;
			this.qualId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public qualifiedName(): QualifiedNameContext {
		let _localctx: QualifiedNameContext = new QualifiedNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, QuintErrorsParser.RULE_qualifiedName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 323;
			this.qualId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public fromSource(): FromSourceContext {
		let _localctx: FromSourceContext = new FromSourceContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, QuintErrorsParser.RULE_fromSource);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 325;
			this.match(QuintErrorsParser.STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public type(): TypeContext;
	public type(_p: number): TypeContext;
	// @RuleVersion(0)
	public type(_p?: number): TypeContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: TypeContext = new TypeContext(this._ctx, _parentState);
		let _prevctx: TypeContext = _localctx;
		let _startState: number = 32;
		this.enterRecursionRule(_localctx, 32, QuintErrorsParser.RULE_type, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 388;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 37, this._ctx) ) {
			case 1:
				{
				_localctx = new TypeOperContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 328;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 337;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QuintErrorsParser.T__1) | (1 << QuintErrorsParser.T__10) | (1 << QuintErrorsParser.T__27) | (1 << QuintErrorsParser.T__28) | (1 << QuintErrorsParser.T__29))) !== 0) || ((((_la - 47)) & ~0x1F) === 0 && ((1 << (_la - 47)) & ((1 << (QuintErrorsParser.SET - 47)) | (1 << (QuintErrorsParser.LIST - 47)) | (1 << (QuintErrorsParser.LPAREN - 47)) | (1 << (QuintErrorsParser.IDENTIFIER - 47)))) !== 0)) {
					{
					this.state = 329;
					this.type(0);
					this.state = 334;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 31, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 330;
							this.match(QuintErrorsParser.T__7);
							this.state = 331;
							this.type(0);
							}
							}
						}
						this.state = 336;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 31, this._ctx);
					}
					}
				}

				this.state = 340;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 339;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 342;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 343;
				this.match(QuintErrorsParser.T__24);
				this.state = 344;
				this.type(11);
				}
				break;

			case 2:
				{
				_localctx = new TypeSetContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 345;
				this.match(QuintErrorsParser.SET);
				this.state = 346;
				this.match(QuintErrorsParser.T__25);
				this.state = 347;
				this.type(0);
				this.state = 348;
				this.match(QuintErrorsParser.T__26);
				}
				break;

			case 3:
				{
				_localctx = new TypeListContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 350;
				this.match(QuintErrorsParser.LIST);
				this.state = 351;
				this.match(QuintErrorsParser.T__25);
				this.state = 352;
				this.type(0);
				this.state = 353;
				this.match(QuintErrorsParser.T__26);
				}
				break;

			case 4:
				{
				_localctx = new TypeTupleContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 355;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 356;
				this.type(0);
				this.state = 357;
				this.match(QuintErrorsParser.T__7);
				this.state = 358;
				this.type(0);
				this.state = 363;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 34, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 359;
						this.match(QuintErrorsParser.T__7);
						this.state = 360;
						this.type(0);
						}
						}
					}
					this.state = 365;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 34, this._ctx);
				}
				this.state = 367;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 366;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 369;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 5:
				{
				_localctx = new TypeRecContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 371;
				this.match(QuintErrorsParser.T__1);
				this.state = 372;
				this.row();
				this.state = 373;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 6:
				{
				_localctx = new TypeUnionRecContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 376;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 375;
						this.typeUnionRecOne();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 378;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 36, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;

			case 7:
				{
				_localctx = new TypeIntContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 380;
				this.match(QuintErrorsParser.T__27);
				}
				break;

			case 8:
				{
				_localctx = new TypeStrContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 381;
				this.match(QuintErrorsParser.T__28);
				}
				break;

			case 9:
				{
				_localctx = new TypeBoolContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 382;
				this.match(QuintErrorsParser.T__29);
				}
				break;

			case 10:
				{
				_localctx = new TypeConstOrVarContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 383;
				this.qualId();
				}
				break;

			case 11:
				{
				_localctx = new TypeParenContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 384;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 385;
				this.type(0);
				this.state = 386;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 398;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 39, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 396;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 38, this._ctx) ) {
					case 1:
						{
						_localctx = new TypeFunContext(new TypeContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_type);
						this.state = 390;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 391;
						this.match(QuintErrorsParser.T__23);
						this.state = 392;
						this.type(13);
						}
						break;

					case 2:
						{
						_localctx = new TypeOperContext(new TypeContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_type);
						this.state = 393;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 394;
						this.match(QuintErrorsParser.T__24);
						this.state = 395;
						this.type(12);
						}
						break;
					}
					}
				}
				this.state = 400;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 39, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeUnionRecOne(): TypeUnionRecOneContext {
		let _localctx: TypeUnionRecOneContext = new TypeUnionRecOneContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, QuintErrorsParser.RULE_typeUnionRecOne);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 401;
			this.match(QuintErrorsParser.T__10);
			this.state = 402;
			this.match(QuintErrorsParser.T__1);
			this.state = 403;
			this.qualId();
			this.state = 404;
			this.match(QuintErrorsParser.T__5);
			this.state = 405;
			this.match(QuintErrorsParser.STRING);
			this.state = 408;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 40, this._ctx) ) {
			case 1:
				{
				this.state = 406;
				this.match(QuintErrorsParser.T__7);
				this.state = 407;
				this.row();
				}
				break;
			}
			this.state = 411;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__7) {
				{
				this.state = 410;
				this.match(QuintErrorsParser.T__7);
				}
			}

			this.state = 413;
			this.match(QuintErrorsParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public row(): RowContext {
		let _localctx: RowContext = new RowContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, QuintErrorsParser.RULE_row);
		let _la: number;
		try {
			let _alt: number;
			this.state = 438;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.T__2:
			case QuintErrorsParser.T__7:
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 422;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 42, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 415;
						this.rowLabel();
						this.state = 416;
						this.match(QuintErrorsParser.T__5);
						this.state = 417;
						this.type(0);
						this.state = 418;
						this.match(QuintErrorsParser.T__7);
						}
						}
					}
					this.state = 424;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 42, this._ctx);
				}
				this.state = 434;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.IDENTIFIER) {
					{
					{
					this.state = 425;
					this.rowLabel();
					this.state = 426;
					this.match(QuintErrorsParser.T__5);
					this.state = 427;
					this.type(0);
					}
					this.state = 432;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 43, this._ctx) ) {
					case 1:
						{
						this.state = 429;
						this.match(QuintErrorsParser.T__7);
						}
						break;

					case 2:
						{
						this.state = 430;
						this.match(QuintErrorsParser.T__10);
						{
						this.state = 431;
						_localctx._rowVar = this.match(QuintErrorsParser.IDENTIFIER);
						}
						}
						break;
					}
					}
				}

				}
				break;
			case QuintErrorsParser.T__10:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 436;
				this.match(QuintErrorsParser.T__10);
				{
				this.state = 437;
				_localctx._rowVar = this.match(QuintErrorsParser.IDENTIFIER);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public rowLabel(): RowLabelContext {
		let _localctx: RowLabelContext = new RowLabelContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, QuintErrorsParser.RULE_rowLabel);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 440;
			this.simpleId("record");
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expr(): ExprContext;
	public expr(_p: number): ExprContext;
	// @RuleVersion(0)
	public expr(_p?: number): ExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExprContext = new ExprContext(this._ctx, _parentState);
		let _prevctx: ExprContext = _localctx;
		let _startState: number = 40;
		this.enterRecursionRule(_localctx, 40, QuintErrorsParser.RULE_expr, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 592;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 63, this._ctx) ) {
			case 1:
				{
				_localctx = new LambdaConsContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 443;
				this.lambda();
				}
				break;

			case 2:
				{
				_localctx = new OperAppContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 444;
				this.normalCallName();
				this.state = 445;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 447;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 2)) & ~0x1F) === 0 && ((1 << (_la - 2)) & ((1 << (QuintErrorsParser.T__1 - 2)) | (1 << (QuintErrorsParser.T__11 - 2)) | (1 << (QuintErrorsParser.T__12 - 2)) | (1 << (QuintErrorsParser.T__13 - 2)) | (1 << (QuintErrorsParser.T__14 - 2)) | (1 << (QuintErrorsParser.T__15 - 2)) | (1 << (QuintErrorsParser.T__16 - 2)) | (1 << (QuintErrorsParser.T__17 - 2)) | (1 << (QuintErrorsParser.T__25 - 2)) | (1 << (QuintErrorsParser.T__32 - 2)))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (QuintErrorsParser.T__33 - 34)) | (1 << (QuintErrorsParser.T__34 - 34)) | (1 << (QuintErrorsParser.T__36 - 34)) | (1 << (QuintErrorsParser.STRING - 34)) | (1 << (QuintErrorsParser.BOOL - 34)) | (1 << (QuintErrorsParser.INT - 34)) | (1 << (QuintErrorsParser.AND - 34)) | (1 << (QuintErrorsParser.OR - 34)) | (1 << (QuintErrorsParser.IFF - 34)) | (1 << (QuintErrorsParser.IMPLIES - 34)) | (1 << (QuintErrorsParser.SET - 34)) | (1 << (QuintErrorsParser.LIST - 34)) | (1 << (QuintErrorsParser.MAP - 34)) | (1 << (QuintErrorsParser.MATCH - 34)) | (1 << (QuintErrorsParser.MINUS - 34)) | (1 << (QuintErrorsParser.LPAREN - 34)) | (1 << (QuintErrorsParser.IDENTIFIER - 34)))) !== 0)) {
					{
					this.state = 446;
					this.argList();
					}
				}

				this.state = 449;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 3:
				{
				_localctx = new UminusContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 451;
				this.match(QuintErrorsParser.MINUS);
				this.state = 452;
				this.expr(25);
				}
				break;

			case 4:
				{
				_localctx = new AsgnContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 453;
				this.qualId();
				this.state = 454;
				this.match(QuintErrorsParser.T__31);
				this.state = 455;
				this.match(QuintErrorsParser.ASGN);
				this.state = 456;
				this.expr(21);
				}
				break;

			case 5:
				{
				_localctx = new AndExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 458;
				this.match(QuintErrorsParser.AND);
				this.state = 459;
				this.match(QuintErrorsParser.T__1);
				this.state = 460;
				this.expr(0);
				this.state = 465;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 47, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 461;
						this.match(QuintErrorsParser.T__7);
						this.state = 462;
						this.expr(0);
						}
						}
					}
					this.state = 467;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 47, this._ctx);
				}
				this.state = 469;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 468;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 471;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 6:
				{
				_localctx = new OrExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 473;
				this.match(QuintErrorsParser.OR);
				this.state = 474;
				this.match(QuintErrorsParser.T__1);
				this.state = 475;
				this.expr(0);
				this.state = 480;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 49, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 476;
						this.match(QuintErrorsParser.T__7);
						this.state = 477;
						this.expr(0);
						}
						}
					}
					this.state = 482;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 49, this._ctx);
				}
				this.state = 484;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 483;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 486;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 7:
				{
				_localctx = new MatchContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 488;
				this.matchSumExpr();
				}
				break;

			case 8:
				{
				_localctx = new ActionAllContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 489;
				this.match(QuintErrorsParser.T__32);
				this.state = 490;
				this.match(QuintErrorsParser.T__1);
				this.state = 491;
				this.expr(0);
				this.state = 496;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 51, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 492;
						this.match(QuintErrorsParser.T__7);
						this.state = 493;
						this.expr(0);
						}
						}
					}
					this.state = 498;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 51, this._ctx);
				}
				this.state = 500;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 499;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 502;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 9:
				{
				_localctx = new ActionAnyContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 504;
				this.match(QuintErrorsParser.T__33);
				this.state = 505;
				this.match(QuintErrorsParser.T__1);
				this.state = 506;
				this.expr(0);
				this.state = 511;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 53, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 507;
						this.match(QuintErrorsParser.T__7);
						this.state = 508;
						this.expr(0);
						}
						}
					}
					this.state = 513;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 53, this._ctx);
				}
				this.state = 515;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 514;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 517;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 10:
				{
				_localctx = new LiteralOrIdContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 523;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case QuintErrorsParser.IDENTIFIER:
					{
					this.state = 519;
					this.qualId();
					}
					break;
				case QuintErrorsParser.INT:
					{
					this.state = 520;
					this.match(QuintErrorsParser.INT);
					}
					break;
				case QuintErrorsParser.BOOL:
					{
					this.state = 521;
					this.match(QuintErrorsParser.BOOL);
					}
					break;
				case QuintErrorsParser.STRING:
					{
					this.state = 522;
					this.match(QuintErrorsParser.STRING);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;

			case 11:
				{
				_localctx = new TupleContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 525;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 526;
				this.expr(0);
				this.state = 527;
				this.match(QuintErrorsParser.T__7);
				this.state = 528;
				this.expr(0);
				this.state = 533;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 56, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 529;
						this.match(QuintErrorsParser.T__7);
						this.state = 530;
						this.expr(0);
						}
						}
					}
					this.state = 535;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 56, this._ctx);
				}
				this.state = 537;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 536;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 539;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 12:
				{
				_localctx = new RecordContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 541;
				this.match(QuintErrorsParser.T__1);
				this.state = 542;
				this.recElem();
				this.state = 547;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 58, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 543;
						this.match(QuintErrorsParser.T__7);
						this.state = 544;
						this.recElem();
						}
						}
					}
					this.state = 549;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 58, this._ctx);
				}
				this.state = 551;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 550;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 553;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 13:
				{
				_localctx = new ListContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 555;
				this.match(QuintErrorsParser.T__25);
				this.state = 564;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 2)) & ~0x1F) === 0 && ((1 << (_la - 2)) & ((1 << (QuintErrorsParser.T__1 - 2)) | (1 << (QuintErrorsParser.T__11 - 2)) | (1 << (QuintErrorsParser.T__12 - 2)) | (1 << (QuintErrorsParser.T__13 - 2)) | (1 << (QuintErrorsParser.T__14 - 2)) | (1 << (QuintErrorsParser.T__15 - 2)) | (1 << (QuintErrorsParser.T__16 - 2)) | (1 << (QuintErrorsParser.T__17 - 2)) | (1 << (QuintErrorsParser.T__25 - 2)) | (1 << (QuintErrorsParser.T__32 - 2)))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (QuintErrorsParser.T__33 - 34)) | (1 << (QuintErrorsParser.T__34 - 34)) | (1 << (QuintErrorsParser.T__36 - 34)) | (1 << (QuintErrorsParser.STRING - 34)) | (1 << (QuintErrorsParser.BOOL - 34)) | (1 << (QuintErrorsParser.INT - 34)) | (1 << (QuintErrorsParser.AND - 34)) | (1 << (QuintErrorsParser.OR - 34)) | (1 << (QuintErrorsParser.IFF - 34)) | (1 << (QuintErrorsParser.IMPLIES - 34)) | (1 << (QuintErrorsParser.SET - 34)) | (1 << (QuintErrorsParser.LIST - 34)) | (1 << (QuintErrorsParser.MAP - 34)) | (1 << (QuintErrorsParser.MATCH - 34)) | (1 << (QuintErrorsParser.MINUS - 34)) | (1 << (QuintErrorsParser.LPAREN - 34)) | (1 << (QuintErrorsParser.IDENTIFIER - 34)))) !== 0)) {
					{
					this.state = 556;
					this.expr(0);
					this.state = 561;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 60, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 557;
							this.match(QuintErrorsParser.T__7);
							this.state = 558;
							this.expr(0);
							}
							}
						}
						this.state = 563;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 60, this._ctx);
					}
					}
				}

				this.state = 567;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__7) {
					{
					this.state = 566;
					this.match(QuintErrorsParser.T__7);
					}
				}

				this.state = 569;
				this.match(QuintErrorsParser.T__26);
				}
				break;

			case 14:
				{
				_localctx = new IfElseContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 570;
				this.match(QuintErrorsParser.T__34);
				this.state = 571;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 572;
				this.expr(0);
				this.state = 573;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 574;
				this.expr(0);
				this.state = 575;
				this.match(QuintErrorsParser.T__35);
				this.state = 576;
				this.expr(5);
				}
				break;

			case 15:
				{
				_localctx = new LetInContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 578;
				this.operDef();
				this.state = 579;
				this.expr(4);
				}
				break;

			case 16:
				{
				_localctx = new NondetContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 581;
				this.nondetOperDef();
				this.state = 582;
				this.expr(3);
				}
				break;

			case 17:
				{
				_localctx = new ParenContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 584;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 585;
				this.expr(0);
				this.state = 586;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 18:
				{
				_localctx = new BracesContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 588;
				this.match(QuintErrorsParser.T__1);
				this.state = 589;
				this.expr(0);
				this.state = 590;
				this.match(QuintErrorsParser.T__2);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 643;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 67, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 641;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 66, this._ctx) ) {
					case 1:
						{
						_localctx = new PowContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 594;
						if (!(this.precpred(this._ctx, 26))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 26)");
						}
						this.state = 595;
						(_localctx as PowContext)._op = this.match(QuintErrorsParser.T__30);
						this.state = 596;
						this.expr(26);
						}
						break;

					case 2:
						{
						_localctx = new MultDivContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 597;
						if (!(this.precpred(this._ctx, 24))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
						}
						this.state = 598;
						(_localctx as MultDivContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (QuintErrorsParser.MUL - 53)) | (1 << (QuintErrorsParser.DIV - 53)) | (1 << (QuintErrorsParser.MOD - 53)))) !== 0))) {
							(_localctx as MultDivContext)._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 599;
						this.expr(25);
						}
						break;

					case 3:
						{
						_localctx = new PlusMinusContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 600;
						if (!(this.precpred(this._ctx, 23))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 23)");
						}
						this.state = 601;
						(_localctx as PlusMinusContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === QuintErrorsParser.PLUS || _la === QuintErrorsParser.MINUS)) {
							(_localctx as PlusMinusContext)._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 602;
						this.expr(24);
						}
						break;

					case 4:
						{
						_localctx = new RelationsContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 603;
						if (!(this.precpred(this._ctx, 22))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 22)");
						}
						this.state = 604;
						(_localctx as RelationsContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(((((_la - 56)) & ~0x1F) === 0 && ((1 << (_la - 56)) & ((1 << (QuintErrorsParser.GT - 56)) | (1 << (QuintErrorsParser.LT - 56)) | (1 << (QuintErrorsParser.GE - 56)) | (1 << (QuintErrorsParser.LE - 56)) | (1 << (QuintErrorsParser.NE - 56)) | (1 << (QuintErrorsParser.EQ - 56)))) !== 0))) {
							(_localctx as RelationsContext)._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 605;
						this.expr(23);
						}
						break;

					case 5:
						{
						_localctx = new ErrorEqContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 606;
						if (!(this.precpred(this._ctx, 20))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 20)");
						}
						this.state = 607;
						this.match(QuintErrorsParser.ASGN);
						this.state = 608;
						this.expr(21);

						                            const m = "[QNT006] unexpected '=', did you mean '=='?"
						                            this.notifyErrorListeners(m)
						                          
						}
						break;

					case 6:
						{
						_localctx = new AndContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 611;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 612;
						this.match(QuintErrorsParser.AND);
						this.state = 613;
						this.expr(19);
						}
						break;

					case 7:
						{
						_localctx = new OrContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 614;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 615;
						this.match(QuintErrorsParser.OR);
						this.state = 616;
						this.expr(17);
						}
						break;

					case 8:
						{
						_localctx = new IffContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 617;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 618;
						this.match(QuintErrorsParser.IFF);
						this.state = 619;
						this.expr(16);
						}
						break;

					case 9:
						{
						_localctx = new ImpliesContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 620;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 621;
						this.match(QuintErrorsParser.IMPLIES);
						this.state = 622;
						this.expr(15);
						}
						break;

					case 10:
						{
						_localctx = new PairContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 623;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 624;
						this.match(QuintErrorsParser.T__23);
						this.state = 625;
						this.expr(9);
						}
						break;

					case 11:
						{
						_localctx = new DotCallContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 626;
						if (!(this.precpred(this._ctx, 30))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 30)");
						}
						this.state = 627;
						this.match(QuintErrorsParser.T__19);
						this.state = 628;
						this.nameAfterDot();
						this.state = 634;
						this._errHandler.sync(this);
						switch ( this.interpreter.adaptivePredict(this._input, 65, this._ctx) ) {
						case 1:
							{
							this.state = 629;
							this.match(QuintErrorsParser.LPAREN);
							this.state = 631;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
							if (((((_la - 2)) & ~0x1F) === 0 && ((1 << (_la - 2)) & ((1 << (QuintErrorsParser.T__1 - 2)) | (1 << (QuintErrorsParser.T__11 - 2)) | (1 << (QuintErrorsParser.T__12 - 2)) | (1 << (QuintErrorsParser.T__13 - 2)) | (1 << (QuintErrorsParser.T__14 - 2)) | (1 << (QuintErrorsParser.T__15 - 2)) | (1 << (QuintErrorsParser.T__16 - 2)) | (1 << (QuintErrorsParser.T__17 - 2)) | (1 << (QuintErrorsParser.T__25 - 2)) | (1 << (QuintErrorsParser.T__32 - 2)))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (QuintErrorsParser.T__33 - 34)) | (1 << (QuintErrorsParser.T__34 - 34)) | (1 << (QuintErrorsParser.T__36 - 34)) | (1 << (QuintErrorsParser.STRING - 34)) | (1 << (QuintErrorsParser.BOOL - 34)) | (1 << (QuintErrorsParser.INT - 34)) | (1 << (QuintErrorsParser.AND - 34)) | (1 << (QuintErrorsParser.OR - 34)) | (1 << (QuintErrorsParser.IFF - 34)) | (1 << (QuintErrorsParser.IMPLIES - 34)) | (1 << (QuintErrorsParser.SET - 34)) | (1 << (QuintErrorsParser.LIST - 34)) | (1 << (QuintErrorsParser.MAP - 34)) | (1 << (QuintErrorsParser.MATCH - 34)) | (1 << (QuintErrorsParser.MINUS - 34)) | (1 << (QuintErrorsParser.LPAREN - 34)) | (1 << (QuintErrorsParser.IDENTIFIER - 34)))) !== 0)) {
								{
								this.state = 630;
								this.argList();
								}
							}

							this.state = 633;
							this.match(QuintErrorsParser.RPAREN);
							}
							break;
						}
						}
						break;

					case 12:
						{
						_localctx = new ListAppContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 636;
						if (!(this.precpred(this._ctx, 27))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 27)");
						}
						this.state = 637;
						this.match(QuintErrorsParser.T__25);
						this.state = 638;
						this.expr(0);
						this.state = 639;
						this.match(QuintErrorsParser.T__26);
						}
						break;
					}
					}
				}
				this.state = 645;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 67, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public matchSumExpr(): MatchSumExprContext {
		let _localctx: MatchSumExprContext = new MatchSumExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, QuintErrorsParser.RULE_matchSumExpr);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 646;
			this.match(QuintErrorsParser.MATCH);
			this.state = 647;
			this.expr(0);
			this.state = 648;
			this.match(QuintErrorsParser.T__1);
			this.state = 650;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__10) {
				{
				this.state = 649;
				this.match(QuintErrorsParser.T__10);
				}
			}

			this.state = 652;
			_localctx._matchSumCase = this.matchSumCase();
			_localctx._matchCase.push(_localctx._matchSumCase);
			this.state = 657;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === QuintErrorsParser.T__10) {
				{
				{
				this.state = 653;
				this.match(QuintErrorsParser.T__10);
				this.state = 654;
				_localctx._matchSumCase = this.matchSumCase();
				_localctx._matchCase.push(_localctx._matchSumCase);
				}
				}
				this.state = 659;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 660;
			this.match(QuintErrorsParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public matchSumCase(): MatchSumCaseContext {
		let _localctx: MatchSumCaseContext = new MatchSumCaseContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, QuintErrorsParser.RULE_matchSumCase);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 664;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				{
				this.state = 662;
				_localctx._variantMatch = this.matchSumVariant();
				}
				break;
			case QuintErrorsParser.T__36:
				{
				this.state = 663;
				_localctx._wildCardMatch = this.match(QuintErrorsParser.T__36);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 666;
			this.match(QuintErrorsParser.T__24);
			this.state = 667;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public matchSumVariant(): MatchSumVariantContext {
		let _localctx: MatchSumVariantContext = new MatchSumVariantContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, QuintErrorsParser.RULE_matchSumVariant);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 669;
			_localctx._variantLabel = this.simpleId("variant label");
			}
			this.state = 676;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.LPAREN) {
				{
				this.state = 670;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 673;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case QuintErrorsParser.IDENTIFIER:
					{
					this.state = 671;
					_localctx._variantParam = this.simpleId("match case parameter");
					}
					break;
				case QuintErrorsParser.T__36:
					{
					this.state = 672;
					this.match(QuintErrorsParser.T__36);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 675;
				this.match(QuintErrorsParser.RPAREN);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarationOrExpr(): DeclarationOrExprContext {
		let _localctx: DeclarationOrExprContext = new DeclarationOrExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, QuintErrorsParser.RULE_declarationOrExpr);
		try {
			this.state = 687;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 73, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 678;
				this.declaration();
				this.state = 679;
				this.match(QuintErrorsParser.EOF);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 681;
				this.expr(0);
				this.state = 682;
				this.match(QuintErrorsParser.EOF);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 684;
				this.match(QuintErrorsParser.DOCCOMMENT);
				this.state = 685;
				this.match(QuintErrorsParser.EOF);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 686;
				this.match(QuintErrorsParser.EOF);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambda(): LambdaContext {
		let _localctx: LambdaContext = new LambdaContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, QuintErrorsParser.RULE_lambda);
		try {
			this.state = 691;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 74, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 689;
				this.lambdaUnsugared();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 690;
				this.lambdaTupleSugar();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambdaUnsugared(): LambdaUnsugaredContext {
		let _localctx: LambdaUnsugaredContext = new LambdaUnsugaredContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, QuintErrorsParser.RULE_lambdaUnsugared);
		let _la: number;
		try {
			this.state = 710;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.T__36:
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 693;
				this.parameter();
				this.state = 694;
				this.match(QuintErrorsParser.T__24);
				this.state = 695;
				this.expr(0);
				}
				break;
			case QuintErrorsParser.LPAREN:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 697;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 698;
				this.parameter();
				this.state = 703;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__7) {
					{
					{
					this.state = 699;
					this.match(QuintErrorsParser.T__7);
					this.state = 700;
					this.parameter();
					}
					}
					this.state = 705;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 706;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 707;
				this.match(QuintErrorsParser.T__24);
				this.state = 708;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambdaTupleSugar(): LambdaTupleSugarContext {
		let _localctx: LambdaTupleSugarContext = new LambdaTupleSugarContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, QuintErrorsParser.RULE_lambdaTupleSugar);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 712;
			this.match(QuintErrorsParser.LPAREN);
			this.state = 713;
			this.match(QuintErrorsParser.LPAREN);
			this.state = 714;
			this.parameter();
			this.state = 717;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 715;
				this.match(QuintErrorsParser.T__7);
				this.state = 716;
				this.parameter();
				}
				}
				this.state = 719;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === QuintErrorsParser.T__7);
			this.state = 721;
			this.match(QuintErrorsParser.RPAREN);
			this.state = 722;
			this.match(QuintErrorsParser.RPAREN);
			this.state = 723;
			this.match(QuintErrorsParser.T__24);
			this.state = 724;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public identOrHole(): IdentOrHoleContext {
		let _localctx: IdentOrHoleContext = new IdentOrHoleContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, QuintErrorsParser.RULE_identOrHole);
		try {
			this.state = 728;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.T__36:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 726;
				this.match(QuintErrorsParser.T__36);
				}
				break;
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 727;
				this.qualId();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameter(): ParameterContext {
		let _localctx: ParameterContext = new ParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, QuintErrorsParser.RULE_parameter);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 730;
			this.identOrHole();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public identOrStar(): IdentOrStarContext {
		let _localctx: IdentOrStarContext = new IdentOrStarContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, QuintErrorsParser.RULE_identOrStar);
		try {
			this.state = 734;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.MUL:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 732;
				this.match(QuintErrorsParser.MUL);
				}
				break;
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 733;
				this.qualId();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argList(): ArgListContext {
		let _localctx: ArgListContext = new ArgListContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, QuintErrorsParser.RULE_argList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 736;
			this.expr(0);
			this.state = 741;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === QuintErrorsParser.T__7) {
				{
				{
				this.state = 737;
				this.match(QuintErrorsParser.T__7);
				this.state = 738;
				this.expr(0);
				}
				}
				this.state = 743;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recElem(): RecElemContext {
		let _localctx: RecElemContext = new RecElemContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, QuintErrorsParser.RULE_recElem);
		try {
			this.state = 750;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 744;
				this.simpleId("record");
				this.state = 745;
				this.match(QuintErrorsParser.T__5);
				this.state = 746;
				this.expr(0);
				}
				break;
			case QuintErrorsParser.T__37:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 748;
				this.match(QuintErrorsParser.T__37);
				this.state = 749;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public normalCallName(): NormalCallNameContext {
		let _localctx: NormalCallNameContext = new NormalCallNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, QuintErrorsParser.RULE_normalCallName);
		let _la: number;
		try {
			this.state = 754;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 752;
				this.qualId();
				}
				break;
			case QuintErrorsParser.AND:
			case QuintErrorsParser.OR:
			case QuintErrorsParser.IFF:
			case QuintErrorsParser.IMPLIES:
			case QuintErrorsParser.SET:
			case QuintErrorsParser.LIST:
			case QuintErrorsParser.MAP:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 753;
				_localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if (!(((((_la - 43)) & ~0x1F) === 0 && ((1 << (_la - 43)) & ((1 << (QuintErrorsParser.AND - 43)) | (1 << (QuintErrorsParser.OR - 43)) | (1 << (QuintErrorsParser.IFF - 43)) | (1 << (QuintErrorsParser.IMPLIES - 43)) | (1 << (QuintErrorsParser.SET - 43)) | (1 << (QuintErrorsParser.LIST - 43)) | (1 << (QuintErrorsParser.MAP - 43)))) !== 0))) {
					_localctx._op = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nameAfterDot(): NameAfterDotContext {
		let _localctx: NameAfterDotContext = new NameAfterDotContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, QuintErrorsParser.RULE_nameAfterDot);
		let _la: number;
		try {
			this.state = 758;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 756;
				this.qualId();
				}
				break;
			case QuintErrorsParser.AND:
			case QuintErrorsParser.OR:
			case QuintErrorsParser.IFF:
			case QuintErrorsParser.IMPLIES:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 757;
				_localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if (!(((((_la - 43)) & ~0x1F) === 0 && ((1 << (_la - 43)) & ((1 << (QuintErrorsParser.AND - 43)) | (1 << (QuintErrorsParser.OR - 43)) | (1 << (QuintErrorsParser.IFF - 43)) | (1 << (QuintErrorsParser.IMPLIES - 43)))) !== 0))) {
					_localctx._op = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public operator(): OperatorContext {
		let _localctx: OperatorContext = new OperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, QuintErrorsParser.RULE_operator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 760;
			_la = this._input.LA(1);
			if (!(((((_la - 31)) & ~0x1F) === 0 && ((1 << (_la - 31)) & ((1 << (QuintErrorsParser.T__30 - 31)) | (1 << (QuintErrorsParser.AND - 31)) | (1 << (QuintErrorsParser.OR - 31)) | (1 << (QuintErrorsParser.IFF - 31)) | (1 << (QuintErrorsParser.IMPLIES - 31)) | (1 << (QuintErrorsParser.PLUS - 31)) | (1 << (QuintErrorsParser.MINUS - 31)) | (1 << (QuintErrorsParser.MUL - 31)) | (1 << (QuintErrorsParser.DIV - 31)) | (1 << (QuintErrorsParser.MOD - 31)) | (1 << (QuintErrorsParser.GT - 31)) | (1 << (QuintErrorsParser.LT - 31)) | (1 << (QuintErrorsParser.GE - 31)) | (1 << (QuintErrorsParser.LE - 31)) | (1 << (QuintErrorsParser.NE - 31)) | (1 << (QuintErrorsParser.EQ - 31)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let _localctx: LiteralContext = new LiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, QuintErrorsParser.RULE_literal);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 762;
			_la = this._input.LA(1);
			if (!(((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (QuintErrorsParser.STRING - 40)) | (1 << (QuintErrorsParser.BOOL - 40)) | (1 << (QuintErrorsParser.INT - 40)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public qualId(): QualIdContext {
		let _localctx: QualIdContext = new QualIdContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, QuintErrorsParser.RULE_qualId);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 764;
			this.match(QuintErrorsParser.IDENTIFIER);
			this.state = 769;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 84, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 765;
					this.match(QuintErrorsParser.T__38);
					this.state = 766;
					this.match(QuintErrorsParser.IDENTIFIER);
					}
					}
				}
				this.state = 771;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 84, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public simpleId(context: string): SimpleIdContext {
		let _localctx: SimpleIdContext = new SimpleIdContext(this._ctx, this.state, context);
		this.enterRule(_localctx, 76, QuintErrorsParser.RULE_simpleId);
		try {
			this.state = 776;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 85, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 772;
				this.match(QuintErrorsParser.IDENTIFIER);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 773;
				_localctx._qualId = this.qualId();

				        const err = quintErrorToString(
				          { code: 'QNT008',
				            message: "Identifiers in a " + _localctx.context + " cannot be qualified with '::'. Found " + (_localctx._qualId != null ? this._input.getTextFromRange(_localctx._qualId._start, _localctx._qualId._stop) : undefined) + "."
				          },
				        )
				        this.notifyErrorListeners(err)
				      
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public empty(): EmptyContext {
		let _localctx: EmptyContext = new EmptyContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, QuintErrorsParser.RULE_empty);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 778;
			this.match(QuintErrorsParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 16:
			return this.type_sempred(_localctx as TypeContext, predIndex);

		case 20:
			return this.expr_sempred(_localctx as ExprContext, predIndex);
		}
		return true;
	}
	private type_sempred(_localctx: TypeContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 13);

		case 1:
			return this.precpred(this._ctx, 12);
		}
		return true;
	}
	private expr_sempred(_localctx: ExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 2:
			return this.precpred(this._ctx, 26);

		case 3:
			return this.precpred(this._ctx, 24);

		case 4:
			return this.precpred(this._ctx, 23);

		case 5:
			return this.precpred(this._ctx, 22);

		case 6:
			return this.precpred(this._ctx, 20);

		case 7:
			return this.precpred(this._ctx, 18);

		case 8:
			return this.precpred(this._ctx, 16);

		case 9:
			return this.precpred(this._ctx, 15);

		case 10:
			return this.precpred(this._ctx, 14);

		case 11:
			return this.precpred(this._ctx, 8);

		case 12:
			return this.precpred(this._ctx, 30);

		case 13:
			return this.precpred(this._ctx, 27);
		}
		return true;
	}

	private static readonly _serializedATNSegments: number = 2;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03G\u030F\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x03\x02\x06\x02" +
		"T\n\x02\r\x02\x0E\x02U\x03\x02\x03\x02\x03\x03\x07\x03[\n\x03\f\x03\x0E" +
		"\x03^\v\x03\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03d\n\x03\f\x03\x0E\x03" +
		"g\v\x03\x03\x03\x07\x03j\n\x03\f\x03\x0E\x03m\v\x03\x03\x03\x03\x03\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x05\x04\x84\n\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05" +
		"\x05\x05\x8C\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x07" +
		"\x06\x94\n\x06\f\x06\x0E\x06\x97\v\x06\x05\x06\x99\n\x06\x03\x06\x03\x06" +
		"\x03\x06\x05\x06\x9E\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x07\x06\xAB\n\x06\f\x06\x0E" +
		"\x06\xAE\v\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06\xB4\n\x06\x03\x06" +
		"\x03\x06\x05\x06\xB8\n\x06\x03\x06\x05\x06\xBB\n\x06\x03\x07\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05" +
		"\x07\xC8\n\x07\x03\x07\x03\x07\x03\x07\x07\x07\xCD\n\x07\f\x07\x0E\x07" +
		"\xD0\v\x07\x05\x07\xD2\n\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x05\b\xD9\n" +
		"\b\x03\t\x03\t\x03\t\x03\t\x05\t\xDF\n\t\x03\t\x03\t\x03\t\x05\t\xE4\n" +
		"\t\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x05\n\xEF\n\n" +
		"\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05\v\xF7\n\v\x03\v\x03\v\x03\v\x03" +
		"\v\x05\v\xFD\n\v\x03\v\x03\v\x05\v\u0101\n\v\x05\v\u0103\n\v\x03\f\x03" +
		"\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x05\f\u010E\n\f\x05\f\u0110" +
		"\n\f\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r" +
		"\x07\r\u011D\n\r\f\r\x0E\r\u0120\v\r\x03\r\x03\r\x03\r\x03\r\x03\r\x05" +
		"\r\u0127\n\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x07\r\u0134\n\r\f\r\x0E\r\u0137\v\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x05\r\u013E\n\r\x05\r\u0140\n\r\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03" +
		"\x10\x03\x10\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x07" +
		"\x12\u014F\n\x12\f\x12\x0E\x12\u0152\v\x12\x05\x12\u0154\n\x12\x03\x12" +
		"\x05\x12\u0157\n\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03" +
		"\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03" +
		"\x12\x03\x12\x03\x12\x03\x12\x07\x12\u016C\n\x12\f\x12\x0E\x12\u016F\v" +
		"\x12\x03\x12\x05\x12\u0172\n\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12" +
		"\x03\x12\x03\x12\x06\x12\u017B\n\x12\r\x12\x0E\x12\u017C\x03\x12\x03\x12" +
		"\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x05\x12\u0187\n\x12\x03" +
		"\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x07\x12\u018F\n\x12\f\x12" +
		"\x0E\x12\u0192\v\x12\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03" +
		"\x13\x05\x13\u019B\n\x13\x03\x13\x05\x13\u019E\n\x13\x03\x13\x03\x13\x03" +
		"\x14\x03\x14\x03\x14\x03\x14\x03\x14\x07\x14\u01A7\n\x14\f\x14\x0E\x14" +
		"\u01AA\v\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x05" +
		"\x14\u01B3\n\x14\x05\x14\u01B5\n\x14\x03\x14\x03\x14\x05\x14\u01B9\n\x14" +
		"\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x05\x16\u01C2" +
		"\n\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x07\x16\u01D2\n\x16\f" +
		"\x16\x0E\x16\u01D5\v\x16\x03\x16\x05\x16\u01D8\n\x16\x03\x16\x03\x16\x03" +
		"\x16\x03\x16\x03\x16\x03\x16\x03\x16\x07\x16\u01E1\n\x16\f\x16\x0E\x16" +
		"\u01E4\v\x16\x03\x16\x05\x16\u01E7\n\x16\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x07\x16\u01F1\n\x16\f\x16\x0E\x16\u01F4" +
		"\v\x16\x03\x16\x05\x16\u01F7\n\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03" +
		"\x16\x03\x16\x03\x16\x07\x16\u0200\n\x16\f\x16\x0E\x16\u0203\v\x16\x03" +
		"\x16\x05\x16\u0206\n\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x05\x16\u020E\n\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x07" +
		"\x16\u0216\n\x16\f\x16\x0E\x16\u0219\v\x16\x03\x16\x05\x16\u021C\n\x16" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x07\x16\u0224\n\x16\f" +
		"\x16\x0E\x16\u0227\v\x16\x03\x16\x05\x16\u022A\n\x16\x03\x16\x03\x16\x03" +
		"\x16\x03\x16\x03\x16\x03\x16\x07\x16\u0232\n\x16\f\x16\x0E\x16\u0235\v" +
		"\x16\x05\x16\u0237\n\x16\x03\x16\x05\x16\u023A\n\x16\x03\x16\x03\x16\x03" +
		"\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03" +
		"\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03" +
		"\x16\x03\x16\x03\x16\x05\x16\u0253\n\x16\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x05\x16\u027A\n\x16\x03" +
		"\x16\x05\x16\u027D\n\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x07\x16" +
		"\u0284\n\x16\f\x16\x0E\x16\u0287\v\x16\x03\x17\x03\x17\x03\x17\x03\x17" +
		"\x05\x17\u028D\n\x17\x03\x17\x03\x17\x03\x17\x07\x17\u0292\n\x17\f\x17" +
		"\x0E\x17\u0295\v\x17\x03\x17\x03\x17\x03\x18\x03\x18\x05\x18\u029B\n\x18" +
		"\x03\x18\x03\x18\x03\x18\x03\x19\x03\x19\x03\x19\x03\x19\x05\x19\u02A4" +
		"\n\x19\x03\x19\x05\x19\u02A7\n\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03" +
		"\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x05\x1A\u02B2\n\x1A\x03\x1B\x03\x1B" +
		"\x05\x1B\u02B6\n\x1B\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03" +
		"\x1C\x03\x1C\x07\x1C\u02C0\n\x1C\f\x1C\x0E\x1C\u02C3\v\x1C\x03\x1C\x03" +
		"\x1C\x03\x1C\x03\x1C\x05\x1C\u02C9\n\x1C\x03\x1D\x03\x1D\x03\x1D\x03\x1D" +
		"\x03\x1D\x06\x1D\u02D0\n\x1D\r\x1D\x0E\x1D\u02D1\x03\x1D\x03\x1D\x03\x1D" +
		"\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x05\x1E\u02DB\n\x1E\x03\x1F\x03\x1F\x03" +
		" \x03 \x05 \u02E1\n \x03!\x03!\x03!\x07!\u02E6\n!\f!\x0E!\u02E9\v!\x03" +
		"\"\x03\"\x03\"\x03\"\x03\"\x03\"\x05\"\u02F1\n\"\x03#\x03#\x05#\u02F5" +
		"\n#\x03$\x03$\x05$\u02F9\n$\x03%\x03%\x03&\x03&\x03\'\x03\'\x03\'\x07" +
		"\'\u0302\n\'\f\'\x0E\'\u0305\v\'\x03(\x03(\x03(\x03(\x05(\u030B\n(\x03" +
		")\x03)\x03)\x02\x02\x04\"**\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02" +
		"\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02" +
		" \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02" +
		"<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02\x02\t\x03\x02" +
		"79\x03\x0256\x03\x02:?\x03\x02-3\x03\x02-0\x05\x02!!-05?\x03\x02*,\x02" +
		"\u0373\x02S\x03\x02\x02\x02\x04\\\x03\x02\x02\x02\x06\x83\x03\x02\x02" +
		"\x02\b\x8B\x03\x02\x02\x02\n\x8D\x03\x02\x02\x02\f\xD1\x03\x02\x02\x02" +
		"\x0E\xD3\x03\x02\x02\x02\x10\xDA\x03\x02\x02\x02\x12\xEE\x03\x02\x02\x02" +
		"\x14\u0102\x03\x02\x02\x02\x16\u010F\x03\x02\x02\x02\x18\u013F\x03\x02" +
		"\x02\x02\x1A\u0141\x03\x02\x02\x02\x1C\u0143\x03\x02\x02\x02\x1E\u0145" +
		"\x03\x02\x02\x02 \u0147\x03\x02\x02\x02\"\u0186\x03\x02\x02\x02$\u0193" +
		"\x03\x02\x02\x02&\u01B8\x03\x02\x02\x02(\u01BA\x03\x02\x02\x02*\u0252" +
		"\x03\x02\x02\x02,\u0288\x03\x02\x02\x02.\u029A\x03\x02\x02\x020\u029F" +
		"\x03\x02\x02\x022\u02B1\x03\x02\x02\x024\u02B5\x03\x02\x02\x026\u02C8" +
		"\x03\x02\x02\x028\u02CA\x03\x02\x02\x02:\u02DA\x03\x02\x02\x02<\u02DC" +
		"\x03\x02\x02\x02>\u02E0\x03\x02\x02\x02@\u02E2\x03\x02\x02\x02B\u02F0" +
		"\x03\x02\x02\x02D\u02F4\x03\x02\x02\x02F\u02F8\x03\x02\x02\x02H\u02FA" +
		"\x03\x02\x02\x02J\u02FC\x03\x02\x02\x02L\u02FE\x03\x02\x02\x02N\u030A" +
		"\x03\x02\x02\x02P\u030C\x03\x02\x02\x02RT\x05\x04\x03\x02SR\x03\x02\x02" +
		"\x02TU\x03\x02\x02\x02US\x03\x02\x02\x02UV\x03\x02\x02\x02VW\x03\x02\x02" +
		"\x02WX\x07\x02\x02\x03X\x03\x03\x02\x02\x02Y[\x07D\x02\x02ZY\x03\x02\x02" +
		"\x02[^\x03\x02\x02\x02\\Z\x03\x02\x02\x02\\]\x03\x02\x02\x02]_\x03\x02" +
		"\x02\x02^\\\x03\x02\x02\x02_`\x07\x03\x02\x02`a\x05L\'\x02ak\x07\x04\x02" +
		"\x02bd\x07D\x02\x02cb\x03\x02\x02\x02dg\x03\x02\x02\x02ec\x03\x02\x02" +
		"\x02ef\x03\x02\x02\x02fh\x03\x02\x02\x02ge\x03\x02\x02\x02hj\x05\x06\x04" +
		"\x02ie\x03\x02\x02\x02jm\x03\x02\x02\x02ki\x03\x02\x02\x02kl\x03\x02\x02" +
		"\x02ln\x03\x02\x02\x02mk\x03\x02\x02\x02no\x07\x05\x02\x02o\x05\x03\x02" +
		"\x02\x02pq\x07\x06\x02\x02q\x84\x05\b\x05\x02rs\x07\x07\x02\x02st\x05" +
		"L\'\x02tu\x07\b\x02\x02uv\x05\"\x12\x02v\x84\x03\x02\x02\x02wx\x07\t\x02" +
		"\x02xy\x05:\x1E\x02yz\x07@\x02\x02z{\x05*\x16\x02{\x84\x03\x02\x02\x02" +
		"|\x84\x05\x18\r\x02}\x84\x05\n\x06\x02~\x84\x05\f\x07\x02\x7F\x84\x05" +
		"\x14\v\x02\x80\x84\x05\x16\f\x02\x81\x82\v\x02\x02\x02\x82\x84\b\x04\x01" +
		"\x02\x83p\x03\x02\x02\x02\x83r\x03\x02\x02\x02\x83w\x03\x02\x02\x02\x83" +
		"|\x03\x02\x02\x02\x83}\x03\x02\x02\x02\x83~\x03\x02\x02\x02\x83\x7F\x03" +
		"\x02\x02\x02\x83\x80\x03\x02\x02\x02\x83\x81\x03\x02\x02\x02\x84\x07\x03" +
		"\x02\x02\x02\x85\x86\x05L\'\x02\x86\x87\x07\b\x02\x02\x87\x88\x05\"\x12" +
		"\x02\x88\x8C\x03\x02\x02\x02\x89\x8A\v\x02\x02\x02\x8A\x8C\b\x05\x01\x02" +
		"\x8B\x85\x03\x02\x02\x02\x8B\x89\x03\x02\x02\x02\x8C\t\x03\x02\x02\x02" +
		"\x8D\x8E\x05\x12\n\x02\x8E\xB3\x05D#\x02\x8F\x98\x07A\x02\x02\x90\x95" +
		"\x05<\x1F\x02\x91\x92\x07\n\x02\x02\x92\x94\x05<\x1F\x02\x93\x91\x03\x02" +
		"\x02\x02\x94\x97\x03\x02\x02\x02\x95\x93\x03\x02\x02\x02\x95\x96\x03\x02" +
		"\x02\x02\x96\x99\x03\x02\x02\x02\x97\x95\x03\x02\x02\x02\x98\x90\x03\x02" +
		"\x02\x02\x98\x99\x03\x02\x02\x02\x99\x9A\x03\x02\x02\x02\x9A\x9D\x07B" +
		"\x02\x02\x9B\x9C\x07\b\x02\x02\x9C\x9E\x05\"\x12\x02\x9D\x9B\x03\x02\x02" +
		"\x02\x9D\x9E\x03\x02\x02\x02\x9E\xB4\x03\x02\x02\x02\x9F\xA0\x07\b\x02" +
		"\x02\xA0\xB4\x05\"\x12\x02\xA1\xA2\x07A\x02\x02\xA2\xA3\x05<\x1F\x02\xA3" +
		"\xA4\x07\b\x02\x02\xA4\xAC\x05\"\x12\x02\xA5\xA6\x07\n\x02\x02\xA6\xA7" +
		"\x05<\x1F\x02\xA7\xA8\x07\b\x02\x02\xA8\xA9\x05\"\x12\x02\xA9\xAB\x03" +
		"\x02\x02\x02\xAA\xA5\x03\x02\x02\x02\xAB\xAE\x03\x02\x02\x02\xAC\xAA\x03" +
		"\x02\x02\x02\xAC\xAD\x03\x02\x02\x02\xAD\xAF\x03\x02\x02\x02\xAE\xAC\x03" +
		"\x02\x02\x02\xAF\xB0\x07B\x02\x02\xB0\xB1\x07\b\x02\x02\xB1\xB2\x05\"" +
		"\x12\x02\xB2\xB4\x03\x02\x02\x02\xB3\x8F\x03\x02\x02\x02\xB3\x9F\x03\x02" +
		"\x02\x02\xB3\xA1\x03\x02\x02\x02\xB3\xB4\x03\x02\x02\x02\xB4\xB7\x03\x02" +
		"\x02\x02\xB5\xB6\x07@\x02\x02\xB6\xB8\x05*\x16\x02\xB7\xB5\x03\x02\x02" +
		"\x02\xB7\xB8\x03\x02\x02\x02\xB8\xBA\x03\x02\x02\x02\xB9\xBB\x07\v\x02" +
		"\x02\xBA\xB9\x03\x02\x02\x02\xBA\xBB\x03\x02\x02\x02\xBB\v\x03\x02\x02" +
		"\x02\xBC\xBD\x07\f\x02\x02\xBD\xD2\x05L\'\x02\xBE\xBF\x07\f\x02\x02\xBF" +
		"\xC0\x05L\'\x02\xC0\xC1\x07@\x02\x02\xC1\xC2\x05\"\x12\x02\xC2\xD2\x03" +
		"\x02\x02\x02\xC3\xC4\x07\f\x02\x02\xC4\xC5\x05L\'\x02\xC5\xC7\x07@\x02" +
		"\x02\xC6\xC8\x07\r\x02\x02\xC7\xC6\x03\x02\x02\x02\xC7\xC8\x03\x02\x02" +
		"\x02\xC8\xC9\x03\x02\x02\x02\xC9\xCE\x05\x0E\b\x02\xCA\xCB\x07\r\x02\x02" +
		"\xCB\xCD\x05\x0E\b\x02\xCC\xCA\x03\x02\x02\x02\xCD\xD0\x03\x02\x02\x02" +
		"\xCE\xCC\x03\x02\x02\x02\xCE\xCF\x03\x02\x02\x02\xCF\xD2\x03\x02\x02\x02" +
		"\xD0\xCE\x03\x02\x02\x02\xD1\xBC\x03\x02\x02\x02\xD1\xBE\x03\x02\x02\x02" +
		"\xD1\xC3\x03\x02\x02\x02\xD2\r\x03\x02\x02\x02\xD3\xD8\x05N(\x02\xD4\xD5" +
		"\x07A\x02\x02\xD5\xD6\x05\"\x12\x02\xD6\xD7\x07B\x02\x02\xD7\xD9\x03\x02" +
		"\x02\x02\xD8\xD4\x03\x02\x02\x02\xD8\xD9\x03\x02\x02\x02\xD9\x0F\x03\x02" +
		"\x02\x02\xDA\xDB\x07\x0E\x02\x02\xDB\xDE\x05L\'\x02\xDC\xDD\x07\b\x02" +
		"\x02\xDD\xDF\x05\"\x12\x02\xDE\xDC\x03\x02\x02\x02\xDE\xDF\x03\x02\x02" +
		"\x02\xDF\xE0\x03\x02\x02\x02\xE0\xE1\x07@\x02\x02\xE1\xE3\x05*\x16\x02" +
		"\xE2\xE4\x07\v\x02\x02\xE3\xE2\x03\x02\x02\x02\xE3\xE4\x03\x02\x02\x02" +
		"\xE4\x11\x03\x02\x02\x02\xE5\xEF\x07\x0F\x02\x02\xE6\xEF\x07\x10\x02\x02" +
		"\xE7\xE8\x07\x11\x02\x02\xE8\xEF\x07\x0F\x02\x02\xE9\xEA\x07\x11\x02\x02" +
		"\xEA\xEF\x07\x10\x02\x02\xEB\xEF\x07\x12\x02\x02\xEC\xEF\x07\x13\x02\x02" +
		"\xED\xEF\x07\x14\x02\x02\xEE\xE5\x03\x02\x02\x02\xEE\xE6\x03\x02\x02\x02" +
		"\xEE\xE7\x03\x02\x02\x02\xEE\xE9\x03\x02\x02\x02\xEE\xEB\x03\x02\x02\x02" +
		"\xEE\xEC\x03\x02\x02\x02\xEE\xED\x03\x02\x02\x02\xEF\x13\x03\x02\x02\x02" +
		"\xF0\xF1\x07\x15\x02\x02\xF1\xF2\x05\x1C\x0F\x02\xF2\xF3\x07\x16\x02\x02" +
		"\xF3\xF6\x05> \x02\xF4\xF5\x07\x17\x02\x02\xF5\xF7\x05 \x11\x02\xF6\xF4" +
		"\x03\x02\x02\x02\xF6\xF7\x03\x02\x02\x02\xF7\u0103\x03\x02\x02\x02\xF8" +
		"\xF9\x07\x15\x02\x02\xF9\xFC\x05\x1C\x0F\x02\xFA\xFB\x07\x18\x02\x02\xFB" +
		"\xFD\x05\x1C\x0F\x02\xFC\xFA\x03\x02\x02\x02\xFC\xFD\x03\x02\x02\x02\xFD" +
		"\u0100\x03\x02\x02\x02\xFE\xFF\x07\x17\x02\x02\xFF\u0101\x05 \x11\x02" +
		"\u0100\xFE\x03\x02\x02\x02\u0100\u0101\x03\x02\x02\x02\u0101\u0103\x03" +
		"\x02\x02\x02\u0102\xF0\x03\x02\x02\x02\u0102\xF8\x03\x02\x02\x02\u0103" +
		"\x15\x03\x02\x02\x02\u0104\u0105\x07\x19\x02\x02\u0105\u0106\x05\x1C\x0F" +
		"\x02\u0106\u0107\x07\x16\x02\x02\u0107\u0108\x05> \x02\u0108\u0110\x03" +
		"\x02\x02\x02\u0109\u010A\x07\x19\x02\x02\u010A\u010D\x05\x1C\x0F\x02\u010B" +
		"\u010C\x07\x18\x02\x02\u010C\u010E\x05\x1C\x0F\x02\u010D\u010B\x03\x02" +
		"\x02\x02\u010D\u010E\x03\x02\x02\x02\u010E\u0110\x03\x02\x02\x02\u010F" +
		"\u0104\x03\x02\x02\x02\u010F\u0109\x03\x02\x02\x02\u0110\x17\x03\x02\x02" +
		"\x02\u0111\u0112\x07\x15\x02\x02\u0112\u0113\x05\x1A\x0E\x02\u0113\u0114" +
		"\x07A\x02\x02\u0114\u0115\x05\x1C\x0F\x02\u0115\u0116\x07@\x02\x02\u0116" +
		"\u011E\x05*\x16\x02\u0117\u0118\x07\n\x02\x02\u0118\u0119\x05\x1C\x0F" +
		"\x02\u0119\u011A\x07@\x02\x02\u011A\u011B\x05*\x16\x02\u011B\u011D\x03" +
		"\x02\x02\x02\u011C\u0117\x03\x02\x02\x02\u011D\u0120\x03\x02\x02\x02\u011E" +
		"\u011C\x03\x02\x02\x02\u011E\u011F\x03\x02\x02\x02\u011F\u0121\x03\x02" +
		"\x02\x02\u0120\u011E\x03\x02\x02\x02\u0121\u0122\x07B\x02\x02\u0122\u0123" +
		"\x07\x16\x02\x02\u0123\u0126\x077\x02\x02\u0124\u0125\x07\x17\x02\x02" +
		"\u0125\u0127\x05 \x11\x02\u0126\u0124\x03\x02\x02\x02\u0126\u0127\x03" +
		"\x02\x02\x02\u0127\u0140\x03\x02\x02\x02\u0128\u0129\x07\x15\x02\x02\u0129" +
		"\u012A\x05\x1A\x0E\x02\u012A\u012B\x07A\x02\x02\u012B\u012C\x05\x1C\x0F" +
		"\x02\u012C\u012D\x07@\x02\x02\u012D\u0135\x05*\x16\x02\u012E\u012F\x07" +
		"\n\x02\x02\u012F\u0130\x05\x1C\x0F\x02\u0130\u0131\x07@\x02\x02\u0131" +
		"\u0132\x05*\x16\x02\u0132\u0134\x03\x02\x02\x02\u0133\u012E\x03\x02\x02" +
		"\x02\u0134\u0137\x03\x02\x02\x02\u0135\u0133\x03\x02\x02\x02\u0135\u0136" +
		"\x03\x02\x02\x02\u0136\u0138\x03\x02\x02\x02\u0137\u0135\x03\x02\x02\x02" +
		"\u0138\u0139\x07B\x02\x02\u0139\u013A\x07\x18\x02\x02\u013A\u013D\x05" +
		"\x1E\x10\x02\u013B\u013C\x07\x17\x02\x02\u013C\u013E\x05 \x11\x02\u013D" +
		"\u013B\x03\x02\x02\x02\u013D\u013E\x03\x02\x02\x02\u013E\u0140\x03\x02" +
		"\x02\x02\u013F\u0111\x03\x02\x02\x02\u013F\u0128\x03\x02\x02\x02\u0140" +
		"\x19\x03\x02\x02\x02\u0141\u0142\x05L\'\x02\u0142\x1B\x03\x02\x02\x02" +
		"\u0143\u0144\x05L\'\x02\u0144\x1D\x03\x02\x02\x02\u0145\u0146\x05L\'\x02" +
		"\u0146\x1F\x03\x02\x02\x02\u0147\u0148\x07*\x02\x02\u0148!\x03\x02\x02" +
		"\x02\u0149\u014A\b\x12\x01\x02\u014A\u0153\x07A\x02\x02\u014B\u0150\x05" +
		"\"\x12\x02\u014C\u014D\x07\n\x02\x02\u014D\u014F\x05\"\x12\x02\u014E\u014C" +
		"\x03\x02\x02\x02\u014F\u0152\x03\x02\x02\x02\u0150\u014E\x03\x02\x02\x02" +
		"\u0150\u0151\x03\x02\x02\x02\u0151\u0154\x03\x02\x02\x02\u0152\u0150\x03" +
		"\x02\x02\x02\u0153\u014B\x03\x02\x02\x02\u0153\u0154\x03\x02\x02\x02\u0154" +
		"\u0156\x03\x02\x02\x02\u0155\u0157\x07\n\x02\x02\u0156\u0155\x03\x02\x02" +
		"\x02\u0156\u0157\x03\x02\x02\x02\u0157\u0158\x03\x02\x02\x02\u0158\u0159" +
		"\x07B\x02\x02\u0159\u015A\x07\x1B\x02\x02\u015A\u0187\x05\"\x12\r\u015B" +
		"\u015C\x071\x02\x02\u015C\u015D\x07\x1C\x02\x02\u015D\u015E\x05\"\x12" +
		"\x02\u015E\u015F\x07\x1D\x02\x02\u015F\u0187\x03\x02\x02\x02\u0160\u0161" +
		"\x072\x02\x02\u0161\u0162\x07\x1C\x02\x02\u0162\u0163\x05\"\x12\x02\u0163" +
		"\u0164\x07\x1D\x02\x02\u0164\u0187\x03\x02\x02\x02\u0165\u0166\x07A\x02" +
		"\x02\u0166\u0167\x05\"\x12\x02\u0167\u0168\x07\n\x02\x02\u0168\u016D\x05" +
		"\"\x12\x02\u0169\u016A\x07\n\x02\x02\u016A\u016C\x05\"\x12\x02\u016B\u0169" +
		"\x03\x02\x02\x02\u016C\u016F\x03\x02\x02\x02\u016D\u016B\x03\x02\x02\x02" +
		"\u016D\u016E\x03\x02\x02\x02\u016E\u0171\x03\x02\x02\x02\u016F\u016D\x03" +
		"\x02\x02\x02\u0170\u0172\x07\n\x02\x02\u0171\u0170\x03\x02\x02\x02\u0171" +
		"\u0172\x03\x02\x02\x02\u0172\u0173\x03\x02\x02\x02\u0173\u0174\x07B\x02" +
		"\x02\u0174\u0187\x03\x02\x02\x02\u0175\u0176\x07\x04\x02\x02\u0176\u0177" +
		"\x05&\x14\x02\u0177\u0178\x07\x05\x02\x02\u0178\u0187\x03\x02\x02\x02" +
		"\u0179\u017B\x05$\x13\x02\u017A\u0179\x03\x02\x02\x02\u017B\u017C\x03" +
		"\x02\x02\x02\u017C\u017A\x03\x02\x02\x02\u017C\u017D\x03\x02\x02\x02\u017D" +
		"\u0187\x03\x02\x02\x02\u017E\u0187\x07\x1E\x02\x02\u017F\u0187\x07\x1F" +
		"\x02\x02\u0180\u0187\x07 \x02\x02\u0181\u0187\x05L\'\x02\u0182\u0183\x07" +
		"A\x02\x02\u0183\u0184\x05\"\x12\x02\u0184\u0185\x07B\x02\x02\u0185\u0187" +
		"\x03\x02\x02\x02\u0186\u0149\x03\x02\x02\x02\u0186\u015B\x03\x02\x02\x02" +
		"\u0186\u0160\x03\x02\x02\x02\u0186\u0165\x03\x02\x02\x02\u0186\u0175\x03" +
		"\x02\x02\x02\u0186\u017A\x03\x02\x02\x02\u0186\u017E\x03\x02\x02\x02\u0186" +
		"\u017F\x03\x02\x02\x02\u0186\u0180\x03\x02\x02\x02\u0186\u0181\x03\x02" +
		"\x02\x02\u0186\u0182\x03\x02\x02\x02\u0187\u0190\x03\x02\x02\x02\u0188" +
		"\u0189\f\x0F\x02\x02\u0189\u018A\x07\x1A\x02\x02\u018A\u018F\x05\"\x12" +
		"\x0F\u018B\u018C\f\x0E\x02\x02\u018C\u018D\x07\x1B\x02\x02\u018D\u018F" +
		"\x05\"\x12\x0E\u018E\u0188\x03\x02\x02\x02\u018E\u018B\x03\x02\x02\x02" +
		"\u018F\u0192\x03\x02\x02\x02\u0190\u018E\x03\x02\x02\x02\u0190\u0191\x03" +
		"\x02\x02\x02\u0191#\x03\x02\x02\x02\u0192\u0190\x03\x02\x02\x02\u0193" +
		"\u0194\x07\r\x02\x02\u0194\u0195\x07\x04\x02\x02\u0195\u0196\x05L\'\x02" +
		"\u0196\u0197\x07\b\x02\x02\u0197\u019A\x07*\x02\x02\u0198\u0199\x07\n" +
		"\x02\x02\u0199\u019B\x05&\x14\x02\u019A\u0198\x03\x02\x02\x02\u019A\u019B" +
		"\x03\x02\x02\x02\u019B\u019D\x03\x02\x02\x02\u019C\u019E\x07\n\x02\x02" +
		"\u019D\u019C\x03\x02\x02\x02\u019D\u019E\x03\x02\x02\x02\u019E\u019F\x03" +
		"\x02\x02\x02\u019F\u01A0\x07\x05\x02\x02\u01A0%\x03\x02\x02\x02\u01A1" +
		"\u01A2\x05(\x15\x02\u01A2\u01A3\x07\b\x02\x02\u01A3\u01A4\x05\"\x12\x02" +
		"\u01A4\u01A5\x07\n\x02\x02\u01A5\u01A7\x03\x02\x02\x02\u01A6\u01A1\x03" +
		"\x02\x02\x02\u01A7\u01AA\x03\x02\x02\x02\u01A8\u01A6\x03\x02\x02\x02\u01A8" +
		"\u01A9\x03\x02\x02\x02\u01A9\u01B4\x03\x02\x02\x02\u01AA\u01A8\x03\x02" +
		"\x02\x02\u01AB\u01AC\x05(\x15\x02\u01AC\u01AD\x07\b\x02\x02\u01AD\u01AE" +
		"\x05\"\x12\x02\u01AE\u01B2\x03\x02\x02\x02\u01AF\u01B3\x07\n\x02\x02\u01B0" +
		"\u01B1\x07\r\x02\x02\u01B1\u01B3\x07C\x02\x02\u01B2\u01AF\x03\x02\x02" +
		"\x02\u01B2\u01B0\x03\x02\x02\x02\u01B2\u01B3\x03\x02\x02\x02\u01B3\u01B5" +
		"\x03\x02\x02\x02\u01B4\u01AB\x03\x02\x02\x02\u01B4\u01B5\x03\x02\x02\x02" +
		"\u01B5\u01B9\x03\x02\x02\x02\u01B6\u01B7\x07\r\x02\x02\u01B7\u01B9\x07" +
		"C\x02\x02\u01B8\u01A8\x03\x02\x02\x02\u01B8\u01B6\x03\x02\x02\x02\u01B9" +
		"\'\x03\x02\x02\x02\u01BA\u01BB\x05N(\x02\u01BB)\x03\x02\x02\x02\u01BC" +
		"\u01BD\b\x16\x01\x02\u01BD\u0253\x054\x1B\x02\u01BE\u01BF\x05D#\x02\u01BF" +
		"\u01C1\x07A\x02\x02\u01C0\u01C2\x05@!\x02\u01C1\u01C0\x03\x02\x02\x02" +
		"\u01C1\u01C2\x03\x02\x02\x02\u01C2\u01C3\x03\x02\x02\x02\u01C3\u01C4\x07" +
		"B\x02\x02\u01C4\u0253\x03\x02\x02\x02\u01C5\u01C6\x076\x02\x02\u01C6\u0253" +
		"\x05*\x16\x1B\u01C7\u01C8\x05L\'\x02\u01C8\u01C9\x07\"\x02\x02\u01C9\u01CA" +
		"\x07@\x02\x02\u01CA\u01CB\x05*\x16\x17\u01CB\u0253\x03\x02\x02\x02\u01CC" +
		"\u01CD\x07-\x02\x02\u01CD\u01CE\x07\x04\x02\x02\u01CE\u01D3\x05*\x16\x02" +
		"\u01CF\u01D0\x07\n\x02\x02\u01D0\u01D2\x05*\x16\x02\u01D1\u01CF\x03\x02" +
		"\x02\x02\u01D2\u01D5\x03\x02\x02\x02\u01D3\u01D1\x03\x02\x02\x02\u01D3" +
		"\u01D4\x03\x02\x02\x02\u01D4\u01D7\x03\x02\x02\x02\u01D5\u01D3\x03\x02" +
		"\x02\x02\u01D6\u01D8\x07\n\x02\x02\u01D7\u01D6\x03\x02\x02\x02\u01D7\u01D8" +
		"\x03\x02\x02\x02\u01D8\u01D9\x03\x02\x02\x02\u01D9\u01DA\x07\x05\x02\x02" +
		"\u01DA\u0253\x03\x02\x02\x02\u01DB\u01DC\x07.\x02\x02\u01DC\u01DD\x07" +
		"\x04\x02\x02\u01DD\u01E2\x05*\x16\x02\u01DE\u01DF\x07\n\x02\x02\u01DF" +
		"\u01E1\x05*\x16\x02\u01E0\u01DE\x03\x02\x02\x02\u01E1\u01E4\x03\x02\x02" +
		"\x02\u01E2\u01E0\x03\x02\x02\x02\u01E2\u01E3\x03\x02\x02\x02\u01E3\u01E6" +
		"\x03\x02\x02\x02\u01E4\u01E2\x03\x02\x02\x02\u01E5\u01E7\x07\n\x02\x02" +
		"\u01E6\u01E5\x03\x02\x02\x02\u01E6\u01E7\x03\x02\x02\x02\u01E7\u01E8\x03" +
		"\x02\x02\x02\u01E8\u01E9\x07\x05\x02\x02\u01E9\u0253\x03\x02\x02\x02\u01EA" +
		"\u0253\x05,\x17\x02\u01EB\u01EC\x07#\x02\x02\u01EC\u01ED\x07\x04\x02\x02" +
		"\u01ED\u01F2\x05*\x16\x02\u01EE\u01EF\x07\n\x02\x02\u01EF\u01F1\x05*\x16" +
		"\x02\u01F0\u01EE\x03\x02\x02\x02\u01F1\u01F4\x03\x02\x02\x02\u01F2";
	private static readonly _serializedATNSegment1: string =
		"\u01F0\x03\x02\x02\x02\u01F2\u01F3\x03\x02\x02\x02\u01F3\u01F6\x03\x02" +
		"\x02\x02\u01F4\u01F2\x03\x02\x02\x02\u01F5\u01F7\x07\n\x02\x02\u01F6\u01F5" +
		"\x03\x02\x02\x02\u01F6\u01F7\x03\x02\x02\x02\u01F7\u01F8\x03\x02\x02\x02" +
		"\u01F8\u01F9\x07\x05\x02\x02\u01F9\u0253\x03\x02\x02\x02\u01FA\u01FB\x07" +
		"$\x02\x02\u01FB\u01FC\x07\x04\x02\x02\u01FC\u0201\x05*\x16\x02\u01FD\u01FE" +
		"\x07\n\x02\x02\u01FE\u0200\x05*\x16\x02\u01FF\u01FD\x03\x02\x02\x02\u0200" +
		"\u0203\x03\x02\x02\x02\u0201\u01FF\x03\x02\x02\x02\u0201\u0202\x03\x02" +
		"\x02\x02\u0202\u0205\x03\x02\x02\x02\u0203\u0201\x03\x02\x02\x02\u0204" +
		"\u0206\x07\n\x02\x02\u0205\u0204\x03\x02\x02\x02\u0205\u0206\x03\x02\x02" +
		"\x02\u0206\u0207\x03\x02\x02\x02\u0207\u0208\x07\x05\x02\x02\u0208\u0253" +
		"\x03\x02\x02\x02\u0209\u020E\x05L\'\x02\u020A\u020E\x07,\x02\x02\u020B" +
		"\u020E\x07+\x02\x02\u020C\u020E\x07*\x02\x02\u020D\u0209\x03\x02\x02\x02" +
		"\u020D\u020A\x03\x02\x02\x02\u020D\u020B\x03\x02\x02\x02\u020D\u020C\x03" +
		"\x02\x02\x02\u020E\u0253\x03\x02\x02\x02\u020F\u0210\x07A\x02\x02\u0210" +
		"\u0211\x05*\x16\x02\u0211\u0212\x07\n\x02\x02\u0212\u0217\x05*\x16\x02" +
		"\u0213\u0214\x07\n\x02\x02\u0214\u0216\x05*\x16\x02\u0215\u0213\x03\x02" +
		"\x02\x02\u0216\u0219\x03\x02\x02\x02\u0217\u0215\x03\x02\x02\x02\u0217" +
		"\u0218\x03\x02\x02\x02\u0218\u021B\x03\x02\x02\x02\u0219\u0217\x03\x02" +
		"\x02\x02\u021A\u021C\x07\n\x02\x02\u021B\u021A\x03\x02\x02\x02\u021B\u021C" +
		"\x03\x02\x02\x02\u021C\u021D\x03\x02\x02\x02\u021D\u021E\x07B\x02\x02" +
		"\u021E\u0253\x03\x02\x02\x02\u021F\u0220\x07\x04\x02\x02\u0220\u0225\x05" +
		"B\"\x02\u0221\u0222\x07\n\x02\x02\u0222\u0224\x05B\"\x02\u0223\u0221\x03" +
		"\x02\x02\x02\u0224\u0227\x03\x02\x02\x02\u0225\u0223\x03\x02\x02\x02\u0225" +
		"\u0226\x03\x02\x02\x02\u0226\u0229\x03\x02\x02\x02\u0227\u0225\x03\x02" +
		"\x02\x02\u0228\u022A\x07\n\x02\x02\u0229\u0228\x03\x02\x02\x02\u0229\u022A" +
		"\x03\x02\x02\x02\u022A\u022B\x03\x02\x02\x02\u022B\u022C\x07\x05\x02\x02" +
		"\u022C\u0253\x03\x02\x02\x02\u022D\u0236\x07\x1C\x02\x02\u022E\u0233\x05" +
		"*\x16\x02\u022F\u0230\x07\n\x02\x02\u0230\u0232\x05*\x16\x02\u0231\u022F" +
		"\x03\x02\x02\x02\u0232\u0235\x03\x02\x02\x02\u0233\u0231\x03\x02\x02\x02" +
		"\u0233\u0234\x03\x02\x02\x02\u0234\u0237\x03\x02\x02\x02\u0235\u0233\x03" +
		"\x02\x02\x02\u0236\u022E\x03\x02\x02\x02\u0236\u0237\x03\x02\x02\x02\u0237" +
		"\u0239\x03\x02\x02\x02\u0238\u023A\x07\n\x02\x02\u0239\u0238\x03\x02\x02" +
		"\x02\u0239\u023A\x03\x02\x02\x02\u023A\u023B\x03\x02\x02\x02\u023B\u0253" +
		"\x07\x1D\x02\x02\u023C\u023D\x07%\x02\x02\u023D\u023E\x07A\x02\x02\u023E" +
		"\u023F\x05*\x16\x02\u023F\u0240\x07B\x02\x02\u0240\u0241\x05*\x16\x02" +
		"\u0241\u0242\x07&\x02\x02\u0242\u0243\x05*\x16\x07\u0243\u0253\x03\x02" +
		"\x02\x02\u0244\u0245\x05\n\x06\x02\u0245\u0246\x05*\x16\x06\u0246\u0253" +
		"\x03\x02\x02\x02\u0247\u0248\x05\x10\t\x02\u0248\u0249\x05*\x16\x05\u0249" +
		"\u0253\x03\x02\x02\x02\u024A\u024B\x07A\x02\x02\u024B\u024C\x05*\x16\x02" +
		"\u024C\u024D\x07B\x02\x02\u024D\u0253\x03\x02\x02\x02\u024E\u024F\x07" +
		"\x04\x02\x02\u024F\u0250\x05*\x16\x02\u0250\u0251\x07\x05\x02\x02\u0251" +
		"\u0253\x03\x02\x02\x02\u0252\u01BC\x03\x02\x02\x02\u0252\u01BE\x03\x02" +
		"\x02\x02\u0252\u01C5\x03\x02\x02\x02\u0252\u01C7\x03\x02\x02\x02\u0252" +
		"\u01CC\x03\x02\x02\x02\u0252\u01DB\x03\x02\x02\x02\u0252\u01EA\x03\x02" +
		"\x02\x02\u0252\u01EB\x03\x02\x02\x02\u0252\u01FA\x03\x02\x02\x02\u0252" +
		"\u020D\x03\x02\x02\x02\u0252\u020F\x03\x02\x02\x02\u0252\u021F\x03\x02" +
		"\x02\x02\u0252\u022D\x03\x02\x02\x02\u0252\u023C\x03\x02\x02\x02\u0252" +
		"\u0244\x03\x02\x02\x02\u0252\u0247\x03\x02\x02\x02\u0252\u024A\x03\x02" +
		"\x02\x02\u0252\u024E\x03\x02\x02\x02\u0253\u0285\x03\x02\x02\x02\u0254" +
		"\u0255\f\x1C\x02\x02\u0255\u0256\x07!\x02\x02\u0256\u0284\x05*\x16\x1C" +
		"\u0257\u0258\f\x1A\x02\x02\u0258\u0259\t\x02\x02\x02\u0259\u0284\x05*" +
		"\x16\x1B\u025A\u025B\f\x19\x02\x02\u025B\u025C\t\x03\x02\x02\u025C\u0284" +
		"\x05*\x16\x1A\u025D\u025E\f\x18\x02\x02\u025E\u025F\t\x04\x02\x02\u025F" +
		"\u0284\x05*\x16\x19\u0260\u0261\f\x16\x02\x02\u0261\u0262\x07@\x02\x02" +
		"\u0262\u0263\x05*\x16\x17\u0263\u0264\b\x16\x01\x02\u0264\u0284\x03\x02" +
		"\x02\x02\u0265\u0266\f\x14\x02\x02\u0266\u0267\x07-\x02\x02\u0267\u0284" +
		"\x05*\x16\x15\u0268\u0269\f\x12\x02\x02\u0269\u026A\x07.\x02\x02\u026A" +
		"\u0284\x05*\x16\x13\u026B\u026C\f\x11\x02\x02\u026C\u026D\x07/\x02\x02" +
		"\u026D\u0284\x05*\x16\x12\u026E\u026F\f\x10\x02\x02\u026F\u0270\x070\x02" +
		"\x02\u0270\u0284\x05*\x16\x11\u0271\u0272\f\n\x02\x02\u0272\u0273\x07" +
		"\x1A\x02\x02\u0273\u0284\x05*\x16\v\u0274\u0275\f \x02\x02\u0275\u0276" +
		"\x07\x16\x02\x02\u0276\u027C\x05F$\x02\u0277\u0279\x07A\x02\x02\u0278" +
		"\u027A\x05@!\x02\u0279\u0278\x03\x02\x02\x02\u0279\u027A\x03\x02\x02\x02" +
		"\u027A\u027B\x03\x02\x02\x02\u027B\u027D\x07B\x02\x02\u027C\u0277\x03" +
		"\x02\x02\x02\u027C\u027D\x03\x02\x02\x02\u027D\u0284\x03\x02\x02\x02\u027E" +
		"\u027F\f\x1D\x02\x02\u027F\u0280\x07\x1C\x02\x02\u0280\u0281\x05*\x16" +
		"\x02\u0281\u0282\x07\x1D\x02\x02\u0282\u0284\x03\x02\x02\x02\u0283\u0254" +
		"\x03\x02\x02\x02\u0283\u0257\x03\x02\x02\x02\u0283\u025A\x03\x02\x02\x02" +
		"\u0283\u025D\x03\x02\x02\x02\u0283\u0260\x03\x02\x02\x02\u0283\u0265\x03" +
		"\x02\x02\x02\u0283\u0268\x03\x02\x02\x02\u0283\u026B\x03\x02\x02\x02\u0283" +
		"\u026E\x03\x02\x02\x02\u0283\u0271\x03\x02\x02\x02\u0283\u0274\x03\x02" +
		"\x02\x02\u0283\u027E\x03\x02\x02\x02\u0284\u0287\x03\x02\x02\x02\u0285" +
		"\u0283\x03\x02\x02\x02\u0285\u0286\x03\x02\x02\x02\u0286+\x03\x02\x02" +
		"\x02\u0287\u0285\x03\x02\x02\x02\u0288\u0289\x074\x02\x02\u0289\u028A" +
		"\x05*\x16\x02\u028A\u028C\x07\x04\x02\x02\u028B\u028D\x07\r\x02\x02\u028C" +
		"\u028B\x03\x02\x02\x02\u028C\u028D\x03\x02\x02\x02\u028D\u028E\x03\x02" +
		"\x02\x02\u028E\u0293\x05.\x18\x02\u028F\u0290\x07\r\x02\x02\u0290\u0292" +
		"\x05.\x18\x02\u0291\u028F\x03\x02\x02\x02\u0292\u0295\x03\x02\x02\x02" +
		"\u0293\u0291\x03\x02\x02\x02\u0293\u0294\x03\x02\x02\x02\u0294\u0296\x03" +
		"\x02\x02\x02\u0295\u0293\x03\x02\x02\x02\u0296\u0297\x07\x05\x02\x02\u0297" +
		"-\x03\x02\x02\x02\u0298\u029B\x050\x19\x02\u0299\u029B\x07\'\x02\x02\u029A" +
		"\u0298\x03\x02\x02\x02\u029A\u0299\x03\x02\x02\x02\u029B\u029C\x03\x02" +
		"\x02\x02\u029C\u029D\x07\x1B\x02\x02\u029D\u029E\x05*\x16\x02\u029E/\x03" +
		"\x02\x02\x02\u029F\u02A6\x05N(\x02\u02A0\u02A3\x07A\x02\x02\u02A1\u02A4" +
		"\x05N(\x02\u02A2\u02A4\x07\'\x02\x02\u02A3\u02A1\x03\x02\x02\x02\u02A3" +
		"\u02A2\x03\x02\x02\x02\u02A4\u02A5\x03\x02\x02\x02\u02A5\u02A7\x07B\x02" +
		"\x02\u02A6\u02A0\x03\x02\x02\x02\u02A6\u02A7\x03\x02\x02\x02\u02A71\x03" +
		"\x02\x02\x02\u02A8\u02A9\x05\x06\x04\x02\u02A9\u02AA\x07\x02\x02\x03\u02AA" +
		"\u02B2\x03\x02\x02\x02\u02AB\u02AC\x05*\x16\x02\u02AC\u02AD\x07\x02\x02" +
		"\x03\u02AD\u02B2\x03\x02\x02\x02\u02AE\u02AF\x07D\x02\x02\u02AF\u02B2" +
		"\x07\x02\x02\x03\u02B0\u02B2\x07\x02\x02\x03\u02B1\u02A8\x03\x02\x02\x02" +
		"\u02B1\u02AB\x03\x02\x02\x02\u02B1\u02AE\x03\x02\x02\x02\u02B1\u02B0\x03" +
		"\x02\x02\x02\u02B23\x03\x02\x02\x02\u02B3\u02B6\x056\x1C\x02\u02B4\u02B6" +
		"\x058\x1D\x02\u02B5\u02B3\x03\x02\x02\x02\u02B5\u02B4\x03\x02\x02\x02" +
		"\u02B65\x03\x02\x02\x02\u02B7\u02B8\x05<\x1F\x02\u02B8\u02B9\x07\x1B\x02" +
		"\x02\u02B9\u02BA\x05*\x16\x02\u02BA\u02C9\x03\x02\x02\x02\u02BB\u02BC" +
		"\x07A\x02\x02\u02BC\u02C1\x05<\x1F\x02\u02BD\u02BE\x07\n\x02\x02\u02BE" +
		"\u02C0\x05<\x1F\x02\u02BF\u02BD\x03\x02\x02\x02\u02C0\u02C3\x03\x02\x02" +
		"\x02\u02C1\u02BF\x03\x02\x02\x02\u02C1\u02C2\x03\x02\x02\x02\u02C2\u02C4" +
		"\x03\x02\x02\x02\u02C3\u02C1\x03\x02\x02\x02\u02C4\u02C5\x07B\x02\x02" +
		"\u02C5\u02C6\x07\x1B\x02\x02\u02C6\u02C7\x05*\x16\x02\u02C7\u02C9\x03" +
		"\x02\x02\x02\u02C8\u02B7\x03\x02\x02\x02\u02C8\u02BB\x03\x02\x02\x02\u02C9" +
		"7\x03\x02\x02\x02\u02CA\u02CB\x07A\x02\x02\u02CB\u02CC\x07A\x02\x02\u02CC" +
		"\u02CF\x05<\x1F\x02\u02CD\u02CE\x07\n\x02\x02\u02CE\u02D0\x05<\x1F\x02" +
		"\u02CF\u02CD\x03\x02\x02\x02\u02D0\u02D1\x03\x02\x02\x02\u02D1\u02CF\x03" +
		"\x02\x02\x02\u02D1\u02D2\x03\x02\x02\x02\u02D2\u02D3\x03\x02\x02\x02\u02D3" +
		"\u02D4\x07B\x02\x02\u02D4\u02D5\x07B\x02\x02\u02D5\u02D6\x07\x1B\x02\x02" +
		"\u02D6\u02D7\x05*\x16\x02\u02D79\x03\x02\x02\x02\u02D8\u02DB\x07\'\x02" +
		"\x02\u02D9\u02DB\x05L\'\x02\u02DA\u02D8\x03\x02\x02\x02\u02DA\u02D9\x03" +
		"\x02\x02\x02\u02DB;\x03\x02\x02\x02\u02DC\u02DD\x05:\x1E\x02\u02DD=\x03" +
		"\x02\x02\x02\u02DE\u02E1\x077\x02\x02\u02DF\u02E1\x05L\'\x02\u02E0\u02DE" +
		"\x03\x02\x02\x02\u02E0\u02DF\x03\x02\x02\x02\u02E1?\x03\x02\x02\x02\u02E2" +
		"\u02E7\x05*\x16\x02\u02E3\u02E4\x07\n\x02\x02\u02E4\u02E6\x05*\x16\x02" +
		"\u02E5\u02E3\x03\x02\x02\x02\u02E6\u02E9\x03\x02\x02\x02\u02E7\u02E5\x03" +
		"\x02\x02\x02\u02E7\u02E8\x03\x02\x02\x02\u02E8A\x03\x02\x02\x02\u02E9" +
		"\u02E7\x03\x02\x02\x02\u02EA\u02EB\x05N(\x02\u02EB\u02EC\x07\b\x02\x02" +
		"\u02EC\u02ED\x05*\x16\x02\u02ED\u02F1\x03\x02\x02\x02\u02EE\u02EF\x07" +
		"(\x02\x02\u02EF\u02F1\x05*\x16\x02\u02F0\u02EA\x03\x02\x02\x02\u02F0\u02EE" +
		"\x03\x02\x02\x02\u02F1C\x03\x02\x02\x02\u02F2\u02F5\x05L\'\x02\u02F3\u02F5" +
		"\t\x05\x02\x02\u02F4\u02F2\x03\x02\x02\x02\u02F4\u02F3\x03\x02\x02\x02" +
		"\u02F5E\x03\x02\x02\x02\u02F6\u02F9\x05L\'\x02\u02F7\u02F9\t\x06\x02\x02" +
		"\u02F8\u02F6\x03\x02\x02\x02\u02F8\u02F7\x03\x02\x02\x02\u02F9G\x03\x02" +
		"\x02\x02\u02FA\u02FB\t\x07\x02\x02\u02FBI\x03\x02\x02\x02\u02FC\u02FD" +
		"\t\b\x02\x02\u02FDK\x03\x02\x02\x02\u02FE\u0303\x07C\x02\x02\u02FF\u0300" +
		"\x07)\x02\x02\u0300\u0302\x07C\x02\x02\u0301\u02FF\x03\x02\x02\x02\u0302" +
		"\u0305\x03\x02\x02\x02\u0303\u0301\x03\x02\x02\x02\u0303\u0304\x03\x02" +
		"\x02\x02\u0304M\x03\x02\x02\x02\u0305\u0303\x03\x02\x02\x02\u0306\u030B" +
		"\x07C\x02\x02\u0307\u0308\x05L\'\x02\u0308\u0309\b(\x01\x02\u0309\u030B" +
		"\x03\x02\x02\x02\u030A\u0306\x03\x02\x02\x02\u030A\u0307\x03\x02\x02\x02" +
		"\u030BO\x03\x02\x02\x02\u030C\u030D\x07\x02\x02\x03\u030DQ\x03\x02\x02" +
		"\x02XU\\ek\x83\x8B\x95\x98\x9D\xAC\xB3\xB7\xBA\xC7\xCE\xD1\xD8\xDE\xE3" +
		"\xEE\xF6\xFC\u0100\u0102\u010D\u010F\u011E\u0126\u0135\u013D\u013F\u0150" +
		"\u0153\u0156\u016D\u0171\u017C\u0186\u018E\u0190\u019A\u019D\u01A8\u01B2" +
		"\u01B4\u01B8\u01C1\u01D3\u01D7\u01E2\u01E6\u01F2\u01F6\u0201\u0205\u020D" +
		"\u0217\u021B\u0225\u0229\u0233\u0236\u0239\u0252\u0279\u027C\u0283\u0285" +
		"\u028C\u0293\u029A\u02A3\u02A6\u02B1\u02B5\u02C1\u02C8\u02D1\u02DA\u02E0" +
		"\u02E7\u02F0\u02F4\u02F8\u0303\u030A";
	public static readonly _serializedATN: string = Utils.join(
		[
			QuintErrorsParser._serializedATNSegment0,
			QuintErrorsParser._serializedATNSegment1,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!QuintErrorsParser.__ATN) {
			QuintErrorsParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(QuintErrorsParser._serializedATN));
		}

		return QuintErrorsParser.__ATN;
	}

}

export class ModulesContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(QuintErrorsParser.EOF, 0); }
	public module(): ModuleContext[];
	public module(i: number): ModuleContext;
	public module(i?: number): ModuleContext | ModuleContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModuleContext);
		} else {
			return this.getRuleContext(i, ModuleContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_modules; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterModules) {
			listener.enterModules(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitModules) {
			listener.exitModules(this);
		}
	}
}


export class ModuleContext extends ParserRuleContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	public DOCCOMMENT(): TerminalNode[];
	public DOCCOMMENT(i: number): TerminalNode;
	public DOCCOMMENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QuintErrorsParser.DOCCOMMENT);
		} else {
			return this.getToken(QuintErrorsParser.DOCCOMMENT, i);
		}
	}
	public declaration(): DeclarationContext[];
	public declaration(i: number): DeclarationContext;
	public declaration(i?: number): DeclarationContext | DeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationContext);
		} else {
			return this.getRuleContext(i, DeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_module; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterModule) {
			listener.enterModule(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitModule) {
			listener.exitModule(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	public constDef(): ConstDefContext | undefined {
		return this.tryGetRuleContext(0, ConstDefContext);
	}
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public identOrHole(): IdentOrHoleContext | undefined {
		return this.tryGetRuleContext(0, IdentOrHoleContext);
	}
	public ASGN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.ASGN, 0); }
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public instanceMod(): InstanceModContext | undefined {
		return this.tryGetRuleContext(0, InstanceModContext);
	}
	public operDef(): OperDefContext | undefined {
		return this.tryGetRuleContext(0, OperDefContext);
	}
	public typeDef(): TypeDefContext | undefined {
		return this.tryGetRuleContext(0, TypeDefContext);
	}
	public importMod(): ImportModContext | undefined {
		return this.tryGetRuleContext(0, ImportModContext);
	}
	public exportMod(): ExportModContext | undefined {
		return this.tryGetRuleContext(0, ExportModContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_declaration; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterDeclaration) {
			listener.enterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitDeclaration) {
			listener.exitDeclaration(this);
		}
	}
}


export class ConstDefContext extends ParserRuleContext {
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_constDef; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterConstDef) {
			listener.enterConstDef(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitConstDef) {
			listener.exitConstDef(this);
		}
	}
}


export class OperDefContext extends ParserRuleContext {
	public qualifier(): QualifierContext {
		return this.getRuleContext(0, QualifierContext);
	}
	public normalCallName(): NormalCallNameContext {
		return this.getRuleContext(0, NormalCallNameContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.RPAREN, 0); }
	public type(): TypeContext[];
	public type(i: number): TypeContext;
	public type(i?: number): TypeContext | TypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeContext);
		} else {
			return this.getRuleContext(i, TypeContext);
		}
	}
	public ASGN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.ASGN, 0); }
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_operDef; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterOperDef) {
			listener.enterOperDef(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitOperDef) {
			listener.exitOperDef(this);
		}
	}
}


export class TypeDefContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_typeDef; }
	public copyFrom(ctx: TypeDefContext): void {
		super.copyFrom(ctx);
	}
}
export class TypeAbstractDefContext extends TypeDefContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	constructor(ctx: TypeDefContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeAbstractDef) {
			listener.enterTypeAbstractDef(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeAbstractDef) {
			listener.exitTypeAbstractDef(this);
		}
	}
}
export class TypeAliasDefContext extends TypeDefContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	public ASGN(): TerminalNode { return this.getToken(QuintErrorsParser.ASGN, 0); }
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	constructor(ctx: TypeDefContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeAliasDef) {
			listener.enterTypeAliasDef(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeAliasDef) {
			listener.exitTypeAliasDef(this);
		}
	}
}
export class TypeSumDefContext extends TypeDefContext {
	public _typeName!: QualIdContext;
	public ASGN(): TerminalNode { return this.getToken(QuintErrorsParser.ASGN, 0); }
	public typeSumVariant(): TypeSumVariantContext[];
	public typeSumVariant(i: number): TypeSumVariantContext;
	public typeSumVariant(i?: number): TypeSumVariantContext | TypeSumVariantContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeSumVariantContext);
		} else {
			return this.getRuleContext(i, TypeSumVariantContext);
		}
	}
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	constructor(ctx: TypeDefContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeSumDef) {
			listener.enterTypeSumDef(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeSumDef) {
			listener.exitTypeSumDef(this);
		}
	}
}


export class TypeSumVariantContext extends ParserRuleContext {
	public _sumLabel!: SimpleIdContext;
	public simpleId(): SimpleIdContext {
		return this.getRuleContext(0, SimpleIdContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LPAREN, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_typeSumVariant; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeSumVariant) {
			listener.enterTypeSumVariant(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeSumVariant) {
			listener.exitTypeSumVariant(this);
		}
	}
}


export class NondetOperDefContext extends ParserRuleContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	public ASGN(): TerminalNode { return this.getToken(QuintErrorsParser.ASGN, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_nondetOperDef; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterNondetOperDef) {
			listener.enterNondetOperDef(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitNondetOperDef) {
			listener.exitNondetOperDef(this);
		}
	}
}


export class QualifierContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_qualifier; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterQualifier) {
			listener.enterQualifier(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitQualifier) {
			listener.exitQualifier(this);
		}
	}
}


export class ImportModContext extends ParserRuleContext {
	public name(): NameContext[];
	public name(i: number): NameContext;
	public name(i?: number): NameContext | NameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NameContext);
		} else {
			return this.getRuleContext(i, NameContext);
		}
	}
	public identOrStar(): IdentOrStarContext | undefined {
		return this.tryGetRuleContext(0, IdentOrStarContext);
	}
	public fromSource(): FromSourceContext | undefined {
		return this.tryGetRuleContext(0, FromSourceContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_importMod; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterImportMod) {
			listener.enterImportMod(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitImportMod) {
			listener.exitImportMod(this);
		}
	}
}


export class ExportModContext extends ParserRuleContext {
	public name(): NameContext[];
	public name(i: number): NameContext;
	public name(i?: number): NameContext | NameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NameContext);
		} else {
			return this.getRuleContext(i, NameContext);
		}
	}
	public identOrStar(): IdentOrStarContext | undefined {
		return this.tryGetRuleContext(0, IdentOrStarContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_exportMod; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterExportMod) {
			listener.enterExportMod(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitExportMod) {
			listener.exitExportMod(this);
		}
	}
}


export class InstanceModContext extends ParserRuleContext {
	public moduleName(): ModuleNameContext {
		return this.getRuleContext(0, ModuleNameContext);
	}
	public LPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.RPAREN, 0); }
	public MUL(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MUL, 0); }
	public name(): NameContext[];
	public name(i: number): NameContext;
	public name(i?: number): NameContext | NameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NameContext);
		} else {
			return this.getRuleContext(i, NameContext);
		}
	}
	public ASGN(): TerminalNode[];
	public ASGN(i: number): TerminalNode;
	public ASGN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QuintErrorsParser.ASGN);
		} else {
			return this.getToken(QuintErrorsParser.ASGN, i);
		}
	}
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public fromSource(): FromSourceContext | undefined {
		return this.tryGetRuleContext(0, FromSourceContext);
	}
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_instanceMod; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterInstanceMod) {
			listener.enterInstanceMod(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitInstanceMod) {
			listener.exitInstanceMod(this);
		}
	}
}


export class ModuleNameContext extends ParserRuleContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_moduleName; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterModuleName) {
			listener.enterModuleName(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitModuleName) {
			listener.exitModuleName(this);
		}
	}
}


export class NameContext extends ParserRuleContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_name; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterName) {
			listener.enterName(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitName) {
			listener.exitName(this);
		}
	}
}


export class QualifiedNameContext extends ParserRuleContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_qualifiedName; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterQualifiedName) {
			listener.enterQualifiedName(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitQualifiedName) {
			listener.exitQualifiedName(this);
		}
	}
}


export class FromSourceContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(QuintErrorsParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_fromSource; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterFromSource) {
			listener.enterFromSource(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitFromSource) {
			listener.exitFromSource(this);
		}
	}
}


export class TypeContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_type; }
	public copyFrom(ctx: TypeContext): void {
		super.copyFrom(ctx);
	}
}
export class TypeFunContext extends TypeContext {
	public type(): TypeContext[];
	public type(i: number): TypeContext;
	public type(i?: number): TypeContext | TypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeContext);
		} else {
			return this.getRuleContext(i, TypeContext);
		}
	}
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeFun) {
			listener.enterTypeFun(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeFun) {
			listener.exitTypeFun(this);
		}
	}
}
export class TypeOperContext extends TypeContext {
	public type(): TypeContext[];
	public type(i: number): TypeContext;
	public type(i?: number): TypeContext | TypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeContext);
		} else {
			return this.getRuleContext(i, TypeContext);
		}
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.RPAREN, 0); }
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeOper) {
			listener.enterTypeOper(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeOper) {
			listener.exitTypeOper(this);
		}
	}
}
export class TypeSetContext extends TypeContext {
	public SET(): TerminalNode { return this.getToken(QuintErrorsParser.SET, 0); }
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeSet) {
			listener.enterTypeSet(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeSet) {
			listener.exitTypeSet(this);
		}
	}
}
export class TypeListContext extends TypeContext {
	public LIST(): TerminalNode { return this.getToken(QuintErrorsParser.LIST, 0); }
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeList) {
			listener.enterTypeList(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeList) {
			listener.exitTypeList(this);
		}
	}
}
export class TypeTupleContext extends TypeContext {
	public LPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.LPAREN, 0); }
	public type(): TypeContext[];
	public type(i: number): TypeContext;
	public type(i?: number): TypeContext | TypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeContext);
		} else {
			return this.getRuleContext(i, TypeContext);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.RPAREN, 0); }
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeTuple) {
			listener.enterTypeTuple(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeTuple) {
			listener.exitTypeTuple(this);
		}
	}
}
export class TypeRecContext extends TypeContext {
	public row(): RowContext {
		return this.getRuleContext(0, RowContext);
	}
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeRec) {
			listener.enterTypeRec(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeRec) {
			listener.exitTypeRec(this);
		}
	}
}
export class TypeUnionRecContext extends TypeContext {
	public typeUnionRecOne(): TypeUnionRecOneContext[];
	public typeUnionRecOne(i: number): TypeUnionRecOneContext;
	public typeUnionRecOne(i?: number): TypeUnionRecOneContext | TypeUnionRecOneContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeUnionRecOneContext);
		} else {
			return this.getRuleContext(i, TypeUnionRecOneContext);
		}
	}
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeUnionRec) {
			listener.enterTypeUnionRec(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeUnionRec) {
			listener.exitTypeUnionRec(this);
		}
	}
}
export class TypeIntContext extends TypeContext {
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeInt) {
			listener.enterTypeInt(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeInt) {
			listener.exitTypeInt(this);
		}
	}
}
export class TypeStrContext extends TypeContext {
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeStr) {
			listener.enterTypeStr(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeStr) {
			listener.exitTypeStr(this);
		}
	}
}
export class TypeBoolContext extends TypeContext {
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeBool) {
			listener.enterTypeBool(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeBool) {
			listener.exitTypeBool(this);
		}
	}
}
export class TypeConstOrVarContext extends TypeContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeConstOrVar) {
			listener.enterTypeConstOrVar(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeConstOrVar) {
			listener.exitTypeConstOrVar(this);
		}
	}
}
export class TypeParenContext extends TypeContext {
	public LPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.LPAREN, 0); }
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.RPAREN, 0); }
	constructor(ctx: TypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeParen) {
			listener.enterTypeParen(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeParen) {
			listener.exitTypeParen(this);
		}
	}
}


export class TypeUnionRecOneContext extends ParserRuleContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	public STRING(): TerminalNode { return this.getToken(QuintErrorsParser.STRING, 0); }
	public row(): RowContext | undefined {
		return this.tryGetRuleContext(0, RowContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_typeUnionRecOne; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTypeUnionRecOne) {
			listener.enterTypeUnionRecOne(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTypeUnionRecOne) {
			listener.exitTypeUnionRecOne(this);
		}
	}
}


export class RowContext extends ParserRuleContext {
	public _rowVar!: Token;
	public rowLabel(): RowLabelContext[];
	public rowLabel(i: number): RowLabelContext;
	public rowLabel(i?: number): RowLabelContext | RowLabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RowLabelContext);
		} else {
			return this.getRuleContext(i, RowLabelContext);
		}
	}
	public type(): TypeContext[];
	public type(i: number): TypeContext;
	public type(i?: number): TypeContext | TypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeContext);
		} else {
			return this.getRuleContext(i, TypeContext);
		}
	}
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IDENTIFIER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_row; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterRow) {
			listener.enterRow(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitRow) {
			listener.exitRow(this);
		}
	}
}


export class RowLabelContext extends ParserRuleContext {
	public simpleId(): SimpleIdContext {
		return this.getRuleContext(0, SimpleIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_rowLabel; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterRowLabel) {
			listener.enterRowLabel(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitRowLabel) {
			listener.exitRowLabel(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_expr; }
	public copyFrom(ctx: ExprContext): void {
		super.copyFrom(ctx);
	}
}
export class DotCallContext extends ExprContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public nameAfterDot(): NameAfterDotContext {
		return this.getRuleContext(0, NameAfterDotContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.RPAREN, 0); }
	public argList(): ArgListContext | undefined {
		return this.tryGetRuleContext(0, ArgListContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterDotCall) {
			listener.enterDotCall(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitDotCall) {
			listener.exitDotCall(this);
		}
	}
}
export class LambdaConsContext extends ExprContext {
	public lambda(): LambdaContext {
		return this.getRuleContext(0, LambdaContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterLambdaCons) {
			listener.enterLambdaCons(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitLambdaCons) {
			listener.exitLambdaCons(this);
		}
	}
}
export class OperAppContext extends ExprContext {
	public normalCallName(): NormalCallNameContext {
		return this.getRuleContext(0, NormalCallNameContext);
	}
	public LPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.RPAREN, 0); }
	public argList(): ArgListContext | undefined {
		return this.tryGetRuleContext(0, ArgListContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterOperApp) {
			listener.enterOperApp(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitOperApp) {
			listener.exitOperApp(this);
		}
	}
}
export class ListAppContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterListApp) {
			listener.enterListApp(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitListApp) {
			listener.exitListApp(this);
		}
	}
}
export class PowContext extends ExprContext {
	public _op!: Token;
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterPow) {
			listener.enterPow(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitPow) {
			listener.exitPow(this);
		}
	}
}
export class UminusContext extends ExprContext {
	public MINUS(): TerminalNode { return this.getToken(QuintErrorsParser.MINUS, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterUminus) {
			listener.enterUminus(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitUminus) {
			listener.exitUminus(this);
		}
	}
}
export class MultDivContext extends ExprContext {
	public _op!: Token;
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public MUL(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MUL, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.DIV, 0); }
	public MOD(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MOD, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterMultDiv) {
			listener.enterMultDiv(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitMultDiv) {
			listener.exitMultDiv(this);
		}
	}
}
export class PlusMinusContext extends ExprContext {
	public _op!: Token;
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public PLUS(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.PLUS, 0); }
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MINUS, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterPlusMinus) {
			listener.enterPlusMinus(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitPlusMinus) {
			listener.exitPlusMinus(this);
		}
	}
}
export class RelationsContext extends ExprContext {
	public _op!: Token;
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public GT(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.GT, 0); }
	public LT(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LT, 0); }
	public GE(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.GE, 0); }
	public LE(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LE, 0); }
	public NE(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.NE, 0); }
	public EQ(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.EQ, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterRelations) {
			listener.enterRelations(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitRelations) {
			listener.exitRelations(this);
		}
	}
}
export class AsgnContext extends ExprContext {
	public qualId(): QualIdContext {
		return this.getRuleContext(0, QualIdContext);
	}
	public ASGN(): TerminalNode { return this.getToken(QuintErrorsParser.ASGN, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterAsgn) {
			listener.enterAsgn(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitAsgn) {
			listener.exitAsgn(this);
		}
	}
}
export class ErrorEqContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public ASGN(): TerminalNode { return this.getToken(QuintErrorsParser.ASGN, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterErrorEq) {
			listener.enterErrorEq(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitErrorEq) {
			listener.exitErrorEq(this);
		}
	}
}
export class AndExprContext extends ExprContext {
	public AND(): TerminalNode { return this.getToken(QuintErrorsParser.AND, 0); }
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterAndExpr) {
			listener.enterAndExpr(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitAndExpr) {
			listener.exitAndExpr(this);
		}
	}
}
export class AndContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public AND(): TerminalNode { return this.getToken(QuintErrorsParser.AND, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterAnd) {
			listener.enterAnd(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitAnd) {
			listener.exitAnd(this);
		}
	}
}
export class OrExprContext extends ExprContext {
	public OR(): TerminalNode { return this.getToken(QuintErrorsParser.OR, 0); }
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterOrExpr) {
			listener.enterOrExpr(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitOrExpr) {
			listener.exitOrExpr(this);
		}
	}
}
export class OrContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public OR(): TerminalNode { return this.getToken(QuintErrorsParser.OR, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterOr) {
			listener.enterOr(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitOr) {
			listener.exitOr(this);
		}
	}
}
export class IffContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public IFF(): TerminalNode { return this.getToken(QuintErrorsParser.IFF, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterIff) {
			listener.enterIff(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitIff) {
			listener.exitIff(this);
		}
	}
}
export class ImpliesContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public IMPLIES(): TerminalNode { return this.getToken(QuintErrorsParser.IMPLIES, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterImplies) {
			listener.enterImplies(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitImplies) {
			listener.exitImplies(this);
		}
	}
}
export class MatchContext extends ExprContext {
	public matchSumExpr(): MatchSumExprContext {
		return this.getRuleContext(0, MatchSumExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterMatch) {
			listener.enterMatch(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitMatch) {
			listener.exitMatch(this);
		}
	}
}
export class ActionAllContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterActionAll) {
			listener.enterActionAll(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitActionAll) {
			listener.exitActionAll(this);
		}
	}
}
export class ActionAnyContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterActionAny) {
			listener.enterActionAny(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitActionAny) {
			listener.exitActionAny(this);
		}
	}
}
export class LiteralOrIdContext extends ExprContext {
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	public INT(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.INT, 0); }
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.BOOL, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.STRING, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterLiteralOrId) {
			listener.enterLiteralOrId(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitLiteralOrId) {
			listener.exitLiteralOrId(this);
		}
	}
}
export class TupleContext extends ExprContext {
	public LPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.LPAREN, 0); }
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.RPAREN, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterTuple) {
			listener.enterTuple(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitTuple) {
			listener.exitTuple(this);
		}
	}
}
export class PairContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterPair) {
			listener.enterPair(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitPair) {
			listener.exitPair(this);
		}
	}
}
export class RecordContext extends ExprContext {
	public recElem(): RecElemContext[];
	public recElem(i: number): RecElemContext;
	public recElem(i?: number): RecElemContext | RecElemContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RecElemContext);
		} else {
			return this.getRuleContext(i, RecElemContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterRecord) {
			listener.enterRecord(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitRecord) {
			listener.exitRecord(this);
		}
	}
}
export class ListContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterList) {
			listener.enterList(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitList) {
			listener.exitList(this);
		}
	}
}
export class IfElseContext extends ExprContext {
	public LPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.LPAREN, 0); }
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.RPAREN, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterIfElse) {
			listener.enterIfElse(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitIfElse) {
			listener.exitIfElse(this);
		}
	}
}
export class LetInContext extends ExprContext {
	public operDef(): OperDefContext {
		return this.getRuleContext(0, OperDefContext);
	}
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterLetIn) {
			listener.enterLetIn(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitLetIn) {
			listener.exitLetIn(this);
		}
	}
}
export class NondetContext extends ExprContext {
	public nondetOperDef(): NondetOperDefContext {
		return this.getRuleContext(0, NondetOperDefContext);
	}
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterNondet) {
			listener.enterNondet(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitNondet) {
			listener.exitNondet(this);
		}
	}
}
export class ParenContext extends ExprContext {
	public LPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.LPAREN, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(QuintErrorsParser.RPAREN, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterParen) {
			listener.enterParen(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitParen) {
			listener.exitParen(this);
		}
	}
}
export class BracesContext extends ExprContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterBraces) {
			listener.enterBraces(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitBraces) {
			listener.exitBraces(this);
		}
	}
}


export class MatchSumExprContext extends ParserRuleContext {
	public _matchSumCase!: MatchSumCaseContext;
	public _matchCase: MatchSumCaseContext[] = [];
	public MATCH(): TerminalNode { return this.getToken(QuintErrorsParser.MATCH, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public matchSumCase(): MatchSumCaseContext[];
	public matchSumCase(i: number): MatchSumCaseContext;
	public matchSumCase(i?: number): MatchSumCaseContext | MatchSumCaseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MatchSumCaseContext);
		} else {
			return this.getRuleContext(i, MatchSumCaseContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_matchSumExpr; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterMatchSumExpr) {
			listener.enterMatchSumExpr(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitMatchSumExpr) {
			listener.exitMatchSumExpr(this);
		}
	}
}


export class MatchSumCaseContext extends ParserRuleContext {
	public _variantMatch!: MatchSumVariantContext;
	public _wildCardMatch!: Token;
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public matchSumVariant(): MatchSumVariantContext | undefined {
		return this.tryGetRuleContext(0, MatchSumVariantContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_matchSumCase; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterMatchSumCase) {
			listener.enterMatchSumCase(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitMatchSumCase) {
			listener.exitMatchSumCase(this);
		}
	}
}


export class MatchSumVariantContext extends ParserRuleContext {
	public _variantLabel!: SimpleIdContext;
	public _variantParam!: SimpleIdContext;
	public simpleId(): SimpleIdContext[];
	public simpleId(i: number): SimpleIdContext;
	public simpleId(i?: number): SimpleIdContext | SimpleIdContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SimpleIdContext);
		} else {
			return this.getRuleContext(i, SimpleIdContext);
		}
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_matchSumVariant; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterMatchSumVariant) {
			listener.enterMatchSumVariant(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitMatchSumVariant) {
			listener.exitMatchSumVariant(this);
		}
	}
}


export class DeclarationOrExprContext extends ParserRuleContext {
	public declaration(): DeclarationContext | undefined {
		return this.tryGetRuleContext(0, DeclarationContext);
	}
	public EOF(): TerminalNode { return this.getToken(QuintErrorsParser.EOF, 0); }
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public DOCCOMMENT(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.DOCCOMMENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_declarationOrExpr; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterDeclarationOrExpr) {
			listener.enterDeclarationOrExpr(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitDeclarationOrExpr) {
			listener.exitDeclarationOrExpr(this);
		}
	}
}


export class LambdaContext extends ParserRuleContext {
	public lambdaUnsugared(): LambdaUnsugaredContext | undefined {
		return this.tryGetRuleContext(0, LambdaUnsugaredContext);
	}
	public lambdaTupleSugar(): LambdaTupleSugarContext | undefined {
		return this.tryGetRuleContext(0, LambdaTupleSugarContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_lambda; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterLambda) {
			listener.enterLambda(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitLambda) {
			listener.exitLambda(this);
		}
	}
}


export class LambdaUnsugaredContext extends ParserRuleContext {
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_lambdaUnsugared; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterLambdaUnsugared) {
			listener.enterLambdaUnsugared(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitLambdaUnsugared) {
			listener.exitLambdaUnsugared(this);
		}
	}
}


export class LambdaTupleSugarContext extends ParserRuleContext {
	public LPAREN(): TerminalNode[];
	public LPAREN(i: number): TerminalNode;
	public LPAREN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QuintErrorsParser.LPAREN);
		} else {
			return this.getToken(QuintErrorsParser.LPAREN, i);
		}
	}
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	public RPAREN(): TerminalNode[];
	public RPAREN(i: number): TerminalNode;
	public RPAREN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QuintErrorsParser.RPAREN);
		} else {
			return this.getToken(QuintErrorsParser.RPAREN, i);
		}
	}
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_lambdaTupleSugar; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterLambdaTupleSugar) {
			listener.enterLambdaTupleSugar(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitLambdaTupleSugar) {
			listener.exitLambdaTupleSugar(this);
		}
	}
}


export class IdentOrHoleContext extends ParserRuleContext {
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_identOrHole; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterIdentOrHole) {
			listener.enterIdentOrHole(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitIdentOrHole) {
			listener.exitIdentOrHole(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	public identOrHole(): IdentOrHoleContext {
		return this.getRuleContext(0, IdentOrHoleContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_parameter; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterParameter) {
			listener.enterParameter(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitParameter) {
			listener.exitParameter(this);
		}
	}
}


export class IdentOrStarContext extends ParserRuleContext {
	public MUL(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MUL, 0); }
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_identOrStar; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterIdentOrStar) {
			listener.enterIdentOrStar(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitIdentOrStar) {
			listener.exitIdentOrStar(this);
		}
	}
}


export class ArgListContext extends ParserRuleContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_argList; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterArgList) {
			listener.enterArgList(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitArgList) {
			listener.exitArgList(this);
		}
	}
}


export class RecElemContext extends ParserRuleContext {
	public simpleId(): SimpleIdContext | undefined {
		return this.tryGetRuleContext(0, SimpleIdContext);
	}
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_recElem; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterRecElem) {
			listener.enterRecElem(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitRecElem) {
			listener.exitRecElem(this);
		}
	}
}


export class NormalCallNameContext extends ParserRuleContext {
	public _op!: Token;
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	public AND(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.AND, 0); }
	public OR(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.OR, 0); }
	public IFF(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IFF, 0); }
	public IMPLIES(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IMPLIES, 0); }
	public SET(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.SET, 0); }
	public LIST(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LIST, 0); }
	public MAP(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MAP, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_normalCallName; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterNormalCallName) {
			listener.enterNormalCallName(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitNormalCallName) {
			listener.exitNormalCallName(this);
		}
	}
}


export class NameAfterDotContext extends ParserRuleContext {
	public _op!: Token;
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	public AND(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.AND, 0); }
	public OR(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.OR, 0); }
	public IFF(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IFF, 0); }
	public IMPLIES(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IMPLIES, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_nameAfterDot; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterNameAfterDot) {
			listener.enterNameAfterDot(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitNameAfterDot) {
			listener.exitNameAfterDot(this);
		}
	}
}


export class OperatorContext extends ParserRuleContext {
	public AND(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.AND, 0); }
	public OR(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.OR, 0); }
	public IFF(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IFF, 0); }
	public IMPLIES(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IMPLIES, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.GT, 0); }
	public LT(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LT, 0); }
	public GE(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.GE, 0); }
	public LE(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LE, 0); }
	public NE(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.NE, 0); }
	public EQ(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.EQ, 0); }
	public MUL(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MUL, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.DIV, 0); }
	public MOD(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MOD, 0); }
	public PLUS(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.PLUS, 0); }
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MINUS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_operator; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterOperator) {
			listener.enterOperator(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitOperator) {
			listener.exitOperator(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	public STRING(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.STRING, 0); }
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.BOOL, 0); }
	public INT(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.INT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_literal; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterLiteral) {
			listener.enterLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitLiteral) {
			listener.exitLiteral(this);
		}
	}
}


export class QualIdContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode[];
	public IDENTIFIER(i: number): TerminalNode;
	public IDENTIFIER(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QuintErrorsParser.IDENTIFIER);
		} else {
			return this.getToken(QuintErrorsParser.IDENTIFIER, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_qualId; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterQualId) {
			listener.enterQualId(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitQualId) {
			listener.exitQualId(this);
		}
	}
}


export class SimpleIdContext extends ParserRuleContext {
	public context: string;
	public _qualId!: QualIdContext;
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.IDENTIFIER, 0); }
	public qualId(): QualIdContext | undefined {
		return this.tryGetRuleContext(0, QualIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number, context: string) {
		super(parent, invokingState);
		this.context = context;
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_simpleId; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterSimpleId) {
			listener.enterSimpleId(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitSimpleId) {
			listener.exitSimpleId(this);
		}
	}
}


export class EmptyContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(QuintErrorsParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_empty; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterEmpty) {
			listener.enterEmpty(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitEmpty) {
			listener.exitEmpty(this);
		}
	}
}


