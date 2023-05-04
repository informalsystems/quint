# Story008: REPL History

| Revision | Date       | Author                  |
|---------:|:----------:|:------------------------|
|        1 | 2023-05-04 | Igor Konnov             |

This is a UX design document for the history interaction in REPL. This document
helps us to understand the user stories before implementing them.

Over the last months, we had several requests that could be unified under a
common theme that is related to state and history inspection.

 - [#446][]
 - [#795][]
 - [#347][]
 - [#303][]
 - [#288][]

This document is using [kettle][] as a running example. We assume that
a Quint REPL session is run in the directory of the example:

```sh
$ cd ./tutorials/repl
$ quint
Quint REPL 0.9.1
Type ".exit" to exit, or ".help" for more information
>>> import kettle.* from "./kettle"

```

## Story 1: Inspect the current state

Assume that we have initialized the protocol state with `init`:

```bluespec
>>> init
true
```

**Current interface**. Currently, we can inspect the state, by evaluating
the variable names:

```bluespec
>>> temperature
20
>>> heatingOn
false
>>> beeping
false
```

However, it is often more convenient to see the value of all the state variables
at once, e.g., when we do not remember them. The issues [#446][] and [#795][]
highlight this idea.

A workaround is to introduce a definition like the following one:

```bluespec
// a handy definition that captures the state in a record
val kettleState = {
  heatingOn: heatingOn,
  beeping: beeping,
  temperature: temperature
}
```

**Proposed interface**. The simplest yet powerful interface is to introduce the
system state as a record that is accessible via a standard name. We decided to
use the name `q::state`. Here is an example:

```bluespec
>>> q::state
{
  beeping: false,
  heatingOn: false,
  temperature: 20,
}
```

Since `q::state` is simply a `val`, we would be do all kinds of programmatic things with it:

```bluespec
>>> q::state.fieldNames()
Set("beeping", "heatingOn", "temperature")

>>> q::state.temperature
20
```

## Story 2: Inspect the history

Assume that we have executed a few steps:

```bluespec
>>> init
true
>>> pressButton
true
>>> heat
true
>>> depressButton
true
```

**Current interface**. After executing a few steps, we can inspect the reached
state. However, we would not be able to inspect the intermediate states, e.g.,
the states reached by executing `init`, then `pressButton`, then `heat`.

As mentioned in [#446][], it would be great to observe the sequence of visited
states. Currently, the only way to do that is by replaying the actions from the
start and printing the intermediate states after executing every action.

**Proposed interface**. Similar to Story 1, we are proposing to use a standard
name such as `q::history`. Note that we are not using the name `q::trace`, as a
trace should start in an initial state and continue with the transitions made by
the transition relation, e.g., as defined by `step`. A history is simply a list
of states that were produced somehow.

For the sequence `init.then(pressButton).then(heat).then(depressButton)`, we
expect `q::history` to evaluate as follows:

```bluespec
>>> q::history
[
  { beeping: false, heatingOn: false, temperature: 20 },
  { beeping: false, heatingOn: true, temperature: 20 },
  { beeping: false, heatingOn: true, temperature: 21 },
  { beeping: false, heatingOn: false, temperature: 21 },
]
```

Since `q::history` is simply a `val`, we can access it programatically:

```bluespec
>>> q::history.length()
4
>>> q::history[3].temperature - q::history[0].temperature
1
```

## Story 3: Navigate the history


[#446]: https://github.com/informalsystems/quint/issues/446
[#795]: https://github.com/informalsystems/quint/issues/795
[#347]: https://github.com/informalsystems/quint/issues/347
[#303]: https://github.com/informalsystems/quint/issues/303
[#288]: https://github.com/informalsystems/quint/issues/288
[kettle]: https://github.com/informalsystems/quint/blob/main/tutorials/repl/kettle.qnt