# Lesson 4 - Fun with sets
## 1. Introduction

*Progress:*  0%

In this tutorial, we explain the most powerful data structure of Quint.
Yes, that's right, sets are the most powerful data structure.

To make the tutorial a bit more entertaining, we will help an anonymous crypto
[Degen](https://www.coingecko.com/en/glossary/degen), who asked us to help
with Quint. We only know their handle
[@KryptoCoffeeCat](https://twitter.com/KryptoCoffeeCat).
They want to trade a few coins over different exchanges. They have collected
all the pairs of coins they could exchange, but this table is not easy to
analyze:

| Coin A   | Coin B  |
| -------- | ------- |
| BTC      | USDC    |
| BTC      | USDT    |
| ETH      | USDC    |
| ETH      | USDT    |
| EVMOS    | USDC    |
| EVMOS    | WETH    |
| ETH      | WETH    |
| ATOM     | EVMOS   |
| ATOM     | JUNO    |
| ATOM     | OSMO    |
| ATOM     | JUNO    |
| EVMOS    | JUNO    |
| EVMOS    | OSMO    |

For example, @KryptoCoffeeCat want to know whether they could exchange BTC
for ATOM by doing up to three swaps. Unfortunately, @KryptoCoffeeCat have lost
access to their browser, as they did not update it as often as it was required.
Now they are stuck with the
[Quint REPL](https://github.com/informalsystems/quint/blob/main/doc/quint.md#command-repl).
Fortunately, they have found the
[Quint cheatsheet](https://github.com/informalsystems/quint/blob/main/doc/quint-cheatsheet.pdf).
We will help them!

In this tutorial, you will see how to:
 
  - use tuples,
 
  - use sets,

  - do plenty of interesting computations over sets.

        
        

If you would like to see the complete code before diving into
the details, check [sets.qnt](./sets.qnt).
        
## 2. Defining swap pairs

*Progress:*  7%

**Code snippet:**

```bluespec
module sets {
  // We represent swap pairs as tuples of two strings
  type Pair = (str, str)

  // the first element of a pair
  pure def fst(pair: Pair): str = pair._1

  // the second element of a pair
  pure def snd(pair: Pair): str = pair._2
```


Since @KryptoCoffeeCat write down swap pairs in their table,
the most natural way of representing a row in this table is a pair.
Hence, we declare the type `Pair` as `(str, str)`. This type is a special
case of a tuple.

In general, tuples of the same type contain a fixed number
of elements, which can have different types themselves.
Tuples are a very simple data structure in Quint that basically
has two kinds of operations:

            

 - We can construct a tuple. For example:
            

```sh
echo '("BTC", "ETH")' | quint
```


 - We can access a tuple element via special fields `_1`, `_2`, etc.
   For example:
            

```sh
echo '("BTC", "ETH")._2' | quint
```

## 3. Defining available pairs

*Progress:*  14%

**Code snippet:**

```bluespec

  // all available swap pairs as a set of tuples
  pure val availablePairs = Set(
    ("BTC", "USDC"), ("BTC", "USDT"), ("ETH", "USDC"), ("ETH", "USDT"),
    ("EVMOS", "USDC"), ("EVMOS", "WETH"), ("ETH", "WETH"), ("ATOM", "EVMOS"),
    ("ATOM", "JUNO"), ("ATOM", "OSMO"), ("EVMOS", "JUNO"), ("ATOM", "JUNO"),
    ("EVMOS", "OSMO")
  )
```


Once we have decided to use tuples to represent the rows of the table,
we can define the table of all pairs as the set `availablePairs`.

Would it make sense to use an array or a list instead? The answer is yes,
provided that our goal was to write an efficient implementation. However,
our goal is to describe the problem in a way that is free of irrelevant
implementation details. In this case, the set is the best data structure:

 - The table of swap pairs was written in *some* order, but this order is
   actually irrelevant. @KryptoCoffeeCat wrote the pairs in some order,
   but they could do it differently.

 - The table *should not contain duplicate pairs*. If you look carefully,
   @KryptoCoffeeCat wrote the pair `("ATOM", "JUNO")` twice.
   We can see that Quint removed the duplicates:

            

```sh
echo 'availablePairs' | quint -r sets.qnt::sets
```

## 4. Testing set elements

*Progress:*  21%

**Code snippet:**

```bluespec

  pure val hasAtomJuno = ("ATOM", "JUNO").in(availablePairs)

  pure val hasEvmosEth = availablePairs.contains(("EVMOS", "ETH"))
```


The simplest thing @KryptoCoffeeCat can do with `availablePairs` is
to check, which pairs are in the table. For example, try the
following definitions:

            

```sh
echo 'hasAtomJuno' | quint -r sets.qnt::sets
```


```sh
echo 'hasEvmosEth' | quint -r sets.qnt::sets
```

## 5. Testing some elements and all elements

*Progress:*  28%

**Code snippet:**

```bluespec

  pure val hasAtom = availablePairs.exists(p => p._1 == "ATOM")

  // is SCRT missing from the pairs?
  pure val missingScrt =
    availablePairs.forall(p => p._1 != "SCRT" and p._2 != "SCRT")
```


Now @KryptoCoffeeCat check whether they could swap Atom for some coins
and that they cannot swap Secret for any coin:

            

```sh
echo 'hasAtom' | quint -r sets.qnt::sets
```


```sh
echo 'missingScrt' | quint -r sets.qnt::sets
```


This works. However, @KryptoCoffeeCat notice that their definition of
`hasAtom` was not exactly right. The definition tests only the first element
of the pair. Actually, @KryptoCoffeeCat realize that the order of coins in
every pair does not matter. So we should treat the pair `("ATOM", "JUNO")`
to be the same as the pair `("JUNO", "ATOM")`. But this does not work as
expected:
            

```sh
echo '("ATOM", "JUNO") == ("JUNO", "ATOM")' | quint
```


After a bit of thinking @KryptoCoffeeCat realizs that they already know how to
express that the order of coins does not matter: Just use a set instead of a tuple.
Yes, @KryptoCoffeeCat, this is the way!
            
## 6. Mapping pairs to sets

*Progress:*  35%

**Code snippet:**

```bluespec

  // swap pairs as two-element sets (unordered pairs)
  pure val availableUnorderedPairs =
    availablePairs.map(p => Set(p._1, p._2))

  pure val hasAtomRight = availableUnorderedPairs.exists(p => "ATOM".in(p))
```


After having the moment of revelation @KryptoCoffeeCat, decide to redefine the
set `availablePairs`. This time the set should contain sets like
`Set("ATOM", "JUNO")` instead of pairs like `("ATOM", "JUNO")`.
@KryptoCoffeeCat does not want to write the whole table again. So they quickly
map every pair `p` in `availablePairs` to the `Set(p._1, p._2)`.

The type of `availableUnorderedPairs` is `Set[Set[str]]`, that is,
a set that contains sets of strings. Will that work in Quint? @KryptoCoffeeCat's
friends tell them that programming languages need a bit of boilerplate like
defining hashes, comparators, and equality. Sets of sets work in Quint out of
the box:

            

```sh
echo 'availableUnorderedPairs' | quint -r sets.qnt::sets
```


Now @KryptoCoffeeCat can fix the definition of `hasAtom`. They write down
the definition `hasAtomRight`. This makes them happy. Time to have a coffee!
            
## 7. Filtering sets

*Progress:*  42%

**Code snippet:**

```bluespec

  // all unordered pairs that contain ATOM at one end
  pure val atomPairs = availableUnorderedPairs.filter(p => p.contains("ATOM"))
```


The next thing @KryptoCoffeeCat want to do with `availableUnorderedPairs` is
to see, which pairs can be swapped with Atom.
To this end, they filter the set `availableUnorderedPairs` as in `atomPairs`:

            

```sh
echo 'atomPairs' | quint -r sets.qnt::sets
```


The set `atomPairs` contains only those unordered pairs that satisfy this
condition.
            
## 8. Counting the number of elements

*Progress:*  50%

**Code snippet:**

```bluespec

  // the number of swap pairs
  pure val howMany = availableUnorderedPairs.size()
```


To see how many swap pairs are available, @KryptoCoffeeCat
use the operator `size` in the definition `howMany`:

            

```sh
echo 'howMany' | quint -r sets.qnt::sets
```

## 9. Flattening sets

*Progress:*  57%

**Code snippet:**

```bluespec

  // get all coins that appear in pairs
  pure def coinsInPairs(pairs: Set[Set[str]]): Set[str] = pairs.flatten()

  // all coins in our swap pairs
  pure val coins = coinsInPairs(availableUnorderedPairs)
```


Now @KryptoCoffeeCat wonder what kind of coins could be swapped at all.
This seems to be hard to figure out. Fortunately, they discover the right
operator in the cheatsheet. It's called `flatten`:

            

```sh
echo 'availableUnorderedPairs.flatten()' | quint -r sets.qnt::sets
```


It is easy to see how `flatten` works by evaluating
`availableUnorderedPairs.flatten()`. This operator computes the set
that contains all elements of the set's direct elements, which must be sets
themselves.
            
## 10. Reachability via one or two swaps

*Progress:*  64%

**Code snippet:**

```bluespec

  // an example of `someCoins` in `buyableVia1Swap`
  pure def someCoinsExample = Set("ATOM", "ETH", "USDT")

  // which coins can be bought by swapping a coin from `someCoins` once?
  val buyableVia1Swap(someCoins) =
    availableUnorderedPairs
      .filter(p => p.intersect(someCoins).size() == 1)
      .flatten()
      .exclude(someCoins)

  // which coins can be bought by swapping a coin from `someCoins` exactly twice?
  val buyableVia2Swaps(someCoins) =
    someCoins
      .buyableVia1Swap()
      .buyableVia1Swap()

  // which coins can be bought by swapping a coin from `someCoins` twice?
  val buyableVia1or2Swaps(someCoins) =
    buyableVia1Swap(someCoins)
      .union(buyableVia2Swaps(someCoins))
```


@KryptoCoffeeCat are a bit tired of this tutorial. Their real goal is to find
the coins that could be bought by one or two swaps. This sounds hard but it
is not.

How to find, whether a pair from `availableUnorderedPairs` involves a
coin from `someCoins`? For example, assume that we have an unordered pair
`Set("ATOM", "EVMOS")` and a set `someCoinsExample` that is defined as
`Set("ATOM", "ETH", "USDT")`.
Since `Set("ATOM", "EVMOS")` is a two-element set,
it's easy: We compute the intersection of `Set("ATOM", "EVMOS")`
and `someCoinsExample`. If the pair involves a coin from
`someCoinsExample`, such an intersection should contain exactly
one coin. Let's check that:

            

```sh
echo 'Set("ATOM", "EVMOS").intersect(someCoinsExample)' | quint -r sets.qnt::sets
```


This works, so @KryptoCoffeeCat filter the whole set of `availableUnorderedPairs`
with the following condition:
            

```sh
echo 'availableUnorderedPairs.filter(p => p.intersect(someCoinsExample).size() == 1)' | quint -r sets.qnt::sets
```


However, there is a small issue: The result has the type of a set of two-element
sets (of strings), whereas they need a set of strings (coins).
@KryptoCoffeeCat already know how to solve this problem, by calling `flatten()`:
            

```sh
echo 'availableUnorderedPairs.filter(p => p.intersect(someCoinsExample).size() == 1).flatten()' | quint -r sets.qnt::sets
```


Finally, they do not need the coins that they started with, that is, `someCoinsExample`.
Hence, they add `exclude(someCoinsExample)` to the result. The complete
definition is written in `buyableVia1Swap`.

@KryptoCoffeeCat want to see how this actually works. So they try:
            

```sh
echo 'buyableVia1Swap(Set("ATOM"))' | quint -r sets.qnt::sets
```


This seems to work!

Now @KryptoCoffeeCat want to see what is possible to buy by doing exactly two
swaps. This is also easy: Just call `buyableVia1Swap` twice. This works:
            

```sh
echo 'buyableVia2Swaps(Set("ATOM"))' | quint -r sets.qnt::sets
```


And how would they find out what could be bought by one or two swaps?
Also easy: Just take the set union of what is possible in one or two swaps:            
            

```sh
echo 'buyableVia1or2Swaps(Set("ATOM"))' | quint -r sets.qnt::sets
```

## 11. Reachability via multiple swaps

*Progress:*  71%

**Code snippet:**

```bluespec

  // which coins can we buy via n swaps when starting from `someCoins`
  val buyableNSwaps(someCoins, n) =
    1.to(n).fold(someCoins,
                 (prevCoins, i) => buyableVia1Swap(prevCoins))
```


@KryptoCoffeeCat want to know how to find the coins that could be bought
after a given number of swaps, not just 1 or 2. This is also quite easy.
First, we have to understand how to iterate over numbers 1, 2, ..., n.
There are several ways to do that in Quint. Since we are talking about sets
in this tutorial, we will see how to do that using sets.

Quint has the operator `i.to(j)` that constructs the set `Set(i, ..., j)`.
Let's try it:

            

```sh
echo '3.to(10)' | quint
```


Now @KryptoCoffeeCat want to write something like this in pseudo JavaScript:

```js
var prevCoins = someCoins
for (let i = 0; i < n; i++) {
  prevCoins = buyableVia1Swap(prevCoins)
}
// use prevCoins
```

@KryptoCoffeeCat find a blog post on medium.com about
[Exploring folds](https://medium.com/@zaid.naom/exploring-folds-a-powerful-pattern-of-functional-programming-3036974205c8)
in JavaScript. It happens that Quint supports exactly this pattern, though it
has a slightly different syntax:

```bluespec
1.to(n)
 .fold(someCoins,
       (prevCoins, i) => buyableVia1Swap(prevCoins))
```

The above expression iterates over the set `1.to(n)` in *some order*
and passes the previously computed value as the first argument `prevCoins`
and a set element as the second argument `i`. It's important that the order
of iteration is not known in advance. However, it does not matter here, as we
are not even using `i`. @KryptoCoffeeCat could even have written `_`
instead of `i` in the above expression, which would indicate that the second
argument is not used:

```bluespec
1.to(n)
 .fold(someCoins,
       (prevCoins, _) => buyableVia1Swap(prevCoins))
```

Now @KryptoCoffeeCat can compute what they can buy via various numbers of swaps:
            

```sh
echo 'buyableNSwaps(Set("ATOM"), 3)' | quint -r sets.qnt::sets
```


```sh
echo 'buyableNSwaps(Set("ATOM"), 4)' | quint -r sets.qnt::sets
```


```sh
echo 'buyableNSwaps(Set("ATOM"), 5)' | quint -r sets.qnt::sets
```

## 12. Power to the folds!

*Progress:*  78%

**Code snippet:**

```bluespec

  // Higher-order operators do not work in REPL atm:
  // https://github.com/informalsystems/quint/issues/221

  // inSet.exists(myFun) can be expressed via `fold`, when `inSet` is finite
  //val myExists(inSet: Set[a], pred: a => bool): bool =
  //  inSet.fold(false, (result, elem) => result or pred(elem))

  // inSet.forall(myFun) can be expressed via `fold`, when `inSet` is finite
  //val myForall(inSet: Set[a], pred: a => bool): bool =
  //  inSet.fold(true, (result, elem) => result and pred(elem))

  // inSet.filter(myFun) can be expressed via `fold`, when `inSet` is finite
  //val myFilter(inSet: Set[a], pred: a => bool): Set[a] =
  //  inSet.fold(Set(),
  //    (result, elem) =>
  //      if (pred(elem)) result.union(Set(elem)) else result)

  // inSet.map(myFun) can be expressed via `fold`, when `inSet` is finite
  //val myMap(inSet: Set[a], mapper: a => b): Set[b] =
  //  inSet.fold(Set(),
  //    (result, elem) => result.union(Set(mapper(elem))))

  // flatten(inSet) can be expressed via `fold`, when `inSet` is finite
  //val myFlatten(inSet: Set[Set[a]]): Set[a] =
  //  inSet.fold(Set(), (result, elem) => result.union(elem) )
```


When @KryptoCoffeeCat decided to learn a bit more about `fold`, they have found
that this operator is quite powerful. For instance, they could write their
own versions of `exists`, `forall`, `filter`, `map`, and `flatten`.
Does it mean that they should use `fold` everywhere now? Better not.
Although folds can express a lot of things, they should be used when really
required. After all, `exists`, `forall`, `filter`, `map`, `flatten`
are much easier to read.
        
## 13. Computing cycles with powersets

*Progress:*  85%

**Code snippet:**

```bluespec

  // all combinations of unordered pairs that have exactly 4 pairs
  pure val quads =
    availableUnorderedPairs
      .powerset()
      .filter(pairs => pairs.size() == 4)

  // Do pairs form a cycle? If they do, then for every participating coin,
  // there are exactly two pairs that have this coin in common.
  pure def isCycle(pairs: Set[Set[str]]): bool = {
    pure def appearsTwice(coin) = {
      pairs.filter(ps => coin.in(ps)).size() == 2
    }
    // for every coin that appears in `pairs`,
    // there are exactly two pairs that cointain it
    coinsInPairs(pairs).forall(appearsTwice)
  }

  // all pair cycles of length 4
  pure val cycles4 = quads.filter(isCycle)
```


OK, here is a real challenge for @KryptoCoffeeCat! Can they find four pairs
that could be swapped in some order, so the sequence of swaps starts with
one coin and ends with the same coin? Degens love swap cycles!

To do that, they first write `availableUnorderedPairs.powerset()`, which
blasts `availableUnorderedPairs` into a huge set that contains all combinations
of pairs. These sets have all possible sizes. @KryptoCoffeeCat filter out the
sets that are not quadruples. How many quadruples are there? Let's see:

            

```sh
echo 'quads.size()' | quint -r sets.qnt::sets
```


Phew. It will take @KryptoCoffeeCat hours to analyze all these pairs by hand.
How do we know that some pairs form a cycle? Let's have a look at an example:

| Coin A   | Coin B  |
| -------- | ------- |
| JUNO     | ATOM    |
| ATOM     | OSMO    |
| OSMO     | EVMOS   |
| EVMOS    | JUNO    |

There is an interesting property here. Every coin appears exactly twice in
the above set. By browsing [Wikipedia](https://en.wikipedia.org/wiki/Main_Page),
@KryptoCoffeeCat found that a slightly more general observation was made by
Leonard Euler about 300 years ago, when he analyzed
[the bridges of Königsberg](https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg).
Not bad, @KryptoCoffeeCat!

After figuring out the cycles, @KryptoCoffeeCat write the predicate `isCycle`
and finally the definition `cycles4`. Now they compute all these cycles in a
single click:
            

```sh
echo 'cycles4' | quint -r sets.qnt::sets
```

## 14. Conclusions

*Progress:*  92%


@KryptoCoffeeCat has learned a lot in this tutorial.
By looking at the
[Quint cheatsheet](https://github.com/informalsystems/quint/blob/main/doc/quint-cheatsheet.pdf),
they have found that this tutorial did not cover two operators on sets.
Can you find them too?

If you are writing code in programming languages such as JavaScript, Rust,
Golang, Java, Python, and similar, sets may be not your everyday data
structure (such as arrays and lists), though there is a good chance that you
have used sets before. In Quint, it's the opposite. If there is a problem,
then sets are most likely there to solve it. If not, you can use maps or lists,
which will be explained in follow up tutorials.

        
## The end

  You have made it!
      