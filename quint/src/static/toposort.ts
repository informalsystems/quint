/**
 * This code implements stable topological sort in a graph.  We are basically
 * following the Kahn's algorithm, see:
 * ${@link https://en.wikipedia.org/wiki/Topological_sorting"}.
 *
 * Our sorting is stable, that is, when two graph nodes belong to the same
 * layer, they are ordered by the original ordering. (We are assuming that the
 * input list contains no duplicates.)
 *
 * This code is a port of the Scala code from Apalache:
 *
 * ${@link
 * https://github.com/informalsystems/apalache/blob/dd5fff8dbfe707fb450afd2319cf50ebeb568e18/tlair/src/main/scala/at/forsyte/apalache/tla/lir/transformations/impl/StableTopologicalSort.scala
 * }
 *
 * @author Igor Konnov, Informal Systems, 2023
 *
 * Copyright (c) Informal Systems 2022-2023. All rights reserved.  Licensed
 * under the Apache 2.0.  See License.txt in the project root for license
 * information.
 */

import { Either, left, right } from '@sweet-monads/either'
import { Map } from 'immutable'
import { Set } from 'immutable'
import { WithId } from '../quintIr'

// the type of edges
type Edges = Map<bigint, Set<bigint>>

/**
 * Sort the elements of the list `unsorted` according to the dependencies that
 * are stored in the incoming edges. The semantics of an edge `u -> v` is that
 * `u` depends on `v` (or `u` calls `v`). That, in a topologically sorted list,
 * `v` should appear before `u`.
 *
 * @param inEdges
 *   a map from a node `u` to the set of the nodes used by `u`
 *
 * @param unsorted a list of nodes
 *
 * @returns either `Right(sorted)` that contains the correctly sorted nodes,
 *   or `Left(nodes)` that contains a subgraph with a cycle inside.
 */
export function toposort<T extends WithId>(inEdges: Edges, unsorted: T[]): Either<Set<bigint>, T[]> {
  // map sorted ids to nodes
  const idToNode: Map<bigint, T> =
    unsorted.reduce((map, node) => map.set(node.id, node), Map<bigint, T>())
  // save the unsorted order to guarantee stability
  const originalOrder: Map<bigint, number> =
    unsorted.reduce((map, node, i) => map.set(node.id, i), Map<bigint, number>())

  console.log('Original order:')
  originalOrder.forEach((value, key) => console.log(` ${key} -> ${value}`))

  // Use Kahn's algorithm to sort the declarations in a topological order:
  // https://en.wikipedia.org/wiki/Topological_sorting
  //
  // In this version, we are introducing declarations layer by layer, starting with layer 0 that contains
  // the nodes that have no incoming edges, then the declarations of layer 1 that have incoming edges
  // only from layer 1, etc. Within each layer, we maintain the original order of declarations.

  // the list of the ids of sorted nodes
  let sorted: bigint[] = []
  // The edges that have not been closed in the graph yet.
  // We extend `inEdges` in two ways:
  //  1. Every id that appears in the right-hand of an edge is a key in the map.
  //  2. For every element of unsorted, its id is a key in the map.
  const unsortedIds = Set(unsorted.map(n => n.id))
  const allIds = inEdges.reduce((s, ids) => ids.union(s), unsortedIds)
  let edges = allIds.reduce((map, id) =>
    map.has(id) ? map : map.set(id, Set()), inEdges
  )
   // the list of nodes that do not have incoming edges
  let sinks: bigint[] = []

  function updateSinksAndEdges() {
    console.log('updateSinksAndEdges')
    const [otherEdges, sinkEdges] = edges.partition(incoming => incoming.isEmpty())
    // since the sinks have no incoming edges, we can sort them by the original order
    sinks = [...sinkEdges.keys()]
    sinks.sort((a, b) => (originalOrder.get(a) ?? 0) - (originalOrder.get(b) ?? 0))
    // the other edges still have to be sorted
    edges = otherEdges
  }

  // initialize sinks with the nodes that have no incoming edges
  updateSinksAndEdges()
  while (sinks.length > 0) {
    // append the syncs that belong to unsorted
    sorted = sorted.concat(sinks.filter(id => unsortedIds.has(id)))
    const toRemove = Set(sinks)
    // remove all incoming edges that contain one of the sinks as a source
    edges = edges.map(uses => uses.subtract(toRemove))
    // recompute the sinks and edges
    updateSinksAndEdges()
  }

  if (!edges.isEmpty()) {
    // we have found a cycle, report an error
    return left(Set(edges.keys()))
  } else {
    if (sorted.length != unsorted.length) {
      console.error(`sorted.length == ${sorted.length}, whereas unsorted.length == ${unsorted.length}`)
    }
    console.log('sorted:')
    sorted.forEach(value => console.log(` ${value}`))
    return right(sorted.map(id => idToNode.get(id)!))
  }
}