/**
 * Tokens that are used by the Quint grammar.
 *
 * @author: Igor Konnov, Shon Feder, Gabriela Moreira, Jure Kukovec, Thomas Pani
 *          Informal Systems, 2021-2023
 */
grammar QuintTokens;

// we need at least one rule to make it a grammar
empty: EOF;

// literals
// Strings cannot be escaped, as they are pseudo-identifiers.
STRING          : '"' .*? '"' ;
BOOL            : ('false' | 'true') ;
// Similar to Solidity, integer literals can be written in two formats:
//  - Decimal, possibly, with '_' as separators, or
//  - Hexadecimal, possibly, with '_' as separators.
INT             : ('0' | [1-9]([0-9]|'_'[0-9])* | '0x' [0-9a-fA-F]([0-9a-fA-F]|'_'[0-9a-fA-F])*) ;

// a few keywords
AND             :   'and' ;
OR              :   'or'  ;
IFF             :   'iff' ;
IMPLIES         :   'implies' ;
SET             :   'Set' ;
LIST            :   'List' ;
MAP             :   'Map' ;
MATCH           :   'match' ;
PLUS            :   '+' ;
MINUS           :   '-' ;
MUL             :   '*' ;
DIV             :   '/' ;
MOD             :   '%' ;
GT              :   '>' ;
LT              :   '<' ;
GE              :   '>=' ;
LE              :   '<=' ;
NE              :   '!=' ;
EQ              :   '==' ;
ASGN            :   '=' ;
LPAREN          :   '(' ;
RPAREN          :   ')' ;

// other TLA+ identifiers
IDENTIFIER      : ([a-zA-Z][a-zA-Z0-9_]*|[_][a-zA-Z0-9_]+) ;

DOCCOMMENT : '///' .*? '\n';

// comments and whitespaces
LINE_COMMENT    :   '//' .*? '\n'   -> skip ;
COMMENT         :   '/*' .*? '*/'   -> skip ;
WS              :   [ \t\r\n]+      -> skip ; // skip spaces, tabs, newlines
