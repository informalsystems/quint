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
  assume _ = K >= N

  val bottom = 0
  val top = N

  /// Mapping of node indices to their states
  var system: int -> int
  var unused: Set[int]
  var prev_token_count: int
  var token_count: int

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
      unused' = 0.to(K-1).exclude(initial.keys().fold(Set(), (s, x) => s.union(Set(initial.get(x))))),
      prev_token_count' = count_tokens(initial),
      token_count' = count_tokens(initial),
    }

  /// Pick a single active node non-deterministically and update its state
  action step = 
    nondet node = 0.to(N).filter(i => has_token(system, i)).oneOf()
    val n = system.set(node, state_transition(system, node))
    all {
      system' = n,
      prev_token_count' = token_count,
      token_count' = count_tokens(n),
      unused' = unused,
    }

  /// Pick several active nodes non-deterministically and update their state.
  /// Closer to the distributed demon is discussed in EWD 391. We are not
  /// considering interleaving in the execution of state_transition here
  action distributed_step = 
    nondet nodes = 0.to(N).filter(i => has_token(system, i)).powerset().exclude(Set()).oneOf()
    val n = nodes.fold(system, (s, x) => s.set(x, state_transition(system, x)))
    all {
      system' = n,
      prev_token_count' = token_count,
      token_count' = count_tokens(n),
      unused' = unused,
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

  def convergenceInv = token_count <= prev_token_count

  def closureInv = prev_token_count == 1 implies token_count == 1

  def bottom_has_fresh_value = unused.contains(system.get(bottom))

  def leader_waits = bottom_has_fresh_value implies
      (system.has_token(bottom) implies token_count == 1)
  


  def TypeOK =
    val domain = 0.to(K - 1)
    and {
      system.keys().forall(v => domain.contains(system.get(v))),
      domain.contains(prev_token_count),
      domain.contains(token_count),
    }

  def inductiveInv = TypeOK and tokenInv and convergenceInv and closureInv and leader_waits

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
