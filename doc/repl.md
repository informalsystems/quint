# REPL: Read-eval-print loop for TNT

| Revision | Date       | Author           |
| -------: | :--------: | :--------------- |
| 2        | 06.12.2022 | Igor Konnov      |

[REPL][] is a read-eval-print loop. A REPL is usually a good way to start
learning a language.

## Installation

You have to install `tntc` first. See [README](../tntc/README.md).

## Running REPL

At the moment, we are simply using the REPL mode of [ts-node][].

Assuming that you have cloned the [tnt repository][] at `$TNT_HOME`, run the
following commands:

```sh
$ cd $TNT_HOME/tntc
$ tntc repl
```

You will see the following output:

```sh
TNT REPL v0.0.3
Type ".help" for more information
>>>
```

## Evaluating expressions

The most basic thing we can do in REPL is to enter an expression and get the
result of its evaluation. Like this: 

```sh
>>> 1 + 3
4
```

Or like this:

```sh
>>> Set(1, 2, 3).map(i => i * 2)
Set(2, 4, 6)
```

## Introducing definitions

Typing everything in a single expression can become tedious very quickly.  To
avoid that, you can introduce top-level definitions, which will be saved in the
REPL context. For instance:

```sh
>>> def isDivisor(n, k) = n % k == 0

```

The definition `isDivisor` can be used later in the expressions:

```sh
>>> isDivisor(6, 2)
true
```


[tnt repository]: https://github.com/informalsystems/tnt
[ts-node]: https://github.com/TypeStrong/ts-node
[REPL]: https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop
