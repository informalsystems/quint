# ADR006: Design of modules and lookup tables

| Revision | Date       | Author           |
| :------- | :--------- | :--------------- |
| 1        | 28.03.2023 | Igor Konnov      |

<!-- 
This ADR is written as a literate programming document, preprocessed by:

https://github.com/driusan/lmt
-->

## 1. Summary

We propose a new syntax for modules and instances. Since this discussion was
motivated by the implementation, we propose a minimal API for organizing
various static information, including lookup tables.

## 2. Context

The module system for Quint has always been the second priority. It was mainly
designed after TLA<sup>+</sup> modules and instances, with a few cosmetic
fixes. In the recent attempts to implement instances and lookup tables, we have
found that our intuition around the behavior of modules and instances starts to
break. Hence, we have decided to redesign this part of the language and the
related parts of the implementation.

### 2.1. Current approach

#### 2.1.1. Modules and imports

We encapsulate pure functional definitions in a distinct module (called `fun`
below), and import its definitions in the module that specifies the general
behavior of the state machine (called `general` below):

```scala generated/adr006before.qnt +=
module fun {
  pure def dec(i) = i - 1
  pure def inc(i) = i + 1
}

module general {
  import fun.*

  // to be defined later
<<<definitions>>>
}
```

Currently, the lookup tables for `fun` and `general` look like that:

```mermaid
graph LR
    subgraph "table for 'fun': { id: 9, ...}"
      fdec["def 'dec': { reference: 4, ...}"]
      finc["def 'inc': { reference: 8, ...}"]
      i1["param 'i': { reference: 4, scope: 4, ...}"]
      i2["param 'i': { reference: 8, scope: 8, ...}"]
    end
    subgraph "table for 'general': { id: 25, ...}"
      pdec["def 'dec': { reference: 4, scope: 25 }"]
      ...
    end

    subgraph "Intermediate representation"
      dec["def 'dec': { id: 4, ... }"]
      inc["def 'inc': { id: 8, ... }"]
    end

    finc --> inc
    fdec --> dec
    i1 --> dec
    i2 --> inc
    pdec --> dec
```


We define constants, variables, and actions of `general` as follows:


```scala "definitions" +=
  const N: int
  var x: int

  action init = x' = N
  action step = x' = dec(x)
```

#### 2.1.2. Instances

Having defined `general`, we define its fixed-size instances in the module
`fixed`:

```scala generated/adr006before.qnt +=
module fixed {
  module I3 = general(N = 3)
  module I5 = general(N = 5)

  action init3 = I3::init
  action init5 = I5::init

  import I3.*
}
```

We do not give detailed lookup tables here, as they tend to get too large too
fast.  We only highlight the essential parts of the lookup tables:

```mermaid
graph LR
    subgraph "table for 'general': { id: 25, ...}"
      pdec["def 'dec': { reference: 4, scope: 25 }"]
      pN["const 'N': { reference: 13 }"]
      px["const 'x': { reference: 15 }"]
      ...
    end
    subgraph "table for 'fixed': { id: 36, ...}"
      N3["const 'I3::N': { reference: 27, scope: 36 }"]
      x3["const 'I3::x': { reference: 15, scope: 36 }"]
      N5["const 'I5::N': { reference: 29, scope: 36 }"]
      x5["const 'I5::x': { reference: 15, scope: 36 }"]
      fN["const 'N': { reference: 27, scope: 36 }"]
      fx["const 'x': { reference: 15, scope: 36 }"]
      ...
    end

    subgraph "Intermediate representation"
      dec["def 'dec': { id: 4, ... }"]
      N["const 'N': { id: 13, ... }"]
      x["var 'x': { id: 15, ... }"]
      three["int 3: { id: 27, ... }"]
      five["int 5: { id: 29, ... }"]
    end

    pdec --> dec
    px --> x
    pN --> N
    N3 --> three
    x3 --> x
    N5 --> five
    x5 --> x
    fN --> three
    fx --> x
```

It should be clear that the lookup tables are currently tuned towards
particular kinds of analysis such as type checking. They are not general enough
to work other kinds of stages such as simulation: For simulation, `I3::x` and
`I5::x` should point to two different instances of `x`, whereas they currently
point to the same variable.

## 3. Options

TBD


## 4. Solution

TBD

