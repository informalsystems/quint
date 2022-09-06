This is a script for running examples with `tntc`.

This script requires [`txm`](https://www.npmjs.com/package/txm) to be
installed:

```sh
npm install -g txm
```

### OK on parse Paxos

This command parses the Paxos example.

<!-- !test program
tntc parse ../examples/Paxos/Paxos.tnt
-->

```sh
tntc parse ../examples/Paxos/Paxos.tnt
```

<!-- !test check Paxos -->
    expect exit code 0

### OK on parse Voting

This command parses the Voting example.

<!-- !test program
tntc parse ../examples/Paxos/Voting.tnt
-->

```sh
tntc parse ../examples/Paxos/Voting.tnt
```

<!-- !test check Voting -->
    expect exit code 0

### OK on parse ReadersWriters

This command parses the ReadersWriters example.

<!-- !test program
tntc parse ../examples/ReadersWriters/ReadersWriters.tnt
-->

```sh
tntc parse ../examples/ReadersWriters/ReadersWriters.tnt
```

<!-- !test check ReadersWriters -->
    expect exit code 0

### OK on parse ewd840

This command parses the ewd840 example.

<!-- !test program
tntc parse ../examples/ewd840/ewd840.tnt
-->

```sh
tntc parse ../examples/ewd840/ewd840.tnt
```

<!-- !test check ewd840 -->
    expect exit code 0

### OK on parse Tendermint

This command parses the Tendermint example.

<!-- !test program
tntc parse ../examples/tendermint/TendermintAcc_004.tnt
-->

```sh
tntc parse ../examples/tendermint/TendermintAcc_004_draft.tnt
```

<!-- !test check Tendermint -->
    expect exit code 0

### OK on parse imports

This command parses the imports example.

<!-- !test program
tntc parse ../examples/imports.tnt
-->

```sh
tntc parse ../examples/imports.tnt
```

<!-- !test check imports -->
    expect exit code 0

### OK on parse instances

This command parses the instances example.

<!-- !test program
tntc parse ../examples/instances.tnt
-->

```sh
tntc parse ../examples/instances.tnt
```

<!-- !test check instances -->
    expect exit code 0

### OK on parse option

This command parses the option example.

<!-- !test program
tntc parse ../examples/option.tnt
-->

```sh
tntc parse ../examples/option.tnt
```

<!-- !test check option -->
    expect exit code 0

### OK on parse BinSearch

This command parses the BinSearch example.

<!-- !test program
tntc parse ../examples/BinSearch/BinSearch.tnt
-->

```sh
tntc parse ../examples/BinSearch/BinSearch.tnt
```

<!-- !test check BinSearch -->
    expect exit code 0

### OK on typecheck BinSearch

This command typechecks the BinSearch example.

<!-- !test program
tntc typecheck ../examples/BinSearch/BinSearch.tnt
-->

```sh
tntc typecheck ../examples/BinSearch/BinSearch.tnt
```

<!-- !test check BinSearch - Types & Effects -->
    expect exit code 0

### REPL tests

<!-- !test program tntc repl -->

#### Basic expressions

When we type type basic expressions in REPL:

<!-- !test in repl basic expressions -->

```
1 + 1
3 > 1
1.to(3).map(x => 2 * x)
1.to(4).filter(x => x > 2)
set(1, 3).union(set(5, 6))
1.to(4).forall(x => x > 1)
```

Here is what we get as the output:

<!-- !test out repl basic expressions -->

```
TNT REPL v0.0.1
Type ".exit" to exit, or ".help" for more information
>>> 2
>>> true
>>> set(2, 4, 6)
>>> set(3, 4)
>>> set(1, 3, 5, 6)
>>> false
>>> 
```

#### Definitions in expressions

We can also mix in definitions inside expressions in REPL:

<!-- !test in repl nested definitions -->

```
val x = 3; 2 * x
def mult(x, y) = x * y; mult(2, mult(3, 4))
```

Just to make sure, REPL print the outputs correctly:

<!-- !test out repl nested definitions -->

```
TNT REPL v0.0.1
Type ".exit" to exit, or ".help" for more information
>>> 6
>>> 24
>>> 
```

#### Top-level definitions

Even better, we can write top-level definitions:

<!-- !test in repl top-level definitions -->

```
val n = 4
def mult(x, y) = x * y
mult(100, n)
def powpow(x, y) = x^y
mult(100, powpow(2, 3))
```

REPL remembers them in its internal history and uses in the follow-up
expressions:

<!-- !test out repl top-level definitions -->

```
TNT REPL v0.0.1
Type ".exit" to exit, or ".help" for more information
>>> 
>>> 
>>> 400
>>> 
>>> 800
>>> 
```

#### Clear history

We can also clear history:

<!-- !test in repl clear history -->

```
val n = 4
n * n
.clear
n * n
```

REPL wipes out the history and does not compute:

<!-- !test out repl clear history -->

```
TNT REPL v0.0.1
Type ".exit" to exit, or ".help" for more information
>>> 
>>> 16
>>> 
>>> 
>>> 
```

Also, it prints errors on stderr:

<!-- !test err repl clear history -->

```
2:1: Couldn't resolve name n in definition for __input, in module __REPL
2:5: Couldn't resolve name n in definition for __input, in module __REPL
<result undefined>
```
