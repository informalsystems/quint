# Roadmap

In the spirit of [Lessons from Writing a Compiler][], we have a roadmap, where
we are implementing various transpiler passes feature-by-feature, instead of
completely implementing every pass.

- :white_check_mark: Completed
- :green_circle: Won't get in your way, but there's still work to be done
- :x: Not implemented yet

| Language feature                  | Parser             | Name resolution    | Effects            | Type checker       | Simulator          | To-Apalache        | Tutorials          |
|:----------------------------------|:------------------:|:------------------:|:------------------:|:------------------:|:------------------:|:------------------:|:------------------:|
| [Booleans][]                      | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Integers][]                      | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [if-then-else][]                  | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Operator definitions][]          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Modes][]                         | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Sets][]                          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [nondet][]                        | :white_check_mark: | :white_check_mark: | :green_circle:     | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Maps][]                          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                |
| [Lists][]                         | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                |
| [Records][]                       | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                |
| [Tuples][]                        | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Sum types][]                     | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                |
| [Imports][]                       | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Module definitions][]            | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Module instances][]              | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                |
| [Multiple files][]                | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Constant declarations][]         | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                |
| [Variable definitions][]          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Assumptions][]                   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: [235][]        | :white_check_mark: | :x:                |
| [Lambdas][]                       | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Multiline disjunctions][]        | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Multiline conjunctions][]        | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Delayed assignment][]            | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Invariant checking                | -                  | -                  | -                  | -                  | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Higher-order definitions][]      | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                |
| [Runs][]                          | :white_check_mark: | :white_check_mark: | :green_circle:     | :white_check_mark: | :white_check_mark: | *non-goal*         | :white_check_mark: |
| [Temporal operators][]            | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | *non-goal*         | :white_check_mark: | :x:                |
| [Fairness][]                      | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | *non-goal*         | :white_check_mark: | :x:                |
| [Unbounded quantifiers][]         | :white_check_mark: | :white_check_mark: | :x:                | :x:                | *non-goal*         | :x:                | :x:                |
| [String literals][], see #118     | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| ~~uninterpreted types~~, see #118 | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                | :x:                | :x:                |

<!-- TODO rm unused links -->
[Design Principles]: ./doc/design-principles.md
[Apalache]: https://github.com/informalsystems/apalache
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
[nondet]: ./doc/lang.md#existential-quantifier-and-non-deterministic-choice
[Maps]: ./doc/lang.md#maps-aka-functions
[Records]: ./doc/lang.md#records
[Tuples]: ./doc/lang.md#tuples
[Sum types]: ./doc/lang.md#sum-types
[Delayed assignment]: ./doc/lang.md#delayed-assignment
[Runs]: ./doc/lang.md#runs
[Temporal operators]: ./doc/lang.md#temporal-operators
[Fairness]: ./doc/lang.md#fairness
[Unbounded quantifiers]: ./doc/lang.md#unbounded-quantifiers
[Modes]: ./doc/lang.md#modes
[Spells]: ./examples/spells/README.md
[Contribute your spell]: ./examples/spells/contribute-your-spell.md
[539]: https://github.com/informalsystems/quint/issues/539
[221]: https://github.com/informalsystems/quint/issues/221
[235]: https://github.com/informalsystems/quint/issues/235
[8]: https://github.com/informalsystems/quint/issues/8
[1034]: https://github.com/informalsystems/quint/issues/1034
[Higher-order definitions]: https://github.com/informalsystems/quint/blob/main/doc/lang.md#operator-definitions
[String literals]: https://github.com/informalsystems/quint/blob/main/doc/lang.md#identifiers-and-strings
[TLA+]: https://lamport.azurewebsites.net/tla/tla.html
[TLA]: https://en.wikipedia.org/wiki/Temporal_logic_of_actions
[Visual Studio Code Marketplace]: https://marketplace.visualstudio.com/items?itemName=informal.quint-vscode
[Tutorials]: ./tutorials/README.md
[Quint zulip stream]: https://informal-systems.zulipchat.com/#narrow/stream/378959-quint
[Quint discussions]: https://github.com/informalsystems/quint/discussions
[ITF traces]: https://apalache.informal.systems/docs/adr/015adr-trace.html
[ITF Trace Viewer]: https://marketplace.visualstudio.com/items?itemName=informal.itf-trace-viewer
[15 minute intro to Quint]: https://youtu.be/OZIX8rs-kOA
