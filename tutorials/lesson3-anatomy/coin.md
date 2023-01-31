# Lesson 3 - Basic anatomy of a protocol in Quint
## 1. Introduction

*18 more steps to the finish line*

In this tutorial, we explain the standard structure of a Quint protocol.
Although Quint does not impose a very rigid structure on the protocol designers,
we have found that following the same practices helps protocol authors and
readers to cooperate more effectively.

As a running example we are using the subcurrency smart contract that
is introduced in the Solidity documentation, see
[Subcurrency](https://docs.soliditylang.org/en/v0.8.17/introduction-to-smart-contracts.html#subcurrency-example).
You do not have to know Solidity to understand our tutorial.
On contrary, you may acquire some basic understanding of Solidity contracts
by reading the Quint protocol specification.

The subcurrency smart contract defines a basic protocol that has the following features:

 - A single user (the protocol creator) is assigned the "minter" role.

 - The minter may generate new coins on the balances of the users, including themselves.

 - The users may send coins to other users, provided that they have enough coins
   on their balance.

In this tutorial, you will see how to:

 - Specify basic type aliases.

 - Define handy functions that can be used independently of the protocol.

 - Define the structure of the protocol states.

 - Define helper functions that read the current state but do not modify it.

 - Define actions that read and modify the current state of the protocol.

 - Define basic protocol invariants.

 - Write basic protocol tests.

 - Write protocol tests that use non-determinism.

 - Run a basic randomized test to discover an invariant violation.

        
        

If you would like to see the complete code before diving into
the details, check [coin.qnt](./coin.qnt).
        
## 2. Declare a single module

*17 more steps to the finish line*

**Code snippet:**

```scala
module Coin {
```


We have to declare at least one module.
In general, a single file may contain multiple module declarations at the top level.
Nested module declarations are not allowed.

In this tutorial, we are declaring a single module. Contrary to the common engineering
practice, we recommend to start with a single module and introduce multiple modules only
if you are going to reuse different parts of your protocol.
        
## 3. Declare types

*16 more steps to the finish line*

**Code snippet:**

```scala

    // TYPE DEFINITIONS

    // encode addresses as string literals
    type Addr = str

    // We declare a Solidity uint (256 bit) as an alias of Quint int.
    // Note that these UInt values are still integers, which can get
    // arbitrarily large. Hence, we have to take care of overflows.
    // In the future, Quint will have a standard library for that.
    type UInt = int
```


Similar to programming languages, it is common in Quint to declare type
aliases for the types that appear in the protocol description often.
A type alias is simply a declaration of the form:

```scala
type [name] = [type];
```

In the above definition, `[name]` is a unique identifier that will be associated
with the type, and `[type]` is the type to be associated with the name, e.g.,
`int` or `Set[int]`. To see a complete description of all available types, visit the Section
[Type System 1.2](https://github.com/informalsystems/quint/blob/main/doc/lang.md#type-system-12)
of the language manual.

Although it is convenient to declare type aliases, it is not mandatory.
Protocol authors should decide together with their audience, whether they prefer
minimal type definitions, or they like abundance of types. Quint replaces type aliases
with the types in the right-hand sides of `type`. For example, it does not distinguish between
different kinds of "integers", when they refferred to via different type aliases.
        
## 4. Declare pure functions

*15 more steps to the finish line*

**Code snippet:**

```scala

    // FUNCTIONAL LAYER:
    // Values and functions that are state-independent

    // the maximal value Solidity UInt can carry
    pure val MAX_UINT = 2^256 - 1

    // does a big integer represent Solidity uint?
    pure def isUInt(i: int): bool = (0 <= i and i <= MAX_UINT)
```



It often happens that a protocol requires auxilliary definitions that do not
depend on the protocol state, but only depend on the values of their parameters.
Such computations are often called "pure". In the above code, we define two
pure definitions:
 
 - The pure value `MAX_UINT`.

 - The pure definition `isUInt` that computes, whether an integer is within
   the range from 0 to MAX_UINT (inclusive).

The main property of pure values is that they always return the same value.
Pure definitions always return the same value, when they are supplied with the
same arguments.

To see that no state is needed, evaluate these definitions in REPL:

            

```sh
echo "MAX_UINT" | quint -r coin.qnt::Coin
```


```sh
echo "isUInt(22)" | quint -r coin.qnt::Coin
```


```sh
echo "isUInt(-1)" | quint -r coin.qnt::Coin
```


```sh
echo "isUInt(MAX_UINT + 1)" | quint -r coin.qnt::Coin
```


The functional layer is actually quite powerful. We can describe a lot of
protocol behavior at the functional layer. However, we postpone this discussion
for a more advanced tutorial.

As you can see, we have omitted the type of `MAX_UINT` but specified the type
of `isUInt`. Most of the time, it is up to you. The type checker can infer the
types of values and operator definitions. In rare cases, the type checker may
get confused, and then explicit type annotations may help you in figuring out
the issue.
            
## 5. Declare the protocol parameters

*14 more steps to the finish line*

**Code snippet:**

```scala

    // STATE MACHINE:
    // State-dependent definitions and actions

    // Currently, we fix the set of all addresses to a small set.
    // In the future, we will be using the commented-out constant declaration.
    // For now, we are using simple aliases instead of actual Ethereum addresses.
    //const ADDR: Set[Addr]
    pure val ADDR = Set("null", "alice", "bob", "charlie", "eve")
```



In this step, we are starting to describe the protocol structure and behavior
in terms of a state machine.        

It often happens that protocols are parameterized in the sense that the protocol
may be instantiated for different parameter values, and different instances
still make sense. The typical parameters are:

 - the set of all possible addresses,

 - the address that performs a special role,

 - minimal and maximal values,

 - timeout values.

For this purpose, Quint offers `const` declarations. You can see one of them
in the commented out section of the code above. Constant declarations are not
fully supported yet. They will be available as soon as the issue
[#528](https://github.com/informalsystems/quint/issues/528) is closed.

At the moment, we simply declare the value for small set of addresses `ADDR`,
in order to be able to iterate on the protocol specification quickly.
        
## 6. Declare the protocol state

*13 more steps to the finish line*

**Code snippet:**

```scala

    // the minter's address
    var minter: Addr
    // the balances in the subcurrency tokens
    var balances: Addr -> UInt
```



As a next step, we declare state variables, which together represent
a state of the protocol. In the above code, we introduce two such variables:

 - The variable `minter` to store the minter's address.
   The type of this variable is `Addr`.

 - The variable `balances` to store the balances of all users.
   The type of this variable is `Addr -> UInt`, which means a map from
   values of type `Addr` to values of type `UInt`.

In contrast to operator definitions, variable definitions always require
a type. Otherwise, it may be too hard for the type checker to infer the
types of the state variables.

If you compare the above variable definitions to the relevant variable
declarations in the Solidity contract, you should see that our variable
declarations are conceptually similar, modulo a slightly different syntax
of Solidity:


```Solidity
    // in Solidity:
    address public minter;
    mapping (address => uint) public balances;
```    
        
## 7. Declare operators over states

*12 more steps to the finish line*

**Code snippet:**

```scala
    // a handy definition to query the whole state in REPL at once
    def state = { minter: minter, balances: balances }
```



It is often convenient to define a few helper operators.

We start with the definition of `state` that represents the entire
state as a record. This is what we do in the above code with the definition of
`state`. Notice that the definition of `state` is not `pure` anymore. It is
referring to the state variables and thus cannot be pure.

You can try to evaluate the definition of `state` in REPL right away:

            

```sh
echo "state" | quint -r coin.qnt::Coin
```


If you tried that, you saw several error messages. The reason is that the state
variables are not initialized by default. We would have to introduce an
initialization action, which is usually called `init`. You will see how to
do that in the next step.
            
## 8. Declare `require` and `totalSupply`

*11 more steps to the finish line*

**Code snippet:**

```scala
    
    // a helper function to make preconditions similar to Solidity
    def require(cond: bool): bool = cond

    // compute the total supply of coins over all balances
    val totalSupply = ADDR.fold(0, (sum, a) => sum + balances.get(a))
```



In the above code, we introduce a helper definition `require` that
evaluates its Boolean parameter. As you might have noticed, this
definition is not doing anything useful. We introduce it to make the code
a bit more accessible for the first-time readers who are familiar with
Solidity.

The definition of `totalSupply` may look a bit complex to you,
if you have never seen similar code before. Let's break it down in smaller
pieces:

 - The definition of `totalSupply` defines a value, but not a `pure` one.
   Hence, even though `totalSupply` does not take any parameters,
   it implicitly depends on the state. As a result, `totalSupply`,
   may evaluate to different values
   in different states, that is, in the states, where the values of `minter`
   and `balances` differ.

 - `ADDR.fold(0, f)` iterates over the set of addresses in *some order*
   and for every address `a`, it applies `f(s, a)` for the accumulator value `s`,
   which is initialized with 0. In our example, the operator `f` is defined as
   an anonymous lambda operator: `(sum, a) => sum + balances.get(a)`. For our
   definition of `ADDR`, the computed value would be equal to:

   ```scala
    ((((0 + balances.get("null")) + balances.get("alice")) + balances.get("bob"))
      + balances.get("charlie")) + balances.get("eve")
   ```

   *Note that the order of the addresses in the brackets may be different from
   the one above. Hence, you should not rely on the particular order, when
   using `fold`. We are fine when using commutative operators such as `+` and `*`.*

        
## 9. Declare an initializer `init`

*10 more steps to the finish line*

**Code snippet:**

```scala

    // state initialization
    action init: bool = {
        // since the contract can be initialized by an arbitrary message sender,
        // we choose the sender from the set of all addresses non-deterministically.
        nondet sender = oneOf(ADDR)
```



As you may have seen in the previous steps, the state variables `minter` and `balances`
are not initialized by default. In order to compute an initial state (there may be
several!), we define a special action that we call an *initializer*. In our
code, such an action is called `init`.

This definition is essential for describing the protocol. When you read somebody else's
protocol, it is one of the key parts to look at.

If we go back to the Solidity code, it looks like follows:

```Solidity
    // in Solidity
    constructor() {
        minter = msg.sender;
    }
```

In the Solidity code, the constructor is using an implicit parameter `msg.sender`,
which is propagated from a user request by the Ethereum Virtual Machine. Quint
does not have any built-in mechanism for reading the user input. Instead, Quint
offers a very powerful mechanism of non-deterministic choice. This is
exactly what we do with the following line of code:

```scala
nondet sender = oneOf(ADDR)
```

This expression non-deterministically chooses one value from the set `ADDR`
(assuming that the set is not empty) and binds this value to the name `sender`.
The qualifier `nondet` indicates that the value of `sender` is special: the
value of `sender` evaluates to the same value in a single run, but *it may
evaluate to two different values in twp different runs, even when it was
evaluated in identical states of the two runs*. This behavior may look
complicated, but this is exactly what we expect from the user input too:
The user may submit different inputs, even when the protocol resides in
two identical states.

        
## 10. Assign initial values to the state variables

*9 more steps to the finish line*

**Code snippet:**

```scala
        all {
            minter' = sender,
            balances' = ADDR.mapBy(a => 0)
        }
    }
```



Once we have understood the value of `sender`, the rest of `init` is simple.
The value of `minter` is set to the value of `sender`, whereas the value
of `balances` is set to the map that maps all addresses from `ADDR`
to value 0. Notice that the variables `minter` and `balances` are not assigned
their new values immediately, but they are assigned the values, once `init` is
evaluated completely (and only if `init` was evaluated to `true`).

Now we can call `init` and evaluate an initialized state in REPL:

            

```sh
echo "init\n state" | quint -r coin.qnt::Coin
```


**Exercise:** Call `init` multiple times in REPL and evaluate `state` after
each call. Did you get the same initial states every time or were some states
different?

Remember that we said `init` was an initializer? We said that because `init`
only assigns next values to state variables, but does not read their previous values.

**Exercise:** Modify the assignment to `balances` in such a way that `minter`
gets 1000 coins, while the other addresses get 0 coins, as before.
Hint: use `if (cond) value1 else value2`.
            
## 11. Defining the action `send`

*8 more steps to the finish line*

**Code snippet:**

```scala

    // Sends an amount of newly created coins to an address.
    // Can only be called by the minter, that is, the contract creator.
    // Note that we have to add `sender` as an action parameter,
    // which is accessed via implicit `msg.sender` in Solidity.
    action mint(sender: Addr, receiver: Addr, amount: UInt): bool = all {
        require(sender == minter),
        val newBal = balances.get(receiver) + amount
        all {
            // Solidity does the overflow check under the hood.
            // We have to add it ourselves.
            require(isUInt(newBal)),
            // update the balances and keep the minter address
            balances' = balances.set(receiver, newBal),
            minter' = minter,
        }
    }
```



Similar to Solidity, we define the action `mint`. In contrast to `init`,
we have decided to avoid non-deterministic choice in `mint`.
Instead we are passing the user inputs as action parameters. You will see
later that this makes debugging and testing easier.

If you understood how `init` works, the behavior of `mint` should be also
easy to figure out. If you wonder what `get` and `set` are doing, here is
the explanation:

 - `balances.get(receiver)` produces the value assigned to the key `receiver`
   in the map `balances`. If the key `receiver` has no value assigned in
   the map `balances`, REPL would show a runtime error.

 - `balances.set(receiver, newBal)` produces a new map, that assigns
   the value of `newBal` to the key `receiver`, and keeps the other key-value
   pairs as in `balances`.

Now it's time to mint some coins in REPL! Try the following:

            

```sh
echo 'init\n mint(minter, "bob", 2023)\n state' | quint -r coin.qnt::Coin
```


As you can see, we can mint coins for Bob.

**Exercise:** Mint more coins for Bob, actually, mint `MAX_UINT` coins.
Do you understand what happened in this case?
            
## 12. Defining the action `send`

*7 more steps to the finish line*

**Code snippet:**

```scala

    // Sends an amount of existing coins from any caller (sender)
    // to a receiver's address.
    // Note that we have to add `sender` as an action parameter,
    // which is accessed via implicit `msg.sender` in Solidity.
    action send(sender: Addr, receiver: Addr, amount: UInt): bool = all {
        require(not(amount > balances.get(sender))),
        if (sender == receiver) {
            balances' = balances
        } else {
            val newSenderBal = balances.get(sender) - amount
            val newReceiverBal = balances.get(receiver) + amount
            all {
                // Again, Solidity does an automatic overflow test.
                // We do it ourselves.
                require(isUInt(newSenderBal)),
                require(isUInt(newReceiverBal)),
                balances' =
                    balances
                    .set(sender, newSenderBal)
                    .set(receiver, newReceiverBal)
            }
        },
        // keep the minter unchanged
        minter' = minter,
    }
```



If you understood the mechanics of the action `mint`, you should easily
figure out the behavior of `send`.

Play with `mint` and `send` in REPL! The simplest scenario would be:

            

```sh
echo 'init\n mint(minter, "bob", 2023)\n send("bob", "eve", 1024)\n state' | quint -r coin.qnt::Coin
```

## 13. Defining a protocol step

*6 more steps to the finish line*

**Code snippet:**

```scala

    // All possible behaviors of the protocol in one action.
    // Note that random simulation produces valid inputs to
    // this action with a low probability, since amount are chosen at random.
    // A symbolic model checker such as Apalache does not have any problem
    // with this. Random simulation requires a more restricted version of step.
    action step: bool = {
        nondet sender = oneOf(ADDR)
        nondet receiver = oneOf(ADDR)
        nondet amount = 0.to(MAX_UINT).oneOf()
        // execute one of the available actions/methods
        any {
            mint(sender, receiver, amount),
            send(sender, receiver, amount),
        }
    }
```



Finally, we can put together `mint` and `send` to describe every possible
transition of the protocol! To this end, we non-deterministically choose
the sender, the receiver, and the amount (from the set of integers from 0
to `MAX_UINT`, inclusive). The expression `any { ... }` executes one of its
arguments; if both could be executed, one of them is executed
non-deterministically.

**Exercise:** Run REPL, execute `init` once and execute `step` multiple times.
Do you understand why some of the occurrences of `step` evaluate to `false`
and some evaluate to `true`? It may help you, if you print `state` after `init`
and `step`.

We have defined the state variables, the initializer, and the protocol stop.
This is the minimal set of prerequisites for defining a working protocol.
What we have achieved here is great! You can play with the protocol, feed it
with different parameters in REPL, and experiment with your protocol.

Although you should definitely play with the protocol at this point, we urge you
not to stop here! In the next steps, we will show you the real magic of Quint.
        
## 14. Expected properties

*5 more steps to the finish line*

**Code snippet:**

```scala

    // INVARIANTS AND TEMPORAL PROPERTIES
```



Having defined the protocol behavior with `init` and `step`, it is time to think
about what we expect from the protocol. This is a good place for specifying
protocol invariants and temporal properties.

        
## 15. Defining the most basic invariant

*4 more steps to the finish line*

**Code snippet:**

```scala

    // One of the simplest properties is that all balances are within the uint range.
    // While it is automatically guaranteed by Solidity, our specification is using
    // big integers. Hence, it makes sense to check the range.
    val balancesRangeInv: bool = {
        ADDR.forall(a =>
            val b = balances.get(a)
            (0 <= b) and (b <= MAX_UINT)
        )
    }
```



One of the most basic properties that we expect from the protocol is defined
with the property `balancesRangeInv`. This property goes over all addresses
in `ADDR` and tests, whether the value stored in `balances` for every address
is in the range from `0` to `MAX_UINT` (inclusive).

            

```sh
echo 'init\n balancesRangeInv\n mint(minter, "bob", 2023)\n balancesRangeInv\n send("bob", "eve", 1024)\n balancesRangeInv\n ' | quint -r coin.qnt::Coin
```


Properties like `balancesRangeInv` are called invariants, because we expect
them to hold in every state that could be produced by `init` and a number of
`step` actions. Intuitively, whatever happens, the property should hold true.

It is important to distinguish between the properties that we like to be invariants
and the properties that we have proven to be invariants. To be precise, the former
properties are called *invariant candidates*, whereas the latter are actually
called *invariants*.
            
## 16. Defining the total supply invariant

*3 more steps to the finish line*

**Code snippet:**

```scala

    // It is desirable that the total supply of tokens fits into UInt.
    // Otherwise, we may have some suprises in the code that relies on this property.
    // Evaluate this 
    val totalSupplyDoesNotOverflowInv: bool = {
        isUInt(totalSupply)
    }
```



Another basic invariant that we intuitively expect to hold is defined in
`totalSupplyDoesNotOverflowInv`. It is so simple that it should hold true, right?
If we have your attention now, read further!

**Exercise:** Extend the protocol with a state variable called `totalMinted`,
initialize it with 0 and increase it in `mint` with the `amount` passed to `mint`.

        
## 17. Temporal properties

*2 more steps to the finish line*

**Code snippet:**

```scala

    // The temporal property that says the following:
    // If `NoSupplyOverflow` holds in a state, then this state may not
    // produce a computation that ends in another state,
    // where totalSupplyDoesNotOverflowInv is violated.
    //
    // Temporarily disabled, until the issue below is fixed:
    // [#591](https://github.com/informalsystems/quint/issues/591).
    //
    // temporal NoSupplyOverflow: bool = always(totalSupplyDoesNotOverflowInv)
```



After we have defined state invariants, we should normally think about
temporal properties in general such as safety and liveness. However, 
temporal properties are an advanced topic, and smart
contracts are typically focused on safety. Thus, it is safe to skip this topic
for now. It is just important to know that temporal properties are labelled
with the qualifier `temporal`.

        
## 18. Tests

*1 more step to the finish line*

**Code snippet:**

```scala

    // TESTS

    // send should not work without minting
    run sendWithoutMintTest = {
        init.then(send(minter, "bob", 5))
            .fail()
    }
```



So far, we have been running sequences of actions in REPL, to get
basic understanding of the protocol mechanics. While REPL is capable of
replaying actions one-by-one, it would be more convenient to run something
similar to unit tests or integration tests, which are ubiquitous in
programming languages.

We normally add tests in the very bottom of the protocol module, or in
a separate module.

Quint introduces runs that are can be used to express "happy paths"
and tests. The above code shows a simple test `sendWithoutMintTest`.
In this test, the action `init` runs first. If it evaluates to `true`,
then the action `send(...)` is run. Since this action is composed with
`fail()`, the action `send(...)` is expected to evaluate to `false`.

            

```sh
echo 'sendWithoutMintTest' | quint -r coin.qnt::Coin
```

## The end

  You have made it!
      