function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)))
}

function commaSep(rule) {
    return optional(commaSep1(rule))
}

module.exports = grammar({
    name: "quint",
    conflicts: $ => [[$._qualifiedName, $._identifierOrUnderscore], [$.typeTuple], [$.name, $.opcode]],
    extras: $ => [$.LINE_COMMENT, $.COMMENT, $._WS],
    rules: {
        root: $ => repeat($.module),
        module: $ => seq("module", field("name", $.moduleName), "{", prec(7, field("declarations", repeat($._decl))), "}"),

        _qualifiedName: $ => seq($._identifier, repeat(seq("::", $._identifier))),
        name: $ => $._qualifiedName,
        moduleName: $ => $._qualifiedName,
        opcode: $ => $._qualifiedName,

        // _identifier: $ => token($.__identifier),
        _identifier: $ => /[a-zA-Z][a-zA-Z0-9_]*/,
        _identifierOrUnderscore: $ => choice($._identifier, "_"),
        _identifierOrStar: $ => choice($._identifier, "*"),

        _decl: $ => seq(optional($.docComment), choice(
            $.opdefDecl,
            $.constDecl,
            $.varDecl,
            $.assumeDecl,
            $.importDecl,
            $.exportDecl,
            $.instanceDecl,
        )),

        expression: $ => prec.left(choice(
            $.app,
            $.lambda,
            prec(-1, $.name),
            $.int,
            $.bool,
            $.string,
            $.letIn,
            $.nondet,
            seq("(", $.expression, ")"),
            seq("{", $.expression, "}"),
        )),

        app: $ => prec.left(choice(
            prec(6, choice(
                // apply a built-in operator via the dot notation
                prec.right(6, seq(field("selfArg", $.expression), '.', field("opcode", $.opcode), prec(7, field("args", optional(seq('(', $._argList, ')')))))),
                // Call a user-defined operator or a built-in operator.
                // The operator has at least one argument (otherwise, it's a 'val').
                prec.right(6, seq(field("opcode", $.opcode), '(', field("args", optional($._argList)), ')')),
                // list access via index
                seq($.expression, '[', $.expression, ']'),
                // tuple access via index
                seq($.expression, '.', field("index", $.tupleIndex)),
            )),
            prec.right(5, seq($.expression, "^", $.expression)),
            prec.left(4, seq($.expression, choice("*", "/", "%"), $.expression)),
            prec.left(3, seq($.expression, choice("+", "-"), $.expression)),
            prec.left(2, seq($.expression, choice(">", ">=", "<", "<=", "==", "!="), $.expression)),
            $._infixApp,
            $.assign,
            $.tuple,
            $.pair,
            $.record,
            $.list,
            $.ifElse,
            seq(field("opcode", $.expressionAggregator), "{", prec.left(commaSep1($.expression)), optional(","), "}"),
        )),

        _infixApp: $ => prec.left(6, choice(
            seq($.expression, field("opcode", "and"), $.expression),
            seq($.expression, field("opcode", "or"), $.expression),
            seq($.expression, field("opcode", "iff"), $.expression),
            seq($.expression, field("opcode", "implies"), $.expression),
            seq($.expression, field("opcode", "match"), repeat1(seq("|", $.string, ":", $.parameter, "=>", $.expression))),
        )),

        assign: $ => seq($.name, "'", "=", $._highPrecedenceExpression),

        expressionAggregator: $ => choice("and", "or", "any", "all"),
        qualifier: $ => choice("val", "def", seq("pure", "val"), seq("pure", "def"), "action", "run", "temporal"),

        _argList: $ => prec.right(commaSep1($.expression)),

        parameter: $ => $._identifierOrUnderscore,
        lambda: $ => choice(
            seq($.parameter, "=>", $._highPrecedenceExpression),
            seq("(", commaSep1($.parameter), ")", "=>", $._highPrecedenceExpression),
        ),

        _highPrecedenceExpression: $ => prec(7, $.expression),

        tuple: $ => seq("(", $.expression, ",", $.expression, repeat(seq(",", $.expression)), optional(","), ")"),
        pair: $ => prec.left(1, seq($.expression, "->", $.expression)),
        record: $ => seq("{", $.recElem, repeat(seq(",", $.recElem)), optional(","), "}"),
        list: $ => seq("[", optional(seq($.expression, repeat(seq(",", $.expression)))), optional(","), "]"),
        ifElse: $ => seq("if", "(", $.expression, ")", $.expression, "else", $.expression),
        letIn: $ => seq($.opdefDecl, $.expression),
        nondet: $ => prec.right(seq($.nondetOperDef, $.expression)),

        nondetOperDef: $ => seq("nondet", $.name, optional(seq(":", $.type)), "=", prec.right(7, $.expression), optional(";")),
        recElem: $ => choice(seq($._identifier, ":", $.expression), seq("...", $.expression)),

        constDecl: $ => seq("const", field("name", $.name), ":", field("typeAnnotation", $.type)),
        varDecl: $ => seq("var", field("name", $.name), ":", field("typeAnnotation", $.type)),
        assumeDecl: $ => seq("assume", $._identifier, "=", $.expression),
        instanceDecl: $ => seq("import", field("protoName", $.moduleName),
            "(",
            field("overrides", commaSep1(seq(field("param", $.name), "=", field("expression", $.expression)))),
            ")",
            choice(seq(".", "*"), $.moduleQualification),
            $.fromClause,
        ),

        importDecl: $ => seq("import", field("protoName", $.moduleName), choice($.moduleSpecialization, $.moduleQualification), optional($.fromClause)),
        exportDecl: $ => seq("export", field("protoName", $.moduleName), choice($.moduleSpecialization, $.moduleQualification)),

        moduleSpecialization: $ => seq(".", field("defName", $._identifierOrStar)),
        moduleQualification: $ => seq("as", field("qualifiedName", $.moduleName)),
        fromClause: $ => seq("from", field("fromSource", $.string)),

        _typedParameter: $ => seq($.parameter, ":", $.type),
        _cLikeParameters: $ => prec(5, seq("(", commaSep($._typedParameter), ")", ":", $.type)),

        opdefDecl: $ => seq(
            field('qualifier', $.qualifier),
            field('name', $.name),
            optional(choice(
                // ML-like parameter lists
                prec(3, seq(
                    "(",
                    optional(seq($.parameter, repeat(seq(",", $.parameter)))),
                    ")",
                    optional(seq(":", $.type))
                )),
                // C-like parameter lists
                $._cLikeParameters,
                // No parameters
                seq(":", $.type)
            )),
            // Making this optional causes conflicts
            "=",
            field('expression', $._highPrecedenceExpression),
            optional(";")
        ),

        type: $ => prec.left(choice(
            prec.right(seq($.type, "->", $.type)),
            prec.right(seq($.type, "=>", $.type)),
            $.typeOper,
            seq("Set", "[", $.type, "]"),
            seq("List", "[", $.type, "]"),
            $.typeTuple,
            seq("{", optional($.row), "}"),
            repeat1($.typeUnionRecOne),
            "int",
            "str",
            "bool",
            $.name,
            seq("(", $.type, ")")
        )),

        typeOper: $ => prec.left(seq("(", commaSep($.type), optional(","), ")", "=>", $.type)),
        typeTuple: $ => prec.left(seq("(", $.type, ",", commaSep1($.type), optional(","), ")", $.type)),

        typeUnionRecOne: $ => seq("|", "{", $.name, ":", $.string, optional(seq(",", $.row)), optional(","), "}"),
        row: $ => prec.left(choice(
            seq(
                commaSep1(seq($.rowLabel, ":", $.type)),
                optional(choice(",", seq("|", field("rowVar", $._identifier))))
            ),
            seq("|", field("rowVar", $._identifier))
        )),
        rowLabel: $ => $._identifier,
        tupleIndex: $ => /_[1-9][0-9]?/,

        string: $ => seq("\"", repeat(choice(/[^"\\]/, /\\./)), "\""),
        bool: $ => choice('false', 'true'),
        int: $ => /\d+/,


        docComment: $ => seq("///", /.*/),
        LINE_COMMENT: $ => /\/\/.*/,
        COMMENT: $ => seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
        _WS: $ => /[ \t\r\n]+/,
    },
});
