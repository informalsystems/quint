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
	public static readonly RULE_importOrInstance = 9;
	public static readonly RULE_exportMod = 10;
	public static readonly RULE_moduleName = 11;
	public static readonly RULE_name = 12;
	public static readonly RULE_qualifiedName = 13;
	public static readonly RULE_fromSource = 14;
	public static readonly RULE_type = 15;
	public static readonly RULE_typeUnionRecOne = 16;
	public static readonly RULE_row = 17;
	public static readonly RULE_rowLabel = 18;
	public static readonly RULE_expr = 19;
	public static readonly RULE_matchSumExpr = 20;
	public static readonly RULE_matchSumCase = 21;
	public static readonly RULE_matchSumVariant = 22;
	public static readonly RULE_declarationOrExpr = 23;
	public static readonly RULE_lambda = 24;
	public static readonly RULE_lambdaUnsugared = 25;
	public static readonly RULE_lambdaTupleSugar = 26;
	public static readonly RULE_identOrHole = 27;
	public static readonly RULE_parameter = 28;
	public static readonly RULE_identOrStar = 29;
	public static readonly RULE_argList = 30;
	public static readonly RULE_recElem = 31;
	public static readonly RULE_normalCallName = 32;
	public static readonly RULE_nameAfterDot = 33;
	public static readonly RULE_operator = 34;
	public static readonly RULE_literal = 35;
	public static readonly RULE_qualId = 36;
	public static readonly RULE_simpleId = 37;
	public static readonly RULE_empty = 38;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"modules", "module", "declaration", "constDef", "operDef", "typeDef", 
		"typeSumVariant", "nondetOperDef", "qualifier", "importOrInstance", "exportMod", 
		"moduleName", "name", "qualifiedName", "fromSource", "type", "typeUnionRecOne", 
		"row", "rowLabel", "expr", "matchSumExpr", "matchSumCase", "matchSumVariant", 
		"declarationOrExpr", "lambda", "lambdaUnsugared", "lambdaTupleSugar", 
		"identOrHole", "parameter", "identOrStar", "argList", "recElem", "normalCallName", 
		"nameAfterDot", "operator", "literal", "qualId", "simpleId", "empty",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'module'", "'{'", "'}'", "'const'", "'var'", "':'", "'assume'", 
		"'import'", "'export'", "','", "';'", "'type'", "'|'", "'nondet'", "'val'", 
		"'def'", "'pure'", "'action'", "'run'", "'temporal'", "'.'", "'from'", 
		"'as'", "'->'", "'=>'", "'['", "']'", "'int'", "'str'", "'bool'", "'^'", 
		"'''", "'all'", "'any'", "'if'", "'else'", "'_'", "'...'", "'::'", undefined, 
		undefined, undefined, "'and'", "'or'", "'iff'", "'implies'", "'Set'", 
		"'List'", "'Map'", "'match'", "'+'", "'-'", "'*'", "'/'", "'%'", "'>'", 
		"'<'", "'>='", "'<='", "'!='", "'=='", "'='", "'('", "')'",
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
			this.state = 79;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 78;
				this.module();
				}
				}
				this.state = 81;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === QuintErrorsParser.T__0 || _la === QuintErrorsParser.DOCCOMMENT);
			this.state = 83;
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
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 88;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === QuintErrorsParser.DOCCOMMENT) {
				{
				{
				this.state = 85;
				this.match(QuintErrorsParser.DOCCOMMENT);
				}
				}
				this.state = 90;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 91;
			this.match(QuintErrorsParser.T__0);
			this.state = 92;
			this.qualId();
			this.state = 93;
			this.match(QuintErrorsParser.T__1);
			this.state = 103;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QuintErrorsParser.T__3) | (1 << QuintErrorsParser.T__4) | (1 << QuintErrorsParser.T__6) | (1 << QuintErrorsParser.T__7) | (1 << QuintErrorsParser.T__8) | (1 << QuintErrorsParser.T__11) | (1 << QuintErrorsParser.T__14) | (1 << QuintErrorsParser.T__15) | (1 << QuintErrorsParser.T__16) | (1 << QuintErrorsParser.T__17) | (1 << QuintErrorsParser.T__18) | (1 << QuintErrorsParser.T__19))) !== 0) || _la === QuintErrorsParser.DOCCOMMENT) {
				{
				{
				this.state = 97;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.DOCCOMMENT) {
					{
					{
					this.state = 94;
					this.match(QuintErrorsParser.DOCCOMMENT);
					}
					}
					this.state = 99;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 100;
				this.declaration();
				}
				}
				this.state = 105;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 106;
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
			this.state = 126;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.T__3:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 108;
				this.match(QuintErrorsParser.T__3);
				this.state = 109;
				this.constDef();
				}
				break;
			case QuintErrorsParser.T__4:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 110;
				this.match(QuintErrorsParser.T__4);
				this.state = 111;
				this.qualId();
				this.state = 112;
				this.match(QuintErrorsParser.T__5);
				this.state = 113;
				this.type(0);
				}
				break;
			case QuintErrorsParser.T__6:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 115;
				this.match(QuintErrorsParser.T__6);
				this.state = 116;
				this.identOrHole();
				this.state = 117;
				this.match(QuintErrorsParser.ASGN);
				this.state = 118;
				this.expr(0);
				}
				break;
			case QuintErrorsParser.T__14:
			case QuintErrorsParser.T__15:
			case QuintErrorsParser.T__16:
			case QuintErrorsParser.T__17:
			case QuintErrorsParser.T__18:
			case QuintErrorsParser.T__19:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 120;
				this.operDef();
				}
				break;
			case QuintErrorsParser.T__11:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 121;
				this.typeDef();
				}
				break;
			case QuintErrorsParser.T__7:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 122;
				this.match(QuintErrorsParser.T__7);
				this.state = 123;
				this.importOrInstance();
				}
				break;
			case QuintErrorsParser.T__8:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 124;
				this.match(QuintErrorsParser.T__8);
				this.state = 125;
				this.exportMod();
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
	public constDef(): ConstDefContext {
		let _localctx: ConstDefContext = new ConstDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, QuintErrorsParser.RULE_constDef);
		try {
			this.state = 134;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 128;
				this.qualId();
				this.state = 129;
				this.match(QuintErrorsParser.T__5);
				this.state = 130;
				this.type(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 132;
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
			this.state = 136;
			this.qualifier();
			this.state = 137;
			this.normalCallName();
			this.state = 174;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				{
				this.state = 138;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 147;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__36 || _la === QuintErrorsParser.IDENTIFIER) {
					{
					this.state = 139;
					this.parameter();
					this.state = 144;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la === QuintErrorsParser.T__9) {
						{
						{
						this.state = 140;
						this.match(QuintErrorsParser.T__9);
						this.state = 141;
						this.parameter();
						}
						}
						this.state = 146;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					}
				}

				this.state = 149;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 152;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__5) {
					{
					this.state = 150;
					this.match(QuintErrorsParser.T__5);
					this.state = 151;
					this.type(0);
					}
				}

				}
				break;

			case 2:
				{
				this.state = 154;
				this.match(QuintErrorsParser.T__5);
				this.state = 155;
				this.type(0);
				}
				break;

			case 3:
				{
				this.state = 156;
				this.match(QuintErrorsParser.LPAREN);
				{
				this.state = 157;
				this.parameter();
				this.state = 158;
				this.match(QuintErrorsParser.T__5);
				this.state = 159;
				this.type(0);
				this.state = 167;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__9) {
					{
					{
					this.state = 160;
					this.match(QuintErrorsParser.T__9);
					this.state = 161;
					this.parameter();
					this.state = 162;
					this.match(QuintErrorsParser.T__5);
					this.state = 163;
					this.type(0);
					}
					}
					this.state = 169;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				this.state = 170;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 171;
				this.match(QuintErrorsParser.T__5);
				this.state = 172;
				this.type(0);
				}
				break;
			}
			this.state = 178;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.ASGN) {
				{
				this.state = 176;
				this.match(QuintErrorsParser.ASGN);
				this.state = 177;
				this.expr(0);
				}
			}

			this.state = 181;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__10) {
				{
				this.state = 180;
				this.match(QuintErrorsParser.T__10);
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
	public typeDef(): TypeDefContext {
		let _localctx: TypeDefContext = new TypeDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, QuintErrorsParser.RULE_typeDef);
		let _la: number;
		try {
			this.state = 204;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				_localctx = new TypeAbstractDefContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 183;
				this.match(QuintErrorsParser.T__11);
				this.state = 184;
				this.qualId();
				}
				break;

			case 2:
				_localctx = new TypeAliasDefContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 185;
				this.match(QuintErrorsParser.T__11);
				this.state = 186;
				this.qualId();
				this.state = 187;
				this.match(QuintErrorsParser.ASGN);
				this.state = 188;
				this.type(0);
				}
				break;

			case 3:
				_localctx = new TypeSumDefContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 190;
				this.match(QuintErrorsParser.T__11);
				this.state = 191;
				(_localctx as TypeSumDefContext)._typeName = this.qualId();
				this.state = 192;
				this.match(QuintErrorsParser.ASGN);
				this.state = 194;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__12) {
					{
					this.state = 193;
					this.match(QuintErrorsParser.T__12);
					}
				}

				this.state = 196;
				this.typeSumVariant();
				this.state = 201;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__12) {
					{
					{
					this.state = 197;
					this.match(QuintErrorsParser.T__12);
					this.state = 198;
					this.typeSumVariant();
					}
					}
					this.state = 203;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
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
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 206;
			_localctx._sumLabel = this.simpleId("variant label");
			this.state = 211;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.LPAREN) {
				{
				this.state = 207;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 208;
				this.type(0);
				this.state = 209;
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
	public nondetOperDef(): NondetOperDefContext {
		let _localctx: NondetOperDefContext = new NondetOperDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, QuintErrorsParser.RULE_nondetOperDef);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 213;
			this.match(QuintErrorsParser.T__13);
			this.state = 214;
			this.qualId();
			this.state = 217;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__5) {
				{
				this.state = 215;
				this.match(QuintErrorsParser.T__5);
				this.state = 216;
				this.type(0);
				}
			}

			this.state = 219;
			this.match(QuintErrorsParser.ASGN);
			this.state = 220;
			this.expr(0);
			this.state = 222;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__10) {
				{
				this.state = 221;
				this.match(QuintErrorsParser.T__10);
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
			this.state = 233;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 19, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 224;
				this.match(QuintErrorsParser.T__14);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 225;
				this.match(QuintErrorsParser.T__15);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 226;
				this.match(QuintErrorsParser.T__16);
				this.state = 227;
				this.match(QuintErrorsParser.T__14);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 228;
				this.match(QuintErrorsParser.T__16);
				this.state = 229;
				this.match(QuintErrorsParser.T__15);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 230;
				this.match(QuintErrorsParser.T__17);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 231;
				this.match(QuintErrorsParser.T__18);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 232;
				this.match(QuintErrorsParser.T__19);
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
	public importOrInstance(): ImportOrInstanceContext {
		let _localctx: ImportOrInstanceContext = new ImportOrInstanceContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, QuintErrorsParser.RULE_importOrInstance);
		let _la: number;
		try {
			this.state = 295;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 235;
				this.name();
				this.state = 236;
				this.match(QuintErrorsParser.T__20);
				this.state = 237;
				this.identOrStar();
				this.state = 240;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__21) {
					{
					this.state = 238;
					this.match(QuintErrorsParser.T__21);
					this.state = 239;
					this.fromSource();
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 242;
				this.name();
				this.state = 245;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__22) {
					{
					this.state = 243;
					this.match(QuintErrorsParser.T__22);
					this.state = 244;
					this.name();
					}
				}

				this.state = 249;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__21) {
					{
					this.state = 247;
					this.match(QuintErrorsParser.T__21);
					this.state = 248;
					this.fromSource();
					}
				}

				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 251;
				this.moduleName();
				this.state = 252;
				this.match(QuintErrorsParser.LPAREN);
				{
				this.state = 253;
				this.name();
				this.state = 254;
				this.match(QuintErrorsParser.ASGN);
				this.state = 255;
				this.expr(0);
				this.state = 263;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__9) {
					{
					{
					this.state = 256;
					this.match(QuintErrorsParser.T__9);
					this.state = 257;
					this.name();
					this.state = 258;
					this.match(QuintErrorsParser.ASGN);
					this.state = 259;
					this.expr(0);
					}
					}
					this.state = 265;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				this.state = 266;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 267;
				this.match(QuintErrorsParser.T__20);
				this.state = 268;
				this.match(QuintErrorsParser.MUL);
				this.state = 271;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__21) {
					{
					this.state = 269;
					this.match(QuintErrorsParser.T__21);
					this.state = 270;
					this.fromSource();
					}
				}

				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 273;
				this.moduleName();
				this.state = 274;
				this.match(QuintErrorsParser.LPAREN);
				{
				this.state = 275;
				this.name();
				this.state = 276;
				this.match(QuintErrorsParser.ASGN);
				this.state = 277;
				this.expr(0);
				this.state = 285;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__9) {
					{
					{
					this.state = 278;
					this.match(QuintErrorsParser.T__9);
					this.state = 279;
					this.name();
					this.state = 280;
					this.match(QuintErrorsParser.ASGN);
					this.state = 281;
					this.expr(0);
					}
					}
					this.state = 287;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				this.state = 288;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 289;
				this.match(QuintErrorsParser.T__22);
				this.state = 290;
				this.qualifiedName();
				this.state = 293;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__21) {
					{
					this.state = 291;
					this.match(QuintErrorsParser.T__21);
					this.state = 292;
					this.fromSource();
					}
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
		let _la: number;
		try {
			this.state = 306;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 29, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 297;
				this.name();
				this.state = 298;
				this.match(QuintErrorsParser.T__20);
				this.state = 299;
				this.identOrStar();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 301;
				this.name();
				this.state = 304;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__22) {
					{
					this.state = 302;
					this.match(QuintErrorsParser.T__22);
					this.state = 303;
					this.name();
					}
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
		this.enterRule(_localctx, 22, QuintErrorsParser.RULE_moduleName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 308;
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
		this.enterRule(_localctx, 24, QuintErrorsParser.RULE_name);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 310;
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
		this.enterRule(_localctx, 26, QuintErrorsParser.RULE_qualifiedName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 312;
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
		this.enterRule(_localctx, 28, QuintErrorsParser.RULE_fromSource);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 314;
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
		let _startState: number = 30;
		this.enterRecursionRule(_localctx, 30, QuintErrorsParser.RULE_type, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 377;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 36, this._ctx) ) {
			case 1:
				{
				_localctx = new TypeOperContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 317;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 326;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QuintErrorsParser.T__1) | (1 << QuintErrorsParser.T__12) | (1 << QuintErrorsParser.T__27) | (1 << QuintErrorsParser.T__28) | (1 << QuintErrorsParser.T__29))) !== 0) || ((((_la - 47)) & ~0x1F) === 0 && ((1 << (_la - 47)) & ((1 << (QuintErrorsParser.SET - 47)) | (1 << (QuintErrorsParser.LIST - 47)) | (1 << (QuintErrorsParser.LPAREN - 47)) | (1 << (QuintErrorsParser.IDENTIFIER - 47)))) !== 0)) {
					{
					this.state = 318;
					this.type(0);
					this.state = 323;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 30, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 319;
							this.match(QuintErrorsParser.T__9);
							this.state = 320;
							this.type(0);
							}
							}
						}
						this.state = 325;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 30, this._ctx);
					}
					}
				}

				this.state = 329;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 328;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 331;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 332;
				this.match(QuintErrorsParser.T__24);
				this.state = 333;
				this.type(11);
				}
				break;

			case 2:
				{
				_localctx = new TypeSetContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 334;
				this.match(QuintErrorsParser.SET);
				this.state = 335;
				this.match(QuintErrorsParser.T__25);
				this.state = 336;
				this.type(0);
				this.state = 337;
				this.match(QuintErrorsParser.T__26);
				}
				break;

			case 3:
				{
				_localctx = new TypeListContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 339;
				this.match(QuintErrorsParser.LIST);
				this.state = 340;
				this.match(QuintErrorsParser.T__25);
				this.state = 341;
				this.type(0);
				this.state = 342;
				this.match(QuintErrorsParser.T__26);
				}
				break;

			case 4:
				{
				_localctx = new TypeTupleContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 344;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 345;
				this.type(0);
				this.state = 346;
				this.match(QuintErrorsParser.T__9);
				this.state = 347;
				this.type(0);
				this.state = 352;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 33, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 348;
						this.match(QuintErrorsParser.T__9);
						this.state = 349;
						this.type(0);
						}
						}
					}
					this.state = 354;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 33, this._ctx);
				}
				this.state = 356;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 355;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 358;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 5:
				{
				_localctx = new TypeRecContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 360;
				this.match(QuintErrorsParser.T__1);
				this.state = 361;
				this.row();
				this.state = 362;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 6:
				{
				_localctx = new TypeUnionRecContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 365;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 364;
						this.typeUnionRecOne();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 367;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 35, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;

			case 7:
				{
				_localctx = new TypeIntContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 369;
				this.match(QuintErrorsParser.T__27);
				}
				break;

			case 8:
				{
				_localctx = new TypeStrContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 370;
				this.match(QuintErrorsParser.T__28);
				}
				break;

			case 9:
				{
				_localctx = new TypeBoolContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 371;
				this.match(QuintErrorsParser.T__29);
				}
				break;

			case 10:
				{
				_localctx = new TypeConstOrVarContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 372;
				this.qualId();
				}
				break;

			case 11:
				{
				_localctx = new TypeParenContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 373;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 374;
				this.type(0);
				this.state = 375;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 387;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 38, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 385;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 37, this._ctx) ) {
					case 1:
						{
						_localctx = new TypeFunContext(new TypeContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_type);
						this.state = 379;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 380;
						this.match(QuintErrorsParser.T__23);
						this.state = 381;
						this.type(13);
						}
						break;

					case 2:
						{
						_localctx = new TypeOperContext(new TypeContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_type);
						this.state = 382;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 383;
						this.match(QuintErrorsParser.T__24);
						this.state = 384;
						this.type(12);
						}
						break;
					}
					}
				}
				this.state = 389;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 38, this._ctx);
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
		this.enterRule(_localctx, 32, QuintErrorsParser.RULE_typeUnionRecOne);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 390;
			this.match(QuintErrorsParser.T__12);
			this.state = 391;
			this.match(QuintErrorsParser.T__1);
			this.state = 392;
			this.qualId();
			this.state = 393;
			this.match(QuintErrorsParser.T__5);
			this.state = 394;
			this.match(QuintErrorsParser.STRING);
			this.state = 397;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 39, this._ctx) ) {
			case 1:
				{
				this.state = 395;
				this.match(QuintErrorsParser.T__9);
				this.state = 396;
				this.row();
				}
				break;
			}
			this.state = 400;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__9) {
				{
				this.state = 399;
				this.match(QuintErrorsParser.T__9);
				}
			}

			this.state = 402;
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
		this.enterRule(_localctx, 34, QuintErrorsParser.RULE_row);
		let _la: number;
		try {
			let _alt: number;
			this.state = 427;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.T__2:
			case QuintErrorsParser.T__9:
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 411;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 41, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 404;
						this.rowLabel();
						this.state = 405;
						this.match(QuintErrorsParser.T__5);
						this.state = 406;
						this.type(0);
						this.state = 407;
						this.match(QuintErrorsParser.T__9);
						}
						}
					}
					this.state = 413;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 41, this._ctx);
				}
				this.state = 423;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.IDENTIFIER) {
					{
					{
					this.state = 414;
					this.rowLabel();
					this.state = 415;
					this.match(QuintErrorsParser.T__5);
					this.state = 416;
					this.type(0);
					}
					this.state = 421;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 42, this._ctx) ) {
					case 1:
						{
						this.state = 418;
						this.match(QuintErrorsParser.T__9);
						}
						break;

					case 2:
						{
						this.state = 419;
						this.match(QuintErrorsParser.T__12);
						{
						this.state = 420;
						_localctx._rowVar = this.match(QuintErrorsParser.IDENTIFIER);
						}
						}
						break;
					}
					}
				}

				}
				break;
			case QuintErrorsParser.T__12:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 425;
				this.match(QuintErrorsParser.T__12);
				{
				this.state = 426;
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
		this.enterRule(_localctx, 36, QuintErrorsParser.RULE_rowLabel);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 429;
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
		let _startState: number = 38;
		this.enterRecursionRule(_localctx, 38, QuintErrorsParser.RULE_expr, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 581;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 62, this._ctx) ) {
			case 1:
				{
				_localctx = new LambdaConsContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 432;
				this.lambda();
				}
				break;

			case 2:
				{
				_localctx = new OperAppContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 433;
				this.normalCallName();
				this.state = 434;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 436;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 2)) & ~0x1F) === 0 && ((1 << (_la - 2)) & ((1 << (QuintErrorsParser.T__1 - 2)) | (1 << (QuintErrorsParser.T__13 - 2)) | (1 << (QuintErrorsParser.T__14 - 2)) | (1 << (QuintErrorsParser.T__15 - 2)) | (1 << (QuintErrorsParser.T__16 - 2)) | (1 << (QuintErrorsParser.T__17 - 2)) | (1 << (QuintErrorsParser.T__18 - 2)) | (1 << (QuintErrorsParser.T__19 - 2)) | (1 << (QuintErrorsParser.T__25 - 2)) | (1 << (QuintErrorsParser.T__32 - 2)))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (QuintErrorsParser.T__33 - 34)) | (1 << (QuintErrorsParser.T__34 - 34)) | (1 << (QuintErrorsParser.T__36 - 34)) | (1 << (QuintErrorsParser.STRING - 34)) | (1 << (QuintErrorsParser.BOOL - 34)) | (1 << (QuintErrorsParser.INT - 34)) | (1 << (QuintErrorsParser.AND - 34)) | (1 << (QuintErrorsParser.OR - 34)) | (1 << (QuintErrorsParser.IFF - 34)) | (1 << (QuintErrorsParser.IMPLIES - 34)) | (1 << (QuintErrorsParser.SET - 34)) | (1 << (QuintErrorsParser.LIST - 34)) | (1 << (QuintErrorsParser.MAP - 34)) | (1 << (QuintErrorsParser.MATCH - 34)) | (1 << (QuintErrorsParser.MINUS - 34)) | (1 << (QuintErrorsParser.LPAREN - 34)) | (1 << (QuintErrorsParser.IDENTIFIER - 34)))) !== 0)) {
					{
					this.state = 435;
					this.argList();
					}
				}

				this.state = 438;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 3:
				{
				_localctx = new UminusContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 440;
				this.match(QuintErrorsParser.MINUS);
				this.state = 441;
				this.expr(25);
				}
				break;

			case 4:
				{
				_localctx = new AsgnContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 442;
				this.qualId();
				this.state = 443;
				this.match(QuintErrorsParser.T__31);
				this.state = 444;
				this.match(QuintErrorsParser.ASGN);
				this.state = 445;
				this.expr(21);
				}
				break;

			case 5:
				{
				_localctx = new AndExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 447;
				this.match(QuintErrorsParser.AND);
				this.state = 448;
				this.match(QuintErrorsParser.T__1);
				this.state = 449;
				this.expr(0);
				this.state = 454;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 46, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 450;
						this.match(QuintErrorsParser.T__9);
						this.state = 451;
						this.expr(0);
						}
						}
					}
					this.state = 456;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 46, this._ctx);
				}
				this.state = 458;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 457;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 460;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 6:
				{
				_localctx = new OrExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 462;
				this.match(QuintErrorsParser.OR);
				this.state = 463;
				this.match(QuintErrorsParser.T__1);
				this.state = 464;
				this.expr(0);
				this.state = 469;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 48, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 465;
						this.match(QuintErrorsParser.T__9);
						this.state = 466;
						this.expr(0);
						}
						}
					}
					this.state = 471;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 48, this._ctx);
				}
				this.state = 473;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 472;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 475;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 7:
				{
				_localctx = new MatchContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 477;
				this.matchSumExpr();
				}
				break;

			case 8:
				{
				_localctx = new ActionAllContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 478;
				this.match(QuintErrorsParser.T__32);
				this.state = 479;
				this.match(QuintErrorsParser.T__1);
				this.state = 480;
				this.expr(0);
				this.state = 485;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 50, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 481;
						this.match(QuintErrorsParser.T__9);
						this.state = 482;
						this.expr(0);
						}
						}
					}
					this.state = 487;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 50, this._ctx);
				}
				this.state = 489;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 488;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 491;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 9:
				{
				_localctx = new ActionAnyContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 493;
				this.match(QuintErrorsParser.T__33);
				this.state = 494;
				this.match(QuintErrorsParser.T__1);
				this.state = 495;
				this.expr(0);
				this.state = 500;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 52, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 496;
						this.match(QuintErrorsParser.T__9);
						this.state = 497;
						this.expr(0);
						}
						}
					}
					this.state = 502;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 52, this._ctx);
				}
				this.state = 504;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 503;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 506;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 10:
				{
				_localctx = new LiteralOrIdContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 512;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case QuintErrorsParser.IDENTIFIER:
					{
					this.state = 508;
					this.qualId();
					}
					break;
				case QuintErrorsParser.INT:
					{
					this.state = 509;
					this.match(QuintErrorsParser.INT);
					}
					break;
				case QuintErrorsParser.BOOL:
					{
					this.state = 510;
					this.match(QuintErrorsParser.BOOL);
					}
					break;
				case QuintErrorsParser.STRING:
					{
					this.state = 511;
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
				this.state = 514;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 515;
				this.expr(0);
				this.state = 516;
				this.match(QuintErrorsParser.T__9);
				this.state = 517;
				this.expr(0);
				this.state = 522;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 55, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 518;
						this.match(QuintErrorsParser.T__9);
						this.state = 519;
						this.expr(0);
						}
						}
					}
					this.state = 524;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 55, this._ctx);
				}
				this.state = 526;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 525;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 528;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 12:
				{
				_localctx = new RecordContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 530;
				this.match(QuintErrorsParser.T__1);
				this.state = 531;
				this.recElem();
				this.state = 536;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 57, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 532;
						this.match(QuintErrorsParser.T__9);
						this.state = 533;
						this.recElem();
						}
						}
					}
					this.state = 538;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 57, this._ctx);
				}
				this.state = 540;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 539;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 542;
				this.match(QuintErrorsParser.T__2);
				}
				break;

			case 13:
				{
				_localctx = new ListContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 544;
				this.match(QuintErrorsParser.T__25);
				this.state = 553;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 2)) & ~0x1F) === 0 && ((1 << (_la - 2)) & ((1 << (QuintErrorsParser.T__1 - 2)) | (1 << (QuintErrorsParser.T__13 - 2)) | (1 << (QuintErrorsParser.T__14 - 2)) | (1 << (QuintErrorsParser.T__15 - 2)) | (1 << (QuintErrorsParser.T__16 - 2)) | (1 << (QuintErrorsParser.T__17 - 2)) | (1 << (QuintErrorsParser.T__18 - 2)) | (1 << (QuintErrorsParser.T__19 - 2)) | (1 << (QuintErrorsParser.T__25 - 2)) | (1 << (QuintErrorsParser.T__32 - 2)))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (QuintErrorsParser.T__33 - 34)) | (1 << (QuintErrorsParser.T__34 - 34)) | (1 << (QuintErrorsParser.T__36 - 34)) | (1 << (QuintErrorsParser.STRING - 34)) | (1 << (QuintErrorsParser.BOOL - 34)) | (1 << (QuintErrorsParser.INT - 34)) | (1 << (QuintErrorsParser.AND - 34)) | (1 << (QuintErrorsParser.OR - 34)) | (1 << (QuintErrorsParser.IFF - 34)) | (1 << (QuintErrorsParser.IMPLIES - 34)) | (1 << (QuintErrorsParser.SET - 34)) | (1 << (QuintErrorsParser.LIST - 34)) | (1 << (QuintErrorsParser.MAP - 34)) | (1 << (QuintErrorsParser.MATCH - 34)) | (1 << (QuintErrorsParser.MINUS - 34)) | (1 << (QuintErrorsParser.LPAREN - 34)) | (1 << (QuintErrorsParser.IDENTIFIER - 34)))) !== 0)) {
					{
					this.state = 545;
					this.expr(0);
					this.state = 550;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 59, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 546;
							this.match(QuintErrorsParser.T__9);
							this.state = 547;
							this.expr(0);
							}
							}
						}
						this.state = 552;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 59, this._ctx);
					}
					}
				}

				this.state = 556;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === QuintErrorsParser.T__9) {
					{
					this.state = 555;
					this.match(QuintErrorsParser.T__9);
					}
				}

				this.state = 558;
				this.match(QuintErrorsParser.T__26);
				}
				break;

			case 14:
				{
				_localctx = new IfElseContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 559;
				this.match(QuintErrorsParser.T__34);
				this.state = 560;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 561;
				this.expr(0);
				this.state = 562;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 563;
				this.expr(0);
				this.state = 564;
				this.match(QuintErrorsParser.T__35);
				this.state = 565;
				this.expr(5);
				}
				break;

			case 15:
				{
				_localctx = new LetInContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 567;
				this.operDef();
				this.state = 568;
				this.expr(4);
				}
				break;

			case 16:
				{
				_localctx = new NondetContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 570;
				this.nondetOperDef();
				this.state = 571;
				this.expr(3);
				}
				break;

			case 17:
				{
				_localctx = new ParenContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 573;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 574;
				this.expr(0);
				this.state = 575;
				this.match(QuintErrorsParser.RPAREN);
				}
				break;

			case 18:
				{
				_localctx = new BracesContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 577;
				this.match(QuintErrorsParser.T__1);
				this.state = 578;
				this.expr(0);
				this.state = 579;
				this.match(QuintErrorsParser.T__2);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 632;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 66, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 630;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 65, this._ctx) ) {
					case 1:
						{
						_localctx = new PowContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 583;
						if (!(this.precpred(this._ctx, 26))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 26)");
						}
						this.state = 584;
						(_localctx as PowContext)._op = this.match(QuintErrorsParser.T__30);
						this.state = 585;
						this.expr(26);
						}
						break;

					case 2:
						{
						_localctx = new MultDivContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 586;
						if (!(this.precpred(this._ctx, 24))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
						}
						this.state = 587;
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
						this.state = 588;
						this.expr(25);
						}
						break;

					case 3:
						{
						_localctx = new PlusMinusContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 589;
						if (!(this.precpred(this._ctx, 23))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 23)");
						}
						this.state = 590;
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
						this.state = 591;
						this.expr(24);
						}
						break;

					case 4:
						{
						_localctx = new RelationsContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 592;
						if (!(this.precpred(this._ctx, 22))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 22)");
						}
						this.state = 593;
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
						this.state = 594;
						this.expr(23);
						}
						break;

					case 5:
						{
						_localctx = new ErrorEqContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 595;
						if (!(this.precpred(this._ctx, 20))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 20)");
						}
						this.state = 596;
						this.match(QuintErrorsParser.ASGN);
						this.state = 597;
						this.expr(21);

						                            const m = "[QNT006] unexpected '=', did you mean '=='?"
						                            this.notifyErrorListeners(m)
						                          
						}
						break;

					case 6:
						{
						_localctx = new AndContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 600;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 601;
						this.match(QuintErrorsParser.AND);
						this.state = 602;
						this.expr(19);
						}
						break;

					case 7:
						{
						_localctx = new OrContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 603;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 604;
						this.match(QuintErrorsParser.OR);
						this.state = 605;
						this.expr(17);
						}
						break;

					case 8:
						{
						_localctx = new IffContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 606;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 607;
						this.match(QuintErrorsParser.IFF);
						this.state = 608;
						this.expr(16);
						}
						break;

					case 9:
						{
						_localctx = new ImpliesContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 609;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 610;
						this.match(QuintErrorsParser.IMPLIES);
						this.state = 611;
						this.expr(15);
						}
						break;

					case 10:
						{
						_localctx = new PairContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 612;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 613;
						this.match(QuintErrorsParser.T__23);
						this.state = 614;
						this.expr(9);
						}
						break;

					case 11:
						{
						_localctx = new DotCallContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, QuintErrorsParser.RULE_expr);
						this.state = 615;
						if (!(this.precpred(this._ctx, 30))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 30)");
						}
						this.state = 616;
						this.match(QuintErrorsParser.T__20);
						this.state = 617;
						this.nameAfterDot();
						this.state = 623;
						this._errHandler.sync(this);
						switch ( this.interpreter.adaptivePredict(this._input, 64, this._ctx) ) {
						case 1:
							{
							this.state = 618;
							this.match(QuintErrorsParser.LPAREN);
							this.state = 620;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
							if (((((_la - 2)) & ~0x1F) === 0 && ((1 << (_la - 2)) & ((1 << (QuintErrorsParser.T__1 - 2)) | (1 << (QuintErrorsParser.T__13 - 2)) | (1 << (QuintErrorsParser.T__14 - 2)) | (1 << (QuintErrorsParser.T__15 - 2)) | (1 << (QuintErrorsParser.T__16 - 2)) | (1 << (QuintErrorsParser.T__17 - 2)) | (1 << (QuintErrorsParser.T__18 - 2)) | (1 << (QuintErrorsParser.T__19 - 2)) | (1 << (QuintErrorsParser.T__25 - 2)) | (1 << (QuintErrorsParser.T__32 - 2)))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (QuintErrorsParser.T__33 - 34)) | (1 << (QuintErrorsParser.T__34 - 34)) | (1 << (QuintErrorsParser.T__36 - 34)) | (1 << (QuintErrorsParser.STRING - 34)) | (1 << (QuintErrorsParser.BOOL - 34)) | (1 << (QuintErrorsParser.INT - 34)) | (1 << (QuintErrorsParser.AND - 34)) | (1 << (QuintErrorsParser.OR - 34)) | (1 << (QuintErrorsParser.IFF - 34)) | (1 << (QuintErrorsParser.IMPLIES - 34)) | (1 << (QuintErrorsParser.SET - 34)) | (1 << (QuintErrorsParser.LIST - 34)) | (1 << (QuintErrorsParser.MAP - 34)) | (1 << (QuintErrorsParser.MATCH - 34)) | (1 << (QuintErrorsParser.MINUS - 34)) | (1 << (QuintErrorsParser.LPAREN - 34)) | (1 << (QuintErrorsParser.IDENTIFIER - 34)))) !== 0)) {
								{
								this.state = 619;
								this.argList();
								}
							}

							this.state = 622;
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
						this.state = 625;
						if (!(this.precpred(this._ctx, 27))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 27)");
						}
						this.state = 626;
						this.match(QuintErrorsParser.T__25);
						this.state = 627;
						this.expr(0);
						this.state = 628;
						this.match(QuintErrorsParser.T__26);
						}
						break;
					}
					}
				}
				this.state = 634;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 66, this._ctx);
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
		this.enterRule(_localctx, 40, QuintErrorsParser.RULE_matchSumExpr);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 635;
			this.match(QuintErrorsParser.MATCH);
			this.state = 636;
			this.expr(0);
			this.state = 637;
			this.match(QuintErrorsParser.T__1);
			this.state = 639;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.T__12) {
				{
				this.state = 638;
				this.match(QuintErrorsParser.T__12);
				}
			}

			this.state = 641;
			_localctx._matchSumCase = this.matchSumCase();
			_localctx._matchCase.push(_localctx._matchSumCase);
			this.state = 646;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === QuintErrorsParser.T__12) {
				{
				{
				this.state = 642;
				this.match(QuintErrorsParser.T__12);
				this.state = 643;
				_localctx._matchSumCase = this.matchSumCase();
				_localctx._matchCase.push(_localctx._matchSumCase);
				}
				}
				this.state = 648;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 649;
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
		this.enterRule(_localctx, 42, QuintErrorsParser.RULE_matchSumCase);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 653;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				{
				this.state = 651;
				_localctx._variantMatch = this.matchSumVariant();
				}
				break;
			case QuintErrorsParser.T__36:
				{
				this.state = 652;
				_localctx._wildCardMatch = this.match(QuintErrorsParser.T__36);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 655;
			this.match(QuintErrorsParser.T__24);
			this.state = 656;
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
		this.enterRule(_localctx, 44, QuintErrorsParser.RULE_matchSumVariant);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 658;
			_localctx._variantLabel = this.simpleId("variant label");
			}
			this.state = 665;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QuintErrorsParser.LPAREN) {
				{
				this.state = 659;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 662;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case QuintErrorsParser.IDENTIFIER:
					{
					this.state = 660;
					_localctx._variantParam = this.simpleId("match case parameter");
					}
					break;
				case QuintErrorsParser.T__36:
					{
					this.state = 661;
					this.match(QuintErrorsParser.T__36);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 664;
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
		this.enterRule(_localctx, 46, QuintErrorsParser.RULE_declarationOrExpr);
		try {
			this.state = 676;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 72, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 667;
				this.declaration();
				this.state = 668;
				this.match(QuintErrorsParser.EOF);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 670;
				this.expr(0);
				this.state = 671;
				this.match(QuintErrorsParser.EOF);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 673;
				this.match(QuintErrorsParser.DOCCOMMENT);
				this.state = 674;
				this.match(QuintErrorsParser.EOF);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 675;
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
		this.enterRule(_localctx, 48, QuintErrorsParser.RULE_lambda);
		try {
			this.state = 680;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 73, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 678;
				this.lambdaUnsugared();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 679;
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
		this.enterRule(_localctx, 50, QuintErrorsParser.RULE_lambdaUnsugared);
		let _la: number;
		try {
			this.state = 699;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.T__36:
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 682;
				this.parameter();
				this.state = 683;
				this.match(QuintErrorsParser.T__24);
				this.state = 684;
				this.expr(0);
				}
				break;
			case QuintErrorsParser.LPAREN:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 686;
				this.match(QuintErrorsParser.LPAREN);
				this.state = 687;
				this.parameter();
				this.state = 692;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === QuintErrorsParser.T__9) {
					{
					{
					this.state = 688;
					this.match(QuintErrorsParser.T__9);
					this.state = 689;
					this.parameter();
					}
					}
					this.state = 694;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 695;
				this.match(QuintErrorsParser.RPAREN);
				this.state = 696;
				this.match(QuintErrorsParser.T__24);
				this.state = 697;
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
		this.enterRule(_localctx, 52, QuintErrorsParser.RULE_lambdaTupleSugar);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 701;
			this.match(QuintErrorsParser.LPAREN);
			this.state = 702;
			this.match(QuintErrorsParser.LPAREN);
			this.state = 703;
			this.parameter();
			this.state = 706;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 704;
				this.match(QuintErrorsParser.T__9);
				this.state = 705;
				this.parameter();
				}
				}
				this.state = 708;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === QuintErrorsParser.T__9);
			this.state = 710;
			this.match(QuintErrorsParser.RPAREN);
			this.state = 711;
			this.match(QuintErrorsParser.RPAREN);
			this.state = 712;
			this.match(QuintErrorsParser.T__24);
			this.state = 713;
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
		this.enterRule(_localctx, 54, QuintErrorsParser.RULE_identOrHole);
		try {
			this.state = 717;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.T__36:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 715;
				this.match(QuintErrorsParser.T__36);
				}
				break;
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 716;
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
		this.enterRule(_localctx, 56, QuintErrorsParser.RULE_parameter);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 719;
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
		this.enterRule(_localctx, 58, QuintErrorsParser.RULE_identOrStar);
		try {
			this.state = 723;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.MUL:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 721;
				this.match(QuintErrorsParser.MUL);
				}
				break;
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 722;
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
		this.enterRule(_localctx, 60, QuintErrorsParser.RULE_argList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 725;
			this.expr(0);
			this.state = 730;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === QuintErrorsParser.T__9) {
				{
				{
				this.state = 726;
				this.match(QuintErrorsParser.T__9);
				this.state = 727;
				this.expr(0);
				}
				}
				this.state = 732;
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
		this.enterRule(_localctx, 62, QuintErrorsParser.RULE_recElem);
		try {
			this.state = 739;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 733;
				this.simpleId("record");
				this.state = 734;
				this.match(QuintErrorsParser.T__5);
				this.state = 735;
				this.expr(0);
				}
				break;
			case QuintErrorsParser.T__37:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 737;
				this.match(QuintErrorsParser.T__37);
				this.state = 738;
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
		this.enterRule(_localctx, 64, QuintErrorsParser.RULE_normalCallName);
		let _la: number;
		try {
			this.state = 743;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 741;
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
				this.state = 742;
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
		this.enterRule(_localctx, 66, QuintErrorsParser.RULE_nameAfterDot);
		let _la: number;
		try {
			this.state = 747;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QuintErrorsParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 745;
				this.qualId();
				}
				break;
			case QuintErrorsParser.AND:
			case QuintErrorsParser.OR:
			case QuintErrorsParser.IFF:
			case QuintErrorsParser.IMPLIES:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 746;
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
		this.enterRule(_localctx, 68, QuintErrorsParser.RULE_operator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 749;
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
		this.enterRule(_localctx, 70, QuintErrorsParser.RULE_literal);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 751;
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
		this.enterRule(_localctx, 72, QuintErrorsParser.RULE_qualId);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 753;
			this.match(QuintErrorsParser.IDENTIFIER);
			this.state = 758;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 83, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 754;
					this.match(QuintErrorsParser.T__38);
					this.state = 755;
					this.match(QuintErrorsParser.IDENTIFIER);
					}
					}
				}
				this.state = 760;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 83, this._ctx);
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
		this.enterRule(_localctx, 74, QuintErrorsParser.RULE_simpleId);
		try {
			this.state = 765;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 84, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 761;
				this.match(QuintErrorsParser.IDENTIFIER);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 762;
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
		this.enterRule(_localctx, 76, QuintErrorsParser.RULE_empty);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 767;
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
		case 15:
			return this.type_sempred(_localctx as TypeContext, predIndex);

		case 19:
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
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03G\u0304\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x03\x02\x06\x02R\n\x02\r" +
		"\x02\x0E\x02S\x03\x02\x03\x02\x03\x03\x07\x03Y\n\x03\f\x03\x0E\x03\\\v" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03b\n\x03\f\x03\x0E\x03e\v\x03" +
		"\x03\x03\x07\x03h\n\x03\f\x03\x0E\x03k\v\x03\x03\x03\x03\x03\x03\x04\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04\x81" +
		"\n\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05\x89\n\x05" +
		"\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x07\x06\x91\n\x06\f\x06" +
		"\x0E\x06\x94\v\x06\x05\x06\x96\n\x06\x03\x06\x03\x06\x03\x06\x05\x06\x9B" +
		"\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x03\x06\x03\x06\x03\x06\x07\x06\xA8\n\x06\f\x06\x0E\x06\xAB\v\x06\x03" +
		"\x06\x03\x06\x03\x06\x03\x06\x05\x06\xB1\n\x06\x03\x06\x03\x06\x05\x06" +
		"\xB5\n\x06\x03\x06\x05\x06\xB8\n\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07\xC5\n\x07" +
		"\x03\x07\x03\x07\x03\x07\x07\x07\xCA\n\x07\f\x07\x0E\x07\xCD\v\x07\x05" +
		"\x07\xCF\n\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x05\b\xD6\n\b\x03\t\x03\t" +
		"\x03\t\x03\t\x05\t\xDC\n\t\x03\t\x03\t\x03\t\x05\t\xE1\n\t\x03\n\x03\n" +
		"\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x05\n\xEC\n\n\x03\v\x03\v\x03" +
		"\v\x03\v\x03\v\x05\v\xF3\n\v\x03\v\x03\v\x03\v\x05\v\xF8\n\v\x03\v\x03" +
		"\v\x05\v\xFC\n\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v" +
		"\x03\v\x07\v\u0108\n\v\f\v\x0E\v\u010B\v\v\x03\v\x03\v\x03\v\x03\v\x03" +
		"\v\x05\v\u0112\n\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03" +
		"\v\x03\v\x07\v\u011E\n\v\f\v\x0E\v\u0121\v\v\x03\v\x03\v\x03\v\x03\v\x03" +
		"\v\x05\v\u0128\n\v\x05\v\u012A\n\v\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f" +
		"\x03\f\x05\f\u0133\n\f\x05\f\u0135\n\f\x03\r\x03\r\x03\x0E\x03\x0E\x03" +
		"\x0F\x03\x0F\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x07" +
		"\x11\u0144\n\x11\f\x11\x0E\x11\u0147\v\x11\x05\x11\u0149\n\x11\x03\x11" +
		"\x05\x11\u014C\n\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x07\x11\u0161\n\x11\f\x11\x0E\x11\u0164\v" +
		"\x11\x03\x11\x05\x11\u0167\n\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11" +
		"\x03\x11\x03\x11\x06\x11\u0170\n\x11\r\x11\x0E\x11\u0171\x03\x11\x03\x11" +
		"\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x05\x11\u017C\n\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x07\x11\u0184\n\x11\f\x11" +
		"\x0E\x11\u0187\v\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03" +
		"\x12\x05\x12\u0190\n\x12\x03\x12\x05\x12\u0193\n\x12\x03\x12\x03\x12\x03" +
		"\x13\x03\x13\x03\x13\x03\x13\x03\x13\x07\x13\u019C\n\x13\f\x13\x0E\x13" +
		"\u019F\v\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x05" +
		"\x13\u01A8\n\x13\x05\x13\u01AA\n\x13\x03\x13\x03\x13\x05\x13\u01AE\n\x13" +
		"\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x05\x15\u01B7" +
		"\n\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x07\x15\u01C7\n\x15\f" +
		"\x15\x0E\x15\u01CA\v\x15\x03\x15\x05\x15\u01CD\n\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x03\x15\x07\x15\u01D6\n\x15\f\x15\x0E\x15" +
		"\u01D9\v\x15\x03\x15\x05\x15\u01DC\n\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x03\x15\x03\x15\x03\x15\x07\x15\u01E6\n\x15\f\x15\x0E\x15\u01E9" +
		"\v\x15\x03\x15\x05\x15\u01EC\n\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x07\x15\u01F5\n\x15\f\x15\x0E\x15\u01F8\v\x15\x03" +
		"\x15\x05\x15\u01FB\n\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x05\x15\u0203\n\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x07" +
		"\x15\u020B\n\x15\f\x15\x0E\x15\u020E\v\x15\x03\x15\x05\x15\u0211\n\x15" +
		"\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x07\x15\u0219\n\x15\f" +
		"\x15\x0E\x15\u021C\v\x15\x03\x15\x05\x15\u021F\n\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x07\x15\u0227\n\x15\f\x15\x0E\x15\u022A\v" +
		"\x15\x05\x15\u022C\n\x15\x03\x15\x05\x15\u022F\n\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x05\x15\u0248\n\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x05\x15\u026F\n\x15\x03" +
		"\x15\x05\x15\u0272\n\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x07\x15" +
		"\u0279\n\x15\f\x15\x0E\x15\u027C\v\x15\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x05\x16\u0282\n\x16\x03\x16\x03\x16\x03\x16\x07\x16\u0287\n\x16\f\x16" +
		"\x0E\x16\u028A\v\x16\x03\x16\x03\x16\x03\x17\x03\x17\x05\x17\u0290\n\x17" +
		"\x03\x17\x03\x17\x03\x17\x03\x18\x03\x18\x03\x18\x03\x18\x05\x18\u0299" +
		"\n\x18\x03\x18\x05\x18\u029C\n\x18\x03\x19\x03\x19\x03\x19\x03\x19\x03" +
		"\x19\x03\x19\x03\x19\x03\x19\x03\x19\x05\x19\u02A7\n\x19\x03\x1A\x03\x1A" +
		"\x05\x1A\u02AB\n\x1A\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03" +
		"\x1B\x03\x1B\x07\x1B\u02B5\n\x1B\f\x1B\x0E\x1B\u02B8\v\x1B\x03\x1B\x03" +
		"\x1B\x03\x1B\x03\x1B\x05\x1B\u02BE\n\x1B\x03\x1C\x03\x1C\x03\x1C\x03\x1C" +
		"\x03\x1C\x06\x1C\u02C5\n\x1C\r\x1C\x0E\x1C\u02C6\x03\x1C\x03\x1C\x03\x1C" +
		"\x03\x1C\x03\x1C\x03\x1D\x03\x1D\x05\x1D\u02D0\n\x1D\x03\x1E\x03\x1E\x03" +
		"\x1F\x03\x1F\x05\x1F\u02D6\n\x1F\x03 \x03 \x03 \x07 \u02DB\n \f \x0E " +
		"\u02DE\v \x03!\x03!\x03!\x03!\x03!\x03!\x05!\u02E6\n!\x03\"\x03\"\x05" +
		"\"\u02EA\n\"\x03#\x03#\x05#\u02EE\n#\x03$\x03$\x03%\x03%\x03&\x03&\x03" +
		"&\x07&\u02F7\n&\f&\x0E&\u02FA\v&\x03\'\x03\'\x03\'\x03\'\x05\'\u0300\n" +
		"\'\x03(\x03(\x03(\x02\x02\x04 ()\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f" +
		"\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E" +
		"\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02" +
		":\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02N\x02\x02\t\x03\x02" +
		"79\x03\x0256\x03\x02:?\x03\x02-3\x03\x02-0\x05\x02!!-05?\x03\x02*,\x02" +
		"\u0368\x02Q\x03\x02\x02\x02\x04Z\x03\x02\x02\x02\x06\x80\x03\x02\x02\x02" +
		"\b\x88\x03\x02\x02\x02\n\x8A\x03\x02\x02\x02\f\xCE\x03\x02\x02\x02\x0E" +
		"\xD0\x03\x02\x02\x02\x10\xD7\x03\x02\x02\x02\x12\xEB\x03\x02\x02\x02\x14" +
		"\u0129\x03\x02\x02\x02\x16\u0134\x03\x02\x02\x02\x18\u0136\x03\x02\x02" +
		"\x02\x1A\u0138\x03\x02\x02\x02\x1C\u013A\x03\x02\x02\x02\x1E\u013C\x03" +
		"\x02\x02\x02 \u017B\x03\x02\x02\x02\"\u0188\x03\x02\x02\x02$\u01AD\x03" +
		"\x02\x02\x02&\u01AF\x03\x02\x02\x02(\u0247\x03\x02\x02\x02*\u027D\x03" +
		"\x02\x02\x02,\u028F\x03\x02\x02\x02.\u0294\x03\x02\x02\x020\u02A6\x03" +
		"\x02\x02\x022\u02AA\x03\x02\x02\x024\u02BD\x03\x02\x02\x026\u02BF\x03" +
		"\x02\x02\x028\u02CF\x03\x02\x02\x02:\u02D1\x03\x02\x02\x02<\u02D5\x03" +
		"\x02\x02\x02>\u02D7\x03\x02\x02\x02@\u02E5\x03\x02\x02\x02B\u02E9\x03" +
		"\x02\x02\x02D\u02ED\x03\x02\x02\x02F\u02EF\x03\x02\x02\x02H\u02F1\x03" +
		"\x02\x02\x02J\u02F3\x03\x02\x02\x02L\u02FF\x03\x02\x02\x02N\u0301\x03" +
		"\x02\x02\x02PR\x05\x04\x03\x02QP\x03\x02\x02\x02RS\x03\x02\x02\x02SQ\x03" +
		"\x02\x02\x02ST\x03\x02\x02\x02TU\x03\x02\x02\x02UV\x07\x02\x02\x03V\x03" +
		"\x03\x02\x02\x02WY\x07D\x02\x02XW\x03\x02\x02\x02Y\\\x03\x02\x02\x02Z" +
		"X\x03\x02\x02\x02Z[\x03\x02\x02\x02[]\x03\x02\x02\x02\\Z\x03\x02\x02\x02" +
		"]^\x07\x03\x02\x02^_\x05J&\x02_i\x07\x04\x02\x02`b\x07D\x02\x02a`\x03" +
		"\x02\x02\x02be\x03\x02\x02\x02ca\x03\x02\x02\x02cd\x03\x02\x02\x02df\x03" +
		"\x02\x02\x02ec\x03\x02\x02\x02fh\x05\x06\x04\x02gc\x03\x02\x02\x02hk\x03" +
		"\x02\x02\x02ig\x03\x02\x02\x02ij\x03\x02\x02\x02jl\x03\x02\x02\x02ki\x03" +
		"\x02\x02\x02lm\x07\x05\x02\x02m\x05\x03\x02\x02\x02no\x07\x06\x02\x02" +
		"o\x81\x05\b\x05\x02pq\x07\x07\x02\x02qr\x05J&\x02rs\x07\b\x02\x02st\x05" +
		" \x11\x02t\x81\x03\x02\x02\x02uv\x07\t\x02\x02vw\x058\x1D\x02wx\x07@\x02" +
		"\x02xy\x05(\x15\x02y\x81\x03\x02\x02\x02z\x81\x05\n\x06\x02{\x81\x05\f" +
		"\x07\x02|}\x07\n\x02\x02}\x81\x05\x14\v\x02~\x7F\x07\v\x02\x02\x7F\x81" +
		"\x05\x16\f\x02\x80n\x03\x02\x02\x02\x80p\x03\x02\x02\x02\x80u\x03\x02" +
		"\x02\x02\x80z\x03\x02\x02\x02\x80{\x03\x02\x02\x02\x80|\x03\x02\x02\x02" +
		"\x80~\x03\x02\x02\x02\x81\x07\x03\x02\x02\x02\x82\x83\x05J&\x02\x83\x84" +
		"\x07\b\x02\x02\x84\x85\x05 \x11\x02\x85\x89\x03\x02\x02\x02\x86\x87\v" +
		"\x02\x02\x02\x87\x89\b\x05\x01\x02\x88\x82\x03\x02\x02\x02\x88\x86\x03" +
		"\x02\x02\x02\x89\t\x03\x02\x02\x02\x8A\x8B\x05\x12\n\x02\x8B\xB0\x05B" +
		"\"\x02\x8C\x95\x07A\x02\x02\x8D\x92\x05:\x1E\x02\x8E\x8F\x07\f\x02\x02" +
		"\x8F\x91\x05:\x1E\x02\x90\x8E\x03\x02\x02\x02\x91\x94\x03\x02\x02\x02" +
		"\x92\x90\x03\x02\x02\x02\x92\x93\x03\x02\x02\x02\x93\x96\x03\x02\x02\x02" +
		"\x94\x92\x03\x02\x02\x02\x95\x8D\x03\x02\x02\x02\x95\x96\x03\x02\x02\x02" +
		"\x96\x97\x03\x02\x02\x02\x97\x9A\x07B\x02\x02\x98\x99\x07\b\x02\x02\x99" +
		"\x9B\x05 \x11\x02\x9A\x98\x03\x02\x02\x02\x9A\x9B\x03\x02\x02\x02\x9B" +
		"\xB1\x03\x02\x02\x02\x9C\x9D\x07\b\x02\x02\x9D\xB1\x05 \x11\x02\x9E\x9F" +
		"\x07A\x02\x02\x9F\xA0\x05:\x1E\x02\xA0\xA1\x07\b\x02\x02\xA1\xA9\x05 " +
		"\x11\x02\xA2\xA3\x07\f\x02\x02\xA3\xA4\x05:\x1E\x02\xA4\xA5\x07\b\x02" +
		"\x02\xA5\xA6\x05 \x11\x02\xA6\xA8\x03\x02\x02\x02\xA7\xA2\x03\x02\x02" +
		"\x02\xA8\xAB\x03\x02\x02\x02\xA9\xA7\x03\x02\x02\x02\xA9\xAA\x03\x02\x02" +
		"\x02\xAA\xAC\x03\x02\x02\x02\xAB\xA9\x03\x02\x02\x02\xAC\xAD\x07B\x02" +
		"\x02\xAD\xAE\x07\b\x02\x02\xAE\xAF\x05 \x11\x02\xAF\xB1\x03\x02\x02\x02" +
		"\xB0\x8C\x03\x02\x02\x02\xB0\x9C\x03\x02\x02\x02\xB0\x9E\x03\x02\x02\x02" +
		"\xB0\xB1\x03\x02\x02\x02\xB1\xB4\x03\x02\x02\x02\xB2\xB3\x07@\x02\x02" +
		"\xB3\xB5\x05(\x15\x02\xB4\xB2\x03\x02\x02\x02\xB4\xB5\x03\x02\x02\x02" +
		"\xB5\xB7\x03\x02\x02\x02\xB6\xB8\x07\r\x02\x02\xB7\xB6\x03\x02\x02\x02" +
		"\xB7\xB8\x03\x02\x02\x02\xB8\v\x03\x02\x02\x02\xB9\xBA\x07\x0E\x02\x02" +
		"\xBA\xCF\x05J&\x02\xBB\xBC\x07\x0E\x02\x02\xBC\xBD\x05J&\x02\xBD\xBE\x07" +
		"@\x02\x02\xBE\xBF\x05 \x11\x02\xBF\xCF\x03\x02\x02\x02\xC0\xC1\x07\x0E" +
		"\x02\x02\xC1\xC2\x05J&\x02\xC2\xC4\x07@\x02\x02\xC3\xC5\x07\x0F\x02\x02" +
		"\xC4\xC3\x03\x02\x02\x02\xC4\xC5\x03\x02\x02\x02\xC5\xC6\x03\x02\x02\x02" +
		"\xC6\xCB\x05\x0E\b\x02\xC7\xC8\x07\x0F\x02\x02\xC8\xCA\x05\x0E\b\x02\xC9" +
		"\xC7\x03\x02\x02\x02\xCA\xCD\x03\x02\x02\x02\xCB\xC9\x03\x02\x02\x02\xCB" +
		"\xCC\x03\x02\x02\x02\xCC\xCF\x03\x02\x02\x02\xCD\xCB\x03\x02\x02\x02\xCE" +
		"\xB9\x03\x02\x02\x02\xCE\xBB\x03\x02\x02\x02\xCE\xC0\x03\x02\x02\x02\xCF" +
		"\r\x03\x02\x02\x02\xD0\xD5\x05L\'\x02\xD1\xD2\x07A\x02\x02\xD2\xD3\x05" +
		" \x11\x02\xD3\xD4\x07B\x02\x02\xD4\xD6\x03\x02\x02\x02\xD5\xD1\x03\x02" +
		"\x02\x02\xD5\xD6\x03\x02\x02\x02\xD6\x0F\x03\x02\x02\x02\xD7\xD8\x07\x10" +
		"\x02\x02\xD8\xDB\x05J&\x02\xD9\xDA\x07\b\x02\x02\xDA\xDC\x05 \x11\x02" +
		"\xDB\xD9\x03\x02\x02\x02\xDB\xDC\x03\x02\x02\x02\xDC\xDD\x03\x02\x02\x02" +
		"\xDD\xDE\x07@\x02\x02\xDE\xE0\x05(\x15\x02\xDF\xE1\x07\r\x02\x02\xE0\xDF" +
		"\x03\x02\x02\x02\xE0\xE1\x03\x02\x02\x02\xE1\x11\x03\x02\x02\x02\xE2\xEC" +
		"\x07\x11\x02\x02\xE3\xEC\x07\x12\x02\x02\xE4\xE5\x07\x13\x02\x02\xE5\xEC" +
		"\x07\x11\x02\x02\xE6\xE7\x07\x13\x02\x02\xE7\xEC\x07\x12\x02\x02\xE8\xEC" +
		"\x07\x14\x02\x02\xE9\xEC\x07\x15\x02\x02\xEA\xEC\x07\x16\x02\x02\xEB\xE2" +
		"\x03\x02\x02\x02\xEB\xE3\x03\x02\x02\x02\xEB\xE4\x03\x02\x02\x02\xEB\xE6" +
		"\x03\x02\x02\x02\xEB\xE8\x03\x02\x02\x02\xEB\xE9\x03\x02\x02\x02\xEB\xEA" +
		"\x03\x02\x02\x02\xEC\x13\x03\x02\x02\x02\xED\xEE\x05\x1A\x0E\x02\xEE\xEF" +
		"\x07\x17\x02\x02\xEF\xF2\x05<\x1F\x02\xF0\xF1\x07\x18\x02\x02\xF1\xF3" +
		"\x05\x1E\x10\x02\xF2\xF0\x03\x02\x02\x02\xF2\xF3\x03\x02\x02\x02\xF3\u012A" +
		"\x03\x02\x02\x02\xF4\xF7\x05\x1A\x0E\x02\xF5\xF6\x07\x19\x02\x02\xF6\xF8" +
		"\x05\x1A\x0E\x02\xF7\xF5\x03\x02\x02\x02\xF7\xF8\x03\x02\x02\x02\xF8\xFB" +
		"\x03\x02\x02\x02\xF9\xFA\x07\x18\x02\x02\xFA\xFC\x05\x1E\x10\x02\xFB\xF9" +
		"\x03\x02\x02\x02\xFB\xFC\x03\x02\x02\x02\xFC\u012A\x03\x02\x02\x02\xFD" +
		"\xFE\x05\x18\r\x02\xFE\xFF\x07A\x02\x02\xFF\u0100\x05\x1A\x0E\x02\u0100" +
		"\u0101\x07@\x02\x02\u0101\u0109\x05(\x15\x02\u0102\u0103\x07\f\x02\x02" +
		"\u0103\u0104\x05\x1A\x0E\x02\u0104\u0105\x07@\x02\x02\u0105\u0106\x05" +
		"(\x15\x02\u0106\u0108\x03\x02\x02\x02\u0107\u0102\x03\x02\x02\x02\u0108" +
		"\u010B\x03\x02\x02\x02\u0109\u0107\x03\x02\x02\x02\u0109\u010A\x03\x02" +
		"\x02\x02\u010A\u010C\x03\x02\x02\x02\u010B\u0109\x03\x02\x02\x02\u010C" +
		"\u010D\x07B\x02\x02\u010D\u010E\x07\x17\x02\x02\u010E\u0111\x077\x02\x02" +
		"\u010F\u0110\x07\x18\x02\x02\u0110\u0112\x05\x1E\x10\x02\u0111\u010F\x03" +
		"\x02\x02\x02\u0111\u0112\x03\x02\x02\x02\u0112\u012A\x03\x02\x02\x02\u0113" +
		"\u0114\x05\x18\r\x02\u0114\u0115\x07A\x02\x02\u0115\u0116\x05\x1A\x0E" +
		"\x02\u0116\u0117\x07@\x02\x02\u0117\u011F\x05(\x15\x02\u0118\u0119\x07" +
		"\f\x02\x02\u0119\u011A\x05\x1A\x0E\x02\u011A\u011B\x07@\x02\x02\u011B" +
		"\u011C\x05(\x15\x02\u011C\u011E\x03\x02\x02\x02\u011D\u0118\x03\x02\x02" +
		"\x02\u011E\u0121\x03\x02\x02\x02\u011F\u011D\x03\x02\x02\x02\u011F\u0120" +
		"\x03\x02\x02\x02\u0120\u0122\x03\x02\x02\x02\u0121\u011F\x03\x02\x02\x02" +
		"\u0122\u0123\x07B\x02\x02\u0123\u0124\x07\x19\x02\x02\u0124\u0127\x05" +
		"\x1C\x0F\x02\u0125\u0126\x07\x18\x02\x02\u0126\u0128\x05\x1E\x10\x02\u0127" +
		"\u0125\x03\x02\x02\x02\u0127\u0128\x03\x02\x02\x02\u0128\u012A\x03\x02" +
		"\x02\x02\u0129\xED\x03\x02\x02\x02\u0129\xF4\x03\x02\x02\x02\u0129\xFD" +
		"\x03\x02\x02\x02\u0129\u0113\x03\x02\x02\x02\u012A\x15\x03\x02\x02\x02" +
		"\u012B\u012C\x05\x1A\x0E\x02\u012C\u012D\x07\x17\x02\x02\u012D\u012E\x05" +
		"<\x1F\x02\u012E\u0135\x03\x02\x02\x02\u012F\u0132\x05\x1A\x0E\x02\u0130" +
		"\u0131\x07\x19\x02\x02\u0131\u0133\x05\x1A\x0E\x02\u0132\u0130\x03\x02" +
		"\x02\x02\u0132\u0133\x03\x02\x02\x02\u0133\u0135\x03\x02\x02\x02\u0134" +
		"\u012B\x03\x02\x02\x02\u0134\u012F\x03\x02\x02\x02\u0135\x17\x03\x02\x02" +
		"\x02\u0136\u0137\x05J&\x02\u0137\x19\x03\x02\x02\x02\u0138\u0139\x05J" +
		"&\x02\u0139\x1B\x03\x02\x02\x02\u013A\u013B\x05J&\x02\u013B\x1D\x03\x02" +
		"\x02\x02\u013C\u013D\x07*\x02\x02\u013D\x1F\x03\x02\x02\x02\u013E\u013F" +
		"\b\x11\x01\x02\u013F\u0148\x07A\x02\x02\u0140\u0145\x05 \x11\x02\u0141" +
		"\u0142\x07\f\x02\x02\u0142\u0144\x05 \x11\x02\u0143\u0141\x03\x02\x02" +
		"\x02\u0144\u0147\x03\x02\x02\x02\u0145\u0143\x03\x02\x02\x02\u0145\u0146" +
		"\x03\x02\x02\x02\u0146\u0149\x03\x02\x02\x02\u0147\u0145\x03\x02\x02\x02" +
		"\u0148\u0140\x03\x02\x02\x02\u0148\u0149\x03\x02\x02\x02\u0149\u014B\x03" +
		"\x02\x02\x02\u014A\u014C\x07\f\x02\x02\u014B\u014A\x03\x02\x02\x02\u014B" +
		"\u014C\x03\x02\x02\x02\u014C\u014D\x03\x02\x02\x02\u014D\u014E\x07B\x02" +
		"\x02\u014E\u014F\x07\x1B\x02\x02\u014F\u017C\x05 \x11\r\u0150\u0151\x07" +
		"1\x02\x02\u0151\u0152\x07\x1C\x02\x02\u0152\u0153\x05 \x11\x02\u0153\u0154" +
		"\x07\x1D\x02\x02\u0154\u017C\x03\x02\x02\x02\u0155\u0156\x072\x02\x02" +
		"\u0156\u0157\x07\x1C\x02\x02\u0157\u0158\x05 \x11\x02\u0158\u0159\x07" +
		"\x1D\x02\x02\u0159\u017C\x03\x02\x02\x02\u015A\u015B\x07A\x02\x02\u015B" +
		"\u015C\x05 \x11\x02\u015C\u015D\x07\f\x02\x02\u015D\u0162\x05 \x11\x02" +
		"\u015E\u015F\x07\f\x02\x02\u015F\u0161\x05 \x11\x02\u0160\u015E\x03\x02" +
		"\x02\x02\u0161\u0164\x03\x02\x02\x02\u0162\u0160\x03\x02\x02\x02\u0162" +
		"\u0163\x03\x02\x02\x02\u0163\u0166\x03\x02\x02\x02\u0164\u0162\x03\x02" +
		"\x02\x02\u0165\u0167\x07\f\x02\x02\u0166\u0165\x03\x02\x02\x02\u0166\u0167" +
		"\x03\x02\x02\x02\u0167\u0168\x03\x02\x02\x02\u0168\u0169\x07B\x02\x02" +
		"\u0169\u017C\x03\x02\x02\x02\u016A\u016B\x07\x04\x02\x02\u016B\u016C\x05" +
		"$\x13\x02\u016C\u016D\x07\x05\x02\x02\u016D\u017C\x03\x02\x02\x02\u016E" +
		"\u0170\x05\"\x12\x02\u016F\u016E\x03\x02\x02\x02\u0170\u0171\x03\x02\x02" +
		"\x02\u0171\u016F\x03\x02\x02\x02\u0171\u0172\x03\x02\x02\x02\u0172\u017C" +
		"\x03\x02\x02\x02\u0173\u017C\x07\x1E\x02\x02\u0174\u017C\x07\x1F\x02\x02" +
		"\u0175\u017C\x07 \x02\x02\u0176\u017C\x05J&\x02\u0177\u0178\x07A\x02\x02" +
		"\u0178\u0179\x05 \x11\x02\u0179\u017A\x07B\x02\x02\u017A\u017C\x03\x02" +
		"\x02\x02\u017B\u013E\x03\x02\x02\x02\u017B\u0150\x03\x02\x02\x02\u017B" +
		"\u0155\x03\x02\x02\x02\u017B\u015A\x03\x02\x02\x02\u017B\u016A\x03\x02" +
		"\x02\x02\u017B\u016F\x03\x02\x02\x02\u017B\u0173\x03\x02\x02\x02\u017B" +
		"\u0174\x03\x02\x02\x02\u017B\u0175\x03\x02\x02\x02\u017B\u0176\x03\x02" +
		"\x02\x02\u017B\u0177\x03\x02\x02\x02\u017C\u0185\x03\x02\x02\x02\u017D" +
		"\u017E\f\x0F\x02\x02\u017E\u017F\x07\x1A\x02\x02\u017F\u0184\x05 \x11" +
		"\x0F\u0180\u0181\f\x0E\x02\x02\u0181\u0182\x07\x1B\x02\x02\u0182\u0184" +
		"\x05 \x11\x0E\u0183\u017D\x03\x02\x02\x02\u0183\u0180\x03\x02\x02\x02" +
		"\u0184\u0187\x03\x02\x02\x02\u0185\u0183\x03\x02\x02\x02\u0185\u0186\x03" +
		"\x02\x02\x02\u0186!\x03\x02\x02\x02\u0187\u0185\x03\x02\x02\x02\u0188" +
		"\u0189\x07\x0F\x02\x02\u0189\u018A\x07\x04\x02\x02\u018A\u018B\x05J&\x02" +
		"\u018B\u018C\x07\b\x02\x02\u018C\u018F\x07*\x02\x02\u018D\u018E\x07\f" +
		"\x02\x02\u018E\u0190\x05$\x13\x02\u018F\u018D\x03\x02\x02\x02\u018F\u0190" +
		"\x03\x02\x02\x02\u0190\u0192\x03\x02\x02\x02\u0191\u0193\x07\f\x02\x02" +
		"\u0192\u0191\x03\x02\x02\x02\u0192\u0193\x03\x02\x02\x02\u0193\u0194\x03" +
		"\x02\x02\x02\u0194\u0195\x07\x05\x02\x02\u0195#\x03\x02\x02\x02\u0196" +
		"\u0197\x05&\x14\x02\u0197\u0198\x07\b\x02\x02\u0198\u0199\x05 \x11\x02" +
		"\u0199\u019A\x07\f\x02\x02\u019A\u019C\x03\x02\x02\x02\u019B\u0196\x03" +
		"\x02\x02\x02\u019C\u019F\x03\x02\x02\x02\u019D\u019B\x03\x02\x02\x02\u019D" +
		"\u019E\x03\x02\x02\x02\u019E\u01A9\x03\x02\x02\x02\u019F\u019D\x03\x02" +
		"\x02\x02\u01A0\u01A1\x05&\x14\x02\u01A1\u01A2\x07\b\x02\x02\u01A2\u01A3" +
		"\x05 \x11\x02\u01A3\u01A7\x03\x02\x02\x02\u01A4\u01A8\x07\f\x02\x02\u01A5" +
		"\u01A6\x07\x0F\x02\x02\u01A6\u01A8\x07C\x02\x02\u01A7\u01A4\x03\x02\x02" +
		"\x02\u01A7\u01A5\x03\x02\x02\x02\u01A7\u01A8\x03\x02\x02\x02\u01A8\u01AA" +
		"\x03\x02\x02\x02\u01A9\u01A0\x03\x02\x02\x02\u01A9\u01AA\x03\x02\x02\x02" +
		"\u01AA\u01AE\x03\x02\x02\x02\u01AB\u01AC\x07\x0F\x02\x02\u01AC\u01AE\x07" +
		"C\x02\x02\u01AD\u019D\x03\x02\x02\x02\u01AD\u01AB\x03\x02\x02\x02\u01AE" +
		"%\x03\x02\x02\x02\u01AF\u01B0\x05L\'\x02\u01B0\'\x03\x02\x02\x02\u01B1" +
		"\u01B2\b\x15\x01\x02\u01B2\u0248\x052\x1A\x02\u01B3\u01B4\x05B\"\x02\u01B4" +
		"\u01B6\x07A\x02\x02\u01B5\u01B7\x05> \x02\u01B6\u01B5\x03\x02\x02\x02" +
		"\u01B6\u01B7\x03\x02\x02\x02\u01B7\u01B8\x03\x02\x02\x02\u01B8\u01B9\x07" +
		"B\x02\x02\u01B9\u0248\x03\x02\x02\x02\u01BA\u01BB\x076\x02\x02\u01BB\u0248" +
		"\x05(\x15\x1B\u01BC\u01BD\x05J&\x02\u01BD\u01BE\x07\"\x02\x02\u01BE\u01BF" +
		"\x07@\x02\x02\u01BF\u01C0\x05(\x15\x17\u01C0\u0248\x03\x02\x02\x02\u01C1" +
		"\u01C2\x07-\x02\x02\u01C2\u01C3\x07\x04\x02\x02\u01C3\u01C8\x05(\x15\x02" +
		"\u01C4\u01C5\x07\f\x02\x02\u01C5\u01C7\x05(\x15\x02\u01C6\u01C4\x03\x02" +
		"\x02\x02\u01C7\u01CA\x03\x02\x02\x02\u01C8\u01C6\x03\x02\x02\x02\u01C8" +
		"\u01C9\x03\x02\x02\x02\u01C9\u01CC\x03\x02\x02\x02\u01CA\u01C8\x03\x02" +
		"\x02\x02\u01CB\u01CD\x07\f\x02\x02\u01CC\u01CB\x03\x02\x02\x02\u01CC\u01CD" +
		"\x03\x02\x02\x02\u01CD\u01CE\x03\x02\x02\x02\u01CE\u01CF\x07\x05\x02\x02" +
		"\u01CF\u0248\x03\x02\x02\x02\u01D0\u01D1\x07.\x02\x02\u01D1\u01D2\x07" +
		"\x04\x02\x02\u01D2\u01D7\x05(\x15\x02\u01D3\u01D4\x07\f\x02\x02\u01D4" +
		"\u01D6\x05(\x15\x02\u01D5\u01D3\x03\x02\x02\x02\u01D6\u01D9\x03\x02\x02" +
		"\x02\u01D7\u01D5\x03\x02\x02\x02\u01D7\u01D8\x03\x02\x02\x02\u01D8\u01DB" +
		"\x03\x02\x02\x02\u01D9\u01D7\x03\x02\x02\x02\u01DA\u01DC\x07\f\x02\x02" +
		"\u01DB\u01DA\x03\x02\x02\x02\u01DB\u01DC\x03\x02\x02\x02\u01DC\u01DD\x03" +
		"\x02\x02\x02\u01DD\u01DE\x07\x05\x02\x02\u01DE\u0248\x03\x02\x02\x02\u01DF" +
		"\u0248\x05*\x16\x02\u01E0\u01E1\x07#\x02\x02\u01E1\u01E2\x07\x04\x02\x02" +
		"\u01E2\u01E7\x05(\x15\x02\u01E3\u01E4\x07\f\x02\x02\u01E4\u01E6\x05(\x15" +
		"\x02\u01E5\u01E3\x03\x02\x02\x02\u01E6\u01E9\x03\x02\x02\x02\u01E7\u01E5" +
		"\x03\x02\x02\x02\u01E7\u01E8\x03\x02\x02\x02\u01E8\u01EB\x03\x02\x02\x02" +
		"\u01E9\u01E7\x03\x02\x02\x02\u01EA\u01EC\x07\f\x02\x02\u01EB\u01EA\x03" +
		"\x02\x02\x02\u01EB\u01EC\x03\x02\x02\x02\u01EC\u01ED\x03\x02\x02\x02\u01ED" +
		"\u01EE\x07\x05\x02\x02\u01EE\u0248\x03\x02\x02\x02\u01EF\u01F0\x07$\x02" +
		"\x02\u01F0\u01F1\x07\x04\x02\x02\u01F1\u01F6\x05(\x15\x02\u01F2\u01F3" +
		"\x07\f\x02\x02\u01F3\u01F5\x05(\x15\x02\u01F4\u01F2";
	private static readonly _serializedATNSegment1: string =
		"\x03\x02\x02\x02\u01F5\u01F8\x03\x02\x02\x02\u01F6\u01F4\x03\x02\x02\x02" +
		"\u01F6\u01F7\x03\x02\x02\x02\u01F7\u01FA\x03\x02\x02\x02\u01F8\u01F6\x03" +
		"\x02\x02\x02\u01F9\u01FB\x07\f\x02\x02\u01FA\u01F9\x03\x02\x02\x02\u01FA" +
		"\u01FB\x03\x02\x02\x02\u01FB\u01FC\x03\x02\x02\x02\u01FC\u01FD\x07\x05" +
		"\x02\x02\u01FD\u0248\x03\x02\x02\x02\u01FE\u0203\x05J&\x02\u01FF\u0203" +
		"\x07,\x02\x02\u0200\u0203\x07+\x02\x02\u0201\u0203\x07*\x02\x02\u0202" +
		"\u01FE\x03\x02\x02\x02\u0202\u01FF\x03\x02\x02\x02\u0202\u0200\x03\x02" +
		"\x02\x02\u0202\u0201\x03\x02\x02\x02\u0203\u0248\x03\x02\x02\x02\u0204" +
		"\u0205\x07A\x02\x02\u0205\u0206\x05(\x15\x02\u0206\u0207\x07\f\x02\x02" +
		"\u0207\u020C\x05(\x15\x02\u0208\u0209\x07\f\x02\x02\u0209\u020B\x05(\x15" +
		"\x02\u020A\u0208\x03\x02\x02\x02\u020B\u020E\x03\x02\x02\x02\u020C\u020A" +
		"\x03\x02\x02\x02\u020C\u020D\x03\x02\x02\x02\u020D\u0210\x03\x02\x02\x02" +
		"\u020E\u020C\x03\x02\x02\x02\u020F\u0211\x07\f\x02\x02\u0210\u020F\x03" +
		"\x02\x02\x02\u0210\u0211\x03\x02\x02\x02\u0211\u0212\x03\x02\x02\x02\u0212" +
		"\u0213\x07B\x02\x02\u0213\u0248\x03\x02\x02\x02\u0214\u0215\x07\x04\x02" +
		"\x02\u0215\u021A\x05@!\x02\u0216\u0217\x07\f\x02\x02\u0217\u0219\x05@" +
		"!\x02\u0218\u0216\x03\x02\x02\x02\u0219\u021C\x03\x02\x02\x02\u021A\u0218" +
		"\x03\x02\x02\x02\u021A\u021B\x03\x02\x02\x02\u021B\u021E\x03\x02\x02\x02" +
		"\u021C\u021A\x03\x02\x02\x02\u021D\u021F\x07\f\x02\x02\u021E\u021D\x03" +
		"\x02\x02\x02\u021E\u021F\x03\x02\x02\x02\u021F\u0220\x03\x02\x02\x02\u0220" +
		"\u0221\x07\x05\x02\x02\u0221\u0248\x03\x02\x02\x02\u0222\u022B\x07\x1C" +
		"\x02\x02\u0223\u0228\x05(\x15\x02\u0224\u0225\x07\f\x02\x02\u0225\u0227" +
		"\x05(\x15\x02\u0226\u0224\x03\x02\x02\x02\u0227\u022A\x03\x02\x02\x02" +
		"\u0228\u0226\x03\x02\x02\x02\u0228\u0229\x03\x02\x02\x02\u0229\u022C\x03" +
		"\x02\x02\x02\u022A\u0228\x03\x02\x02\x02\u022B\u0223\x03\x02\x02\x02\u022B" +
		"\u022C\x03\x02\x02\x02\u022C\u022E\x03\x02\x02\x02\u022D\u022F\x07\f\x02" +
		"\x02\u022E\u022D\x03\x02\x02\x02\u022E\u022F\x03\x02\x02\x02\u022F\u0230" +
		"\x03\x02\x02\x02\u0230\u0248\x07\x1D\x02\x02\u0231\u0232\x07%\x02\x02" +
		"\u0232\u0233\x07A\x02\x02\u0233\u0234\x05(\x15\x02\u0234\u0235\x07B\x02" +
		"\x02\u0235\u0236\x05(\x15\x02\u0236\u0237\x07&\x02\x02\u0237\u0238\x05" +
		"(\x15\x07\u0238\u0248\x03\x02\x02\x02\u0239\u023A\x05\n\x06\x02\u023A" +
		"\u023B\x05(\x15\x06\u023B\u0248\x03\x02\x02\x02\u023C\u023D\x05\x10\t" +
		"\x02\u023D\u023E\x05(\x15\x05\u023E\u0248\x03\x02\x02\x02\u023F\u0240" +
		"\x07A\x02\x02\u0240\u0241\x05(\x15\x02\u0241\u0242\x07B\x02\x02\u0242" +
		"\u0248\x03\x02\x02\x02\u0243\u0244\x07\x04\x02\x02\u0244\u0245\x05(\x15" +
		"\x02\u0245\u0246\x07\x05\x02\x02\u0246\u0248\x03\x02\x02\x02\u0247\u01B1" +
		"\x03\x02\x02\x02\u0247\u01B3\x03\x02\x02\x02\u0247\u01BA\x03\x02\x02\x02" +
		"\u0247\u01BC\x03\x02\x02\x02\u0247\u01C1\x03\x02\x02\x02\u0247\u01D0\x03" +
		"\x02\x02\x02\u0247\u01DF\x03\x02\x02\x02\u0247\u01E0\x03\x02\x02\x02\u0247" +
		"\u01EF\x03\x02\x02\x02\u0247\u0202\x03\x02\x02\x02\u0247\u0204\x03\x02" +
		"\x02\x02\u0247\u0214\x03\x02\x02\x02\u0247\u0222\x03\x02\x02\x02\u0247" +
		"\u0231\x03\x02\x02\x02\u0247\u0239\x03\x02\x02\x02\u0247\u023C\x03\x02" +
		"\x02\x02\u0247\u023F\x03\x02\x02\x02\u0247\u0243\x03\x02\x02\x02\u0248" +
		"\u027A\x03\x02\x02\x02\u0249\u024A\f\x1C\x02\x02\u024A\u024B\x07!\x02" +
		"\x02\u024B\u0279\x05(\x15\x1C\u024C\u024D\f\x1A\x02\x02\u024D\u024E\t" +
		"\x02\x02\x02\u024E\u0279\x05(\x15\x1B\u024F\u0250\f\x19\x02\x02\u0250" +
		"\u0251\t\x03\x02\x02\u0251\u0279\x05(\x15\x1A\u0252\u0253\f\x18\x02\x02" +
		"\u0253\u0254\t\x04\x02\x02\u0254\u0279\x05(\x15\x19\u0255\u0256\f\x16" +
		"\x02\x02\u0256\u0257\x07@\x02\x02\u0257\u0258\x05(\x15\x17\u0258\u0259" +
		"\b\x15\x01\x02\u0259\u0279\x03\x02\x02\x02\u025A\u025B\f\x14\x02\x02\u025B" +
		"\u025C\x07-\x02\x02\u025C\u0279\x05(\x15\x15\u025D\u025E\f\x12\x02\x02" +
		"\u025E\u025F\x07.\x02\x02\u025F\u0279\x05(\x15\x13\u0260\u0261\f\x11\x02" +
		"\x02\u0261\u0262\x07/\x02\x02\u0262\u0279\x05(\x15\x12\u0263\u0264\f\x10" +
		"\x02\x02\u0264\u0265\x070\x02\x02\u0265\u0279\x05(\x15\x11\u0266\u0267" +
		"\f\n\x02\x02\u0267\u0268\x07\x1A\x02\x02\u0268\u0279\x05(\x15\v\u0269" +
		"\u026A\f \x02\x02\u026A\u026B\x07\x17\x02\x02\u026B\u0271\x05D#\x02\u026C" +
		"\u026E\x07A\x02\x02\u026D\u026F\x05> \x02\u026E\u026D\x03\x02\x02\x02" +
		"\u026E\u026F\x03\x02\x02\x02\u026F\u0270\x03\x02\x02\x02\u0270\u0272\x07" +
		"B\x02\x02\u0271\u026C\x03\x02\x02\x02\u0271\u0272\x03\x02\x02\x02\u0272" +
		"\u0279\x03\x02\x02\x02\u0273\u0274\f\x1D\x02\x02\u0274\u0275\x07\x1C\x02" +
		"\x02\u0275\u0276\x05(\x15\x02\u0276\u0277\x07\x1D\x02\x02\u0277\u0279" +
		"\x03\x02\x02\x02\u0278\u0249\x03\x02\x02\x02\u0278\u024C\x03\x02\x02\x02" +
		"\u0278\u024F\x03\x02\x02\x02\u0278\u0252\x03\x02\x02\x02\u0278\u0255\x03" +
		"\x02\x02\x02\u0278\u025A\x03\x02\x02\x02\u0278\u025D\x03\x02\x02\x02\u0278" +
		"\u0260\x03\x02\x02\x02\u0278\u0263\x03\x02\x02\x02\u0278\u0266\x03\x02" +
		"\x02\x02\u0278\u0269\x03\x02\x02\x02\u0278\u0273\x03\x02\x02\x02\u0279" +
		"\u027C\x03\x02\x02\x02\u027A\u0278\x03\x02\x02\x02\u027A\u027B\x03\x02" +
		"\x02\x02\u027B)\x03\x02\x02\x02\u027C\u027A\x03\x02\x02\x02\u027D\u027E" +
		"\x074\x02\x02\u027E\u027F\x05(\x15\x02\u027F\u0281\x07\x04\x02\x02\u0280" +
		"\u0282\x07\x0F\x02\x02\u0281\u0280\x03\x02\x02\x02\u0281\u0282\x03\x02" +
		"\x02\x02\u0282\u0283\x03\x02\x02\x02\u0283\u0288\x05,\x17\x02\u0284\u0285" +
		"\x07\x0F\x02\x02\u0285\u0287\x05,\x17\x02\u0286\u0284\x03\x02\x02\x02" +
		"\u0287\u028A\x03\x02\x02\x02\u0288\u0286\x03\x02\x02\x02\u0288\u0289\x03" +
		"\x02\x02\x02\u0289\u028B\x03\x02\x02\x02\u028A\u0288\x03\x02\x02\x02\u028B" +
		"\u028C\x07\x05\x02\x02\u028C+\x03\x02\x02\x02\u028D\u0290\x05.\x18\x02" +
		"\u028E\u0290\x07\'\x02\x02\u028F\u028D\x03\x02\x02\x02\u028F\u028E\x03" +
		"\x02\x02\x02\u0290\u0291\x03\x02\x02\x02\u0291\u0292\x07\x1B\x02\x02\u0292" +
		"\u0293\x05(\x15\x02\u0293-\x03\x02\x02\x02\u0294\u029B\x05L\'\x02\u0295" +
		"\u0298\x07A\x02\x02\u0296\u0299\x05L\'\x02\u0297\u0299\x07\'\x02\x02\u0298" +
		"\u0296\x03\x02\x02\x02\u0298\u0297\x03\x02\x02\x02\u0299\u029A\x03\x02" +
		"\x02\x02\u029A\u029C\x07B\x02\x02\u029B\u0295\x03\x02\x02\x02\u029B\u029C" +
		"\x03\x02\x02\x02\u029C/\x03\x02\x02\x02\u029D\u029E\x05\x06\x04\x02\u029E" +
		"\u029F\x07\x02\x02\x03\u029F\u02A7\x03\x02\x02\x02\u02A0\u02A1\x05(\x15" +
		"\x02\u02A1\u02A2\x07\x02\x02\x03\u02A2\u02A7\x03\x02\x02\x02\u02A3\u02A4" +
		"\x07D\x02\x02\u02A4\u02A7\x07\x02\x02\x03\u02A5\u02A7\x07\x02\x02\x03" +
		"\u02A6\u029D\x03\x02\x02\x02\u02A6\u02A0\x03\x02\x02\x02\u02A6\u02A3\x03" +
		"\x02\x02\x02\u02A6\u02A5\x03\x02\x02\x02\u02A71\x03\x02\x02\x02\u02A8" +
		"\u02AB\x054\x1B\x02\u02A9\u02AB\x056\x1C\x02\u02AA\u02A8\x03\x02\x02\x02" +
		"\u02AA\u02A9\x03\x02\x02\x02\u02AB3\x03\x02\x02\x02\u02AC\u02AD\x05:\x1E" +
		"\x02\u02AD\u02AE\x07\x1B\x02\x02\u02AE\u02AF\x05(\x15\x02\u02AF\u02BE" +
		"\x03\x02\x02\x02\u02B0\u02B1\x07A\x02\x02\u02B1\u02B6\x05:\x1E\x02\u02B2" +
		"\u02B3\x07\f\x02\x02\u02B3\u02B5\x05:\x1E\x02\u02B4\u02B2\x03\x02\x02" +
		"\x02\u02B5\u02B8\x03\x02\x02\x02\u02B6\u02B4\x03\x02\x02\x02\u02B6\u02B7" +
		"\x03\x02\x02\x02\u02B7\u02B9\x03\x02\x02\x02\u02B8\u02B6\x03\x02\x02\x02" +
		"\u02B9\u02BA\x07B\x02\x02\u02BA\u02BB\x07\x1B\x02\x02\u02BB\u02BC\x05" +
		"(\x15\x02\u02BC\u02BE\x03\x02\x02\x02\u02BD\u02AC\x03\x02\x02\x02\u02BD" +
		"\u02B0\x03\x02\x02\x02\u02BE5\x03\x02\x02\x02\u02BF\u02C0\x07A\x02\x02" +
		"\u02C0\u02C1\x07A\x02\x02\u02C1\u02C4\x05:\x1E\x02\u02C2\u02C3\x07\f\x02" +
		"\x02\u02C3\u02C5\x05:\x1E\x02\u02C4\u02C2\x03\x02\x02\x02\u02C5\u02C6" +
		"\x03\x02\x02\x02\u02C6\u02C4\x03\x02\x02\x02\u02C6\u02C7\x03\x02\x02\x02" +
		"\u02C7\u02C8\x03\x02\x02\x02\u02C8\u02C9\x07B\x02\x02\u02C9\u02CA\x07" +
		"B\x02\x02\u02CA\u02CB\x07\x1B\x02\x02\u02CB\u02CC\x05(\x15\x02\u02CC7" +
		"\x03\x02\x02\x02\u02CD\u02D0\x07\'\x02\x02\u02CE\u02D0\x05J&\x02\u02CF" +
		"\u02CD\x03\x02\x02\x02\u02CF\u02CE\x03\x02\x02\x02\u02D09\x03\x02\x02" +
		"\x02\u02D1\u02D2\x058\x1D\x02\u02D2;\x03\x02\x02\x02\u02D3\u02D6\x077" +
		"\x02\x02\u02D4\u02D6\x05J&\x02\u02D5\u02D3\x03\x02\x02\x02\u02D5\u02D4" +
		"\x03\x02\x02\x02\u02D6=\x03\x02\x02\x02\u02D7\u02DC\x05(\x15\x02\u02D8" +
		"\u02D9\x07\f\x02\x02\u02D9\u02DB\x05(\x15\x02\u02DA\u02D8\x03\x02\x02" +
		"\x02\u02DB\u02DE\x03\x02\x02\x02\u02DC\u02DA\x03\x02\x02\x02\u02DC\u02DD" +
		"\x03\x02\x02\x02\u02DD?\x03\x02\x02\x02\u02DE\u02DC\x03\x02\x02\x02\u02DF" +
		"\u02E0\x05L\'\x02\u02E0\u02E1\x07\b\x02\x02\u02E1\u02E2\x05(\x15\x02\u02E2" +
		"\u02E6\x03\x02\x02\x02\u02E3\u02E4\x07(\x02\x02\u02E4\u02E6\x05(\x15\x02" +
		"\u02E5\u02DF\x03\x02\x02\x02\u02E5\u02E3\x03\x02\x02\x02\u02E6A\x03\x02" +
		"\x02\x02\u02E7\u02EA\x05J&\x02\u02E8\u02EA\t\x05\x02\x02\u02E9\u02E7\x03" +
		"\x02\x02\x02\u02E9\u02E8\x03\x02\x02\x02\u02EAC\x03\x02\x02\x02\u02EB" +
		"\u02EE\x05J&\x02\u02EC\u02EE\t\x06\x02\x02\u02ED\u02EB\x03\x02\x02\x02" +
		"\u02ED\u02EC\x03\x02\x02\x02\u02EEE\x03\x02\x02\x02\u02EF\u02F0\t\x07" +
		"\x02\x02\u02F0G\x03\x02\x02\x02\u02F1\u02F2\t\b\x02\x02\u02F2I\x03\x02" +
		"\x02\x02\u02F3\u02F8\x07C\x02\x02\u02F4\u02F5\x07)\x02\x02\u02F5\u02F7" +
		"\x07C\x02\x02\u02F6\u02F4\x03\x02\x02\x02\u02F7\u02FA\x03\x02\x02\x02" +
		"\u02F8\u02F6\x03\x02\x02\x02\u02F8\u02F9\x03\x02\x02\x02\u02F9K\x03\x02" +
		"\x02\x02\u02FA\u02F8\x03\x02\x02\x02\u02FB\u0300\x07C\x02\x02\u02FC\u02FD" +
		"\x05J&\x02\u02FD\u02FE\b\'\x01\x02\u02FE\u0300\x03\x02\x02\x02\u02FF\u02FB" +
		"\x03\x02\x02\x02\u02FF\u02FC\x03\x02\x02\x02\u0300M\x03\x02\x02\x02\u0301" +
		"\u0302\x07\x02\x02\x03\u0302O\x03\x02\x02\x02WSZci\x80\x88\x92\x95\x9A" +
		"\xA9\xB0\xB4\xB7\xC4\xCB\xCE\xD5\xDB\xE0\xEB\xF2\xF7\xFB\u0109\u0111\u011F" +
		"\u0127\u0129\u0132\u0134\u0145\u0148\u014B\u0162\u0166\u0171\u017B\u0183" +
		"\u0185\u018F\u0192\u019D\u01A7\u01A9\u01AD\u01B6\u01C8\u01CC\u01D7\u01DB" +
		"\u01E7\u01EB\u01F6\u01FA\u0202\u020C\u0210\u021A\u021E\u0228\u022B\u022E" +
		"\u0247\u026E\u0271\u0278\u027A\u0281\u0288\u028F\u0298\u029B\u02A6\u02AA" +
		"\u02B6\u02BD\u02C6\u02CF\u02D5\u02DC\u02E5\u02E9\u02ED\u02F8\u02FF";
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
	public operDef(): OperDefContext | undefined {
		return this.tryGetRuleContext(0, OperDefContext);
	}
	public typeDef(): TypeDefContext | undefined {
		return this.tryGetRuleContext(0, TypeDefContext);
	}
	public importOrInstance(): ImportOrInstanceContext | undefined {
		return this.tryGetRuleContext(0, ImportOrInstanceContext);
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


export class ImportOrInstanceContext extends ParserRuleContext {
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
	public moduleName(): ModuleNameContext | undefined {
		return this.tryGetRuleContext(0, ModuleNameContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.RPAREN, 0); }
	public MUL(): TerminalNode | undefined { return this.tryGetToken(QuintErrorsParser.MUL, 0); }
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
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QuintErrorsParser.RULE_importOrInstance; }
	// @Override
	public enterRule(listener: QuintErrorsListener): void {
		if (listener.enterImportOrInstance) {
			listener.enterImportOrInstance(this);
		}
	}
	// @Override
	public exitRule(listener: QuintErrorsListener): void {
		if (listener.exitImportOrInstance) {
			listener.exitImportOrInstance(this);
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


