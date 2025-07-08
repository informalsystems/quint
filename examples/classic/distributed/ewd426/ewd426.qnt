// -*- mode: Bluespec; -*-
/**
 * ewd426's Stabilizing Token Ring (EWD426)
 * K state machine
 * This implementation ensures that from some time on,
 * exactly one token circulates in a set of nodes,
 *
 * run
 * quint verify ewd426.qnt --main ewd426 --inductive-invariant "wave_invariant" --step distributed_step 
 * to verify it!
 *
 * Mahtab Norouzi, Josef Widder, Informal Systems, 2024-2025
 */
module self_stabilization {
  // Number of nodes in the ring
  const N: int
  const K: int

  pure def values(m: a -> b): Set[b] = {
    m.keys().map(k => m.get(k))
  }

  /// Ensures the state space is larger than the number of nodes
  //assume _ = K >= N

  val bottom = 0
  val top = N

  /// Mapping of node indices to their states
  var system: int -> int
  var prev: int -> int
  var steppers: Set[int]

  // var unused: Set[int]
  // var prev_token_count: int
  // var token_count: int

  /// Check if a node has the token
  pure def has_token(nodes: int -> int, index: int): bool =
    if (index == bottom)
      nodes.get(bottom) == nodes.get(top)
    else
      not(nodes.get(index) == nodes.get(index - 1))

  /// Update the state of a specific node
  pure def state_transition(nodes: int -> int, index: int): int =
    if (not(has_token(nodes, index)))
      nodes.get(index)
    else if (index == bottom)
      (nodes.get(bottom) + 1) % K
    else
      nodes.get(index - 1)

  /// Initialize all nodes with non-deterministic states
  action init = 
    nondet initial = 0.to(N).setOfMaps(0.to(K - 1)).oneOf()
    nondet nodes = 0.to(N).filter(i => has_token(initial, i)).powerset().exclude(Set(Set())).oneOf()
    all {
      system' = nodes.fold(initial, (s, x) => s.set(x, state_transition(initial, x))),
      prev' = initial,
      steppers' = nodes,
    }


  /// Pick a single active node non-deterministically and update its state
  action step = 
    nondet node = 0.to(N).filter(i => has_token(system, i)).oneOf()
    val n = system.set(node, state_transition(system, node))
    all {
      system' = n,
      steppers' = Set(node),
      prev' = system
    }



  /// Pick several active nodes non-deterministically and update their state.
  /// Closer to the distributed demon is discussed in EWD 391. We are not
  /// considering interleaving in the execution of state_transition here
  action distributed_step = 
    nondet nodes = 0.to(N).filter(i => has_token(system, i)).powerset().exclude(Set(Set())).oneOf()
    val n = nodes.fold(system, (s, x) => s.set(x, state_transition(system, x)))
    all {
      prev' = system,
      system' = n,
      steppers' = nodes,
    }

  // Pure function to count how many tokens exist
  pure def count_tokens(nodes: int -> int): int = {
    0.to(N).filter(i => has_token(nodes, i)).size()
  }

  // Temporal properties
  temporal convergence = step.weakFair(Set(system)) implies eventually(count_tokens(system) == 1)
  temporal closure = always(count_tokens(system) == 1 implies always(count_tokens(system) == 1))
  temporal persistence = step.weakFair(Set(system)) implies eventually(always(count_tokens(system) == 1))


  // Invariants

  def TypeOK =
    and {
      system.in(0.to(N).setOfMaps(0.to(K - 1))),
      prev.in(0.to(N).setOfMaps(0.to(K - 1))),
      steppers.in(0.to(N).powerset()),     
    }


  def tokenInv = count_tokens(system) > 0

  /// prev is used to store the previous state of the system. We need this invariant to relate it
  /// to the current state
  def prevInv = system == steppers.fold(prev, (s, x) => s.set(x, state_transition(prev, x)))

  def no_deadlockInv = steppers != Set()

  def simple_convergenceInv = count_tokens(system) <= count_tokens(prev) 

  def closureInv = count_tokens(prev) == 1 implies count_tokens(system) == 1

  /// The potential is the sum of the keys of the nodes that have a token. If a token moves
  /// to the right, the potential grows. However, for the same number of tokens, the potential
  /// is bounded from above. So it cannot grow indefinitely.
  pure def potential(sys) = 
    sys.keys().fold(0, (s, x) => if (has_token(sys, x)) 
                                    s + x 
                                  else s)
  
  /// This proves that either we are converging, or bottom takes an infinite number of steps
  def convergenceInv = or {
    count_tokens(prev) == 1,                    // we are done, or
    count_tokens(system) < count_tokens(prev),  // we are getting closer, or
    potential(system) > potential(prev),        // we are getting closer in another way (potential is bounded from above by Sum of keys)
    system.has_token(bottom),                   // bottom is making a step
  }



  /// This invariant is inductive. 
  def basic_Inv = and {
      TypeOK,
      tokenInv,
      prevInv,
      no_deadlockInv,
      closureInv,
      simple_convergenceInv,
      convergenceInv,
    }

  // From the above invariant, in particular from convergenceInv, we observe that either the system converges or
  // bottom is making an infinite number of steps. In the following we show a stronger convergence from the point
  // where bottom has a unique value

  /// If bottom has a token, it must increment its value. 
  def incrementInv = {
    system.has_token(bottom) and bottom.in(steppers) implies system.get(bottom) == (prev.get(bottom) + 1) % K
  }

  // If bottom increments its value infinitely many times, it will eventually reach all values in {0, ..., K-1}

  /// bottom's value is different from the values of the other processes
  def bottom_unique = not(system.get(bottom).in(system.keys().exclude(Set(bottom)).map(k => system.get(k))))

  def unused_value = 0.to(K).exclude(system.values()) != Set()

  /// Only bottom can introduce new values into the system. If a value is introduced, then bottom is unique
  def freshInv =
    system.values().exclude(prev.values()).size() > 0 implies 
      and {
        bottom_unique,
        system.get(bottom).in(system.values().exclude(prev.values()))
      }

  // fresh and induction on increment mean eventually bottom_unique


  // In the following we show that once bottom_unique holds, bottom's value will
  // spread to all nodes, for this we will define a pivot that separates the nodes who
  // have the same value as bottom from those who do not. 

  def wave_startInv = bottom_unique == prefix_unique(system, bottom)

  pure def getOnlyElement2(s: Set[a]): a = {
  pure val hack = s.map(e => ("value", e)).setToMap()
  if (s.size() != 1) {
    hack.get("error: expected singleton")
  } else {
    hack.get("value")
  }
  }

  pure def prefix_unique(sys, i) = 
    val hd = 0.to(N).filter(x => x <= i)
    val tl = 0.to(N).filter(x => x > i)
    val headval = hd.map(x => sys.get(x))
    val tailval = tl.map(x => sys.get(x))
    and {
      headval.size() == 1,
      or {
        // tailval.size() == 0,
        not(headval.subseteq(tailval)),
      }
    }

  pure def good_prefix(sys) = 0.to(N).filter(x => prefix_unique(sys, x))

  pure def pivot(sys) = 
    if (good_prefix(sys).size() == 0)
      -1
    else
      getOnlyElement2(good_prefix(sys))


  /// If bottom is unique, then we have a pivot
  def bot_unique_implies_pivotInv = bottom_unique implies pivot(system) == bottom

  /// Once we have a pivot, we have the following convergence invariant:
  def wave_convergenceInv = 
    pivot(prev) >= 0 implies 
      or {
        and { // prefix grows
          pivot(prev) < pivot(system),
        },
        and { // prefix stays, but movement in suffix
          pivot(prev) == pivot(system),
          or {
            count_tokens(system) < count_tokens(prev),
            potential(system) > potential(prev),
          },
        },
        and {
          count_tokens(system) == 1,
        }
      }
  
  def new_waveInv = pivot(prev) == N implies pivot(system) == 0

  /// From the below we conclude that eventually bottom will have a unique value. At this point we will have
  /// a pivot. From then on we will converge to having a single token circulating in the system.
  pure def wave_invariant = and {
    basic_Inv,
    incrementInv,
    unused_value,
    freshInv,
    bot_unique_implies_pivotInv,
    wave_startInv,
    wave_convergenceInv,
    new_waveInv,
  }

  /// to better see the token in the repl
  pure def show_token(nodes: int -> int): int -> bool =
    nodes.keys().mapBy(i => has_token(nodes, i))
}

module ewd426 {
  import self_stabilization(N = 5, K = 7).*
}

module less_proc {
  import self_stabilization(N = 3, K = 10).*
}

module broken_ewd426 {
  // This should break the assumption of K >= N. See #1182.
  import self_stabilization(N = 3, K = 2).*
}
