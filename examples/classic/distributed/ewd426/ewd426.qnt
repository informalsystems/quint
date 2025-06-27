// -*- mode: Bluespec; -*-
/**
 * ewd426's Stabilizing Token Ring (EWD426)
 * K state machine
 * This implementation ensures that from some time on,
 * exactly one token circulates in a set of nodes,
 *
 * Mahtab Norouzi, Josef Widder, Informal Systems, 2024-2025
 */
module self_stabilization {
  // Number of nodes in the ring
  const N: int
  const K: int

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
    all {
      system' = initial,
      prev' = initial,
      steppers' = Set(),
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
    nondet nodes = 0.to(N).filter(i => has_token(system, i)).powerset().exclude(Set()).oneOf()
    val n = nodes.fold(system, (s, x) => s.set(x, state_transition(system, x)))
    all {
      prev' = system,
      system' = n,
      steppers' = nodes,
      // prev_token_count' = token_count,
      // token_count' = count_tokens(n),
      // unused' = unused,
    }

  // Pure function to count how many tokens exist
  pure def count_tokens(nodes: int -> int): int = {
    0.to(N).filter(i => has_token(nodes, i)).size()
  }

  // Temporal properties
  temporal convergence = step.weakFair(Set(system)) implies eventually(count_tokens(system) == 1)
  temporal closure = always(count_tokens(system) == 1 implies always(count_tokens(system) == 1))
  temporal persistence = step.weakFair(Set(system)) implies eventually(always(count_tokens(system) == 1))

  // Invariant
  def tokenInv = count_tokens(system) > 0

  // def prevInv = system == steppers.fold(prev, (s, x) => s.set(x, state_transition(prev, x)))

  def simple_convergenceInv = count_tokens(system) <= count_tokens(prev) 

  def closureInv = count_tokens(prev) == 1 implies count_tokens(system) == 1

  /// bottom's value is different from the values of the other processes
  def bottom_unique = not(system.get(bottom).in(system.keys().exclude(Set(bottom)).fold(Set(), (s, x) => s.union(Set(system.get(x))))))

  pure def potential(sys) = 
    sys.keys().fold(0, (s, x) => if (has_token(sys, x)) 
                                    s + x 
                                  else s)
  
  def convergenceInv = or {
    count_tokens(system) < count_tokens(prev), 
    count_tokens(prev) == 1,
    system == prev,
    system.has_token(bottom),
    potential(system) > potential(prev),
    // if (pivot(prev) != -1)
    //   pivot(system) >= pivot(prev)
    // else
    //   true
  }

  def start_stable = bottom_unique implies not(has_token(system, bottom))

pure def getOnlyElement2(s: Set[a]): a = {
 pure val hack = s.map(e => ("value", e)).setToMap()
 if (s.size() != 1) {
   hack.get("error: expected singleton")
 } else {
   hack.get("value")
 }
}
  pure def pivot(sys: int -> int): int = 
    val u = 0.to(N).filter(x => prefix_unique(sys, x))
    if (u.size() == 0) 
      -1
    else 
      u.getOnlyElement2()


  pure def prefix_unique(sys, i) = 
    val hd = 0.to(i)
    val tl = (i + 1).to(N)
    val headval = hd.fold(Set(), (s, x) => s.union(Set(sys.get(x))))
    val tailval = tl.fold(Set(), (s, x) => s.union(Set(sys.get(x))))
    and {
      headval.size() == 1,
      or {
        tailval.size() == 0,
        not(headval.subseteq(tailval)),
      }
    }

  def TypeOK =
    and {
      system.in(0.to(N).setOfMaps(0.to(K - 1))),
      prev.in(0.to(N).setOfMaps(0.to(K - 1))),
      steppers.in(0.to(N).powerset()),     
    }

  //def inductiveInv = TypeOK and tokenInv and convergenceInv and closureInv and leader_waits

  /// to better see the token in the repl
  pure def show_token(nodes: int -> int): int -> bool =
    nodes.keys().mapBy(i => has_token(nodes, i))
}

module ewd426 {
  import self_stabilization(N = 5, K = 7).*
}

module broken_ewd426 {
  // This should break the assumption of K >= N. See #1182.
  import self_stabilization(N = 3, K = 2).*
}
