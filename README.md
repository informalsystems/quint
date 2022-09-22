# TNT is not TLA+

![build badge](https://github.com/informalsystems/tnt/actions/workflows/main.yml/badge.svg)

This is a surface syntax that uses the same background logic as TLA+ but does
not try to mimic general mathematics. Instead it mimics functional languages,
e.g., Scala and OCaml.

## Syntax

Check the [preliminary syntax](./doc/lang.md). For each construct, we give
an equivalent TLA+ expression and thus define the language semantics by
this simple translation to TLA+.

## Examples

We have written [examples](./examples) of several TLA+ specifications in TNT.
To simplify reading, use [syntax highlighting](./editor-plugins) for your
editor (currently, only vim is supported).

## User manuals

 - TNT transpiler:
   - [tntc manpage](./doc/tntc.md)

   - [Installation](./tntc/README.md)

 - TNT REPL (very much WIP toward MVP):
   - [REPL](./doc/repl.md)

## Developer docs

 - [ADR001: Transpiler architecture](./doc/adr001-transpiler-architecture.md)
 - [ADR002: Error codes](./doc/adr002-errors.md)

## Source code

 - [tntc](./tntc) is the package for the `tntc` transpiler (work-in-progress)
 - [vscode](./vscode) vscode plugin (outdated)

## Roadmap

In the spirit of [Lessons from Writing a Compiler][], we have a roadmap, where
we are implementing various transpiler passes feature-by-feature, instead of
completely implementing every pass.

| Language feature                  | Parser             | Name resolution    | Effects            | Type checker       | Simulator          | To-Apalache | Tutorials |
| :---------------                  | :----:             | :-------------:    | :-----:            | :----------:       | :-------:          | :---------: | :-------: |
| [Booleans][]                      | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Integers][]                      | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [if-then-else][]                  | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Operator definitions][]          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Modes][]                         | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                | :x:         | :x:       |
| [Sets][]                          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:/:x: | :x:     | :x:       |
| [Guess][]                         | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:         | :x:       |
| [Maps][]                          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:         | :x:       |
| [Lists][]                         | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:         | :x:       |
| [Records][]                       | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:         | :x:       |
| [Discriminated unions][]          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:         | :x:       |
| [Tuples][]                        | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :white_check_mark: | :x:         | :x:       |
| [Imports][]                       | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :question:         | :x:         | :x:       |
| [Module definitions][]            | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:         | :x:       |
| [Constant declarations][]         | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:         | :x:       |
| [Variable definitions][]          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Assumptions][]                   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:         | :x:       |
| [Module instances][]              | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:         | :x:       |
| [Lambdas][]                       | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Multiline disjunctions][]        | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Multiline conjunctions][]        | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Delayed assignment][]            | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:         | :x:       |
| [Temporal operators][]            | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                | :x:         | :x:       |
| [Fairness][]                      | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                | :x:         | :x:       |
| [Unbounded quantifiers][]         | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                | :x:         | :x:       |
| ~~Strings~~, see #118             | :white_check_mark: | :white_check_mark: | :x:                | :white_check_mark: | :x:                | :x:         | :x:       |
| ~~uninterpreted types~~, see #118 | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                | :x:         | :x:       |

## Design principles

 - *TNT should not annoy us*:

   If a language concept has "standard" syntax in the mainstream languages,
   we adopt the mainstream syntax.

 - *TNT should be easy to read*:
    - In contrast to TLA+, it keeps the set of ASCII control characters to minimum.
    - It eliminates ambiguity in several operators (of tuples, records, sequences).
    - It allows the user to specify types, if needed.

 - *TNT should be easy to write*:
    - It uses a small set of syntactic rules.
    - Most of the operators are mnemonic.
    - Rarely used operators (e.g. temporal operators) are mnemonic.
    - Constants, variables, and operators may be annotated with types,
      to get quick feedback from the type checker.
    - Well-known operators are written like in the most programming languages.
      Several examples:
        * `==` instead of just `=`,
        * `!=` instead of `/=` and `#`,
        * `&` and `and` instead of `/\`,
        * `|` and `or` instead of `\/`,
        * `not` instead of `~`,
        * `implies` instead of `=>`,
        * `/` instead of `\div`,
        * `.` instead of `!` when accessing a name in an instance.

 - *TNT should be easy to parse*: 
    - It uses a small set of syntactic rules (its ANTLR4 grammar is 120 SLOC).
    - It borrows the best practices from the programming languages.
    - It should eliminate ambiguity in all operators and idioms.

 - *TNT should be easy to pretty print*: 
    - Indentation is encouraged but not required.

 - *TNT should be compatible with TLA+*:
    - We keep one-to-one correspondence with the most of TLA+ operators.
    - There will be a transpiler to TLA+, so you can always jump back to TLA+.

 - *TNT minimizes pain points of TLA+*:
    - There is a clean separation between expressions of different modes:
        stateless, state, action, and temporal.
    - Updates to state variables are labelled as assignments: `x <- e`.
    - Recursive operators and functions are removed in favor of
      well-known concepts such as `filter`, `map`, and `fold`.
    - Module imports and instances in TNT look similar to state-of-the-art
      programming languages.

 - *TNT is CLI-first*:
    - The users should be able to parse and transpile TNT in the command-line.
    - The intermediate transpiler outputs are avaiable in JSON.
    - IDE support (such as a VSCode plugin) is a beatiful opt-in, not a requirement.

[Lessons from Writing a Compiler]: https://borretti.me/article/lessons-writing-compiler
[Imports]: ./doc/lang.md#imports-1
[Module definitions]: ./doc/lang.md#module-definition
[Constant declarations]: ./doc/lang.md#constant-declarations
[Assumptions]: ./doc/lang.md#assumptions
[Variable definitions]: ./doc/lang.md#variable-definitions
[Operator definitions]: ./doc/lang.md#variable-definitions
[Module instances]: ./doc/lang.md#module-instances
[Lambdas]: ./doc/lang.md#lambdas-aka-anonymous-operators
[Booleans]: ./doc/lang.md#boolean-operators-and-equality
[Integers]: ./doc/lang.md#integers
[Sets]: ./doc/lang.md#sets
[Lists]: ./doc/lang.md#lists-aka-sequences
[Multiline disjunctions]: ./doc/lang.md#multiline-disjunctions
[Multiline conjunctions]: ./doc/lang.md#multiline-conjunctions
[if-then-else]: ./doc/lang.md#condition
[Guess]: ./doc/lang.md#existential-quantifier-and-non-deterministic-choice
[Maps]: ./doc/lang.md#maps-aka-functions
[Records]: ./doc/lang.md#records
[Discriminated unions]: ./doc/lang.md#discriminated-unions
[Tuples]: ./doc/lang.md#tuples
[Delayed assignment]: ./doc/lang.md#delayed-assignment
[Temporal operators]: ./doc/lang.md#temporal-operators
[Fairness]: ./doc/lang.md#fairness
[Unbounded quantifiers]: ./doc/lang.md#unbounded-quantifiers
[Modes]: ./doc/lang.md#modes
