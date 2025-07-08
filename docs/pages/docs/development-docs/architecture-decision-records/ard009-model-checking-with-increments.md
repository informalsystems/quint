# ADR009: Model checking with increments

| Revision | Date       | Author           |
| :------- | :--------- | :--------------- |
| 1        | 2025-07-08 | Gabriela Moreira |

## Summary

This explores an idea of using our Rust backend to model check properties of Quint models. The initial exploration is focused on checking inductive invariants, as I have found limitations of both TLC and Apalache and felt like there was an opportunity to do better in this scope. This should be adaptable into a full explicit-state model checker with little effort.

## Problem

Checking inductive invariants requires considering all states that satisfy the inductive invariant. For TLC, this means enumerating all those states. Apalache could be more effective here, but as I tried the [Jellyfish Merkle Tree][] model from Left Curve, I got (big) heap memory limits being hit still in Apalache's pre-processing phases, probably due to the complexity of the spec and it's types. I was hoping to be able to check some inductive properties of this model with TLC since we were able to model check something close to what I wanted in a setting with 1 or 2 steps.

However, I was not.
1. Trying to enumerate any big enough set in TLC causes (big) heap memory limits to be hit
2. Trying to do enumerate things gradually using `exists` statements works, but it doesn't scale at all, taking several minutes to compute 1k states and getting worse over time.

I believe the reason why TLC has trouble computing all initial states in (2) is that it is hard to checkpoint and backtrack between non-deterministic choices within the same state. Take this example, assuming `f` and `g` are computationally intensive:
```quint
action init =
  nondet a = ...
  nondet b = ...
  f(a) + g(b)
```

Backtracking here would mean to keep the value of `f(a)` and then recompute only `g(b)` for each different b. If `f` is an expensive computation (as we have in Left Curve spec), being able to not have to recompute `f(a)` every time is very meaningful. This problem goes away in multiple steps:

```quint
action init =
  nondet a = ...
  x' = f(a)

action step =
  nondet b = ...
  x' = x + g(b)
```

There's also an additional advantage of the multiple-step approach in relation to doing it all in the same state: if `f(a)` is the same for two different `a`'s, we can save an entire extra sweep on the possibilities of `b`. I haven't solve this problem yet, as I don't now how to look at the expression in `init` and decide which parts I want to save results as I'd save states in the multiple step approach. I should be possible, but my experiment focused on not having to recompute `f(a)` for each different `a`.

## Solution

We make `nondet` generation stateful, where the main part of the state is a counter for the bounds of the set from which we pick elements from. We make use of the `pick` function written for Quint's internal values like intervals, powersets, sets of maps, etc, which enables us to obtain the next element of the set without having to enumerate it. The whole state looks like this in the PoC:
```rust
pub struct NondetState {
    // Bounds so we now how to properly implement each position, and when to finish
    pub bounds: Vec<usize>,
    // A closure containing the call for `pick` over this set. More efficient
    // than calling `pick` every time, as some parts of the procedure can be
    // pre-computed and captured by the closure.
    pub closure: Rc<dyn Fn(&mut dyn std::iter::Iterator<Item = usize>) -> Value>,
    // Stateful part: the current positions and whether we have more positions to explore
    pub counter: Vec<usize>,
    pub done: bool,
}
```

While exploring multiple (nested) `nondet` definitions, we keep track of the states for each of them. This state should be different depending on the larger state in which we found ourselves, which can be identified by:
1. The state-machine state we are on (or `None` if we are computing the initial state)
2. The counters of all nondet picks made so far (in the call stack)

We represent this identification as follows:
```rust
pub struct Choices {
    pub state: Option<u64>,
    pub picks: Vec<Vec<usize>>,
}
```

To complete the nondet identification, we also add the id of the nondet definition to disambiguate things that I cannot really describe, but sense that exist:
```rust
pub struct NondetId {
    pub id: QuintId,
    pub choices: Choices,
}
```

`Choices` is kept in it's own struct as we also need to keep track of that as we go further and backwards in evaluation. We add the two following variables to `Env`:
```rust
pub struct Env {
    // ...
    pub nondet_states: FxHashMap<NondetId, NondetState>,
    pub choices: Choices,
}
```

### Backtracking to cycle through states

Backtracking seemed like the only solution where I could avoid keeping too many things in memory. So the core idea is that we increment the innner (most nested) counters before implementing the outter ones. This allow us to cache values for the outter ones for more time (more on caching later).

```rust
let should_increment = !env.nondet_states.iter().any(|(k, state)| {
    k.choices.picks != env.choices.picks
        && k.choices.picks.starts_with(&env.choices.picks)
        && !state.done
});
```

In the PoC, it works with the simulator setup, and I think we can keep that. So we don't change anything in the search strategy, except that nondet choices now use the counters instead of getting a random position. This makes it so we can still cap the samples, and work in a sample-based setting, which I think would make things easier to parallelize.

PS: I haven't done anything for `any` in the PoC, but the same principles should apply, hopefully in a simpler form.

### Caching

We want to cache the result for each expression depending on the nondet, except for the nondet that is the last one in the nested nondets, as it would be incremented in the next iteration, and the cached values would never be used.

This is hard without a pre-processing pass that detects nested levels before compilation. But I managed to do it by having some procedures in the first time we find a nondet, which are not necessary from the second time we find it as there we already know the nested levels and bounds.

So we track:
1. Ids which we should not cache, which includes the most nested nondet definition and any expression that uses it (recursively)
2. Ids to cache, along with the scope in which they were cached (`Choices` made so far), and the cached value. This starts with the nondet definition itself, and we add any expressions that use it (recursively).
  - When facing an operator application like `f(a, b, c)`, we need to consider the different combinations of caching from the args in order to decide whether and how to cache the result of the application:
    - If any arg is saved as "do not cache", we also don't cache the result. If we did, we'd have to discard it in the next iteration, which is just overhead.
    - Otherwise, if more than one arg got cached (after its evaluation, doesn't mean it had to be already cached beforehand), we get the longest (most nested) `NondetId`. So if
      - `a` is cached under `{ state: None, picks [[0, 0]] }`
      - `b` is cached under `{ state: None, picks [[0, 0], [1, 0]] }`
      - `c` is not cached (nor marked as "do not cache")
      - We'll save the result of `f(a, b, c)` to the same scope as `b`, as `b` will be the first among the cached things to be incremented and, therefore, have it's cache invalidated, which should also invalidate the cache of `f(a, b, c)`.

## Experiments

From my measurements, this approach is still not as good as the multi-step process, most likely because we don't recognize that different nondets can generate same results (as described in [Solution](#solution)). We need to explore that further.

However, it seems effective in computing initial states in a scalable way, as the memory usage scales with the number of nondet definitions in the code, and not with the size of the sets, which is much better: memory usage doesn't go up more than 0.0% in my machine. Which also means we have memory to spare to handle the above issue.

I was also able to observe, in the Jellyfish Merkle Tree example, that the overall time it takes to compute a state is very close to the time that it takes to call the `apply` operator once, which means the whole caching procedure is not adding significant overhead while preventing us from re-calling `apply` every time with the first operations (see code below for context).
```quint
action init =
  nondet first_ops = ...
  nondet second_ops = ...
  apply(apply(first_ops), second_ops)
```

Without caching, we'd need to compute `apply` twice per state, but with cache, we compute it only once, except for the small percentage of states where we increment `first_ops` (6k states in a total of 17M states in the instance I'm checking).


