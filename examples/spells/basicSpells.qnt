// -*- mode: Bluespec; -*-
/**
 * This module collects definitions that are ubiquitous.
 * One day they will become the standard library of Quint.
 */
module basicSpells {
  /// An annotation for writing preconditions.
  /// - @param __cond condition to check
  /// - @returns true if and only if __cond evaluates to true
  pure def require(__cond: bool): bool = __cond

  run requireTest = all {
    assert(require(4 > 3)),
    assert(not(require(false))),
  }

  /// A convenience operator that returns a string error code,
  ///  if the condition does not hold true.
  ///
  /// - @param __cond condition to check
  /// - @param __error a non-empty error message
  /// - @returns "", when __cond holds true; otherwise __error
  pure def requires(__cond: bool, __error: str): str = {
    if (__cond) "" else __error
  }

  run requiresTest = all {
    assert(requires(4 > 3, "4 > 3") == ""),
    assert(requires(4 < 3, "false: 4 < 3") == "false: 4 < 3"),
  }


  /// Compute the maximum of two integers.
  ///
  /// - @param __i first integer
  /// - @param __j second integer
  /// - @returns the maximum of __i and __j
  pure def max(__i: int, __j: int): int = {
    if (__i > __j) __i else __j
  }

  run maxTest = all {
    assert(max(3, 4) == 4),
    assert(max(6, 3) == 6),
    assert(max(10, 10) == 10),
    assert(max(-3, -5) == -3),
    assert(max(-5, -3) == -3),
  }

  /// Remove a set element.
  ///
  /// - @param __set a set to remove an element from
  /// - @param __elem an element to remove
  /// - @returns a new set that contains all elements of __set but __elem
  pure def setRemove(__set: Set[a], __elem: a): Set[a] = {
    __set.exclude(Set(__elem))
  }

  run setRemoveTest = all {
    assert(Set(2, 4) == Set(2, 3, 4).setRemove(3)),
    assert(Set() == Set().setRemove(3)),
  }

  /// Test whether a key is present in a map
  ///
  /// - @param __map a map to query
  /// - @param __key the key to look for
  /// - @returns true if and only __map has an entry associated with __key
  pure def has(__map: a -> b, __key: a): bool = {
    __map.keys().contains(__key)
  }

  run hasTest = all {
    assert(Map(2 -> 3, 4 -> 5).has(2)),
    assert(not(Map(2 -> 3, 4 -> 5).has(6))),
  }

  /// Get the map value associated with a key, or the default,
  /// if the key is not present.
  ///
  /// - @param __map the map to query
  /// - @param __key the key to search for
  /// - @returns the value associated with the key, if __key is
  ///   present in the map, and __default otherwise
  pure def getOrElse(__map: a -> b, __key: a, __default: b): b = {
    if (__map.has(__key)) {
      __map.get(__key)
    } else {
      __default
    }
  }

  run getOrElseTest = all {
    assert(Map(2 -> 3, 4 -> 5).getOrElse(2, 0) == 3),
    assert(Map(2 -> 3, 4 -> 5).getOrElse(7, 11) == 11),
  }

  /// Remove a map entry.
  ///
  /// - @param __map a map to remove an entry from
  /// - @param __key the key of an entry to remove
  /// - @returns a new map that contains all entries of __map
  ///          that do not have the key __key
  pure def mapRemove(__map: a -> b, __key: a): a -> b = {
    __map.keys().setRemove(__key).mapBy(__k => __map.get(__k))
  }

  run mapRemoveTest = all {
    assert(Map(3 -> 4, 7 -> 8) == Map(3 -> 4, 5 -> 6, 7 -> 8).mapRemove(5)),
    assert(Map() == Map().mapRemove(3)),
  }

  /// Sort a list, given the ordering operator.
  ///
  /// - @param __list a list to sort
  /// - @param __lt a definition of "less than"
  /// - @returns the sorted version of __list
  pure def listSorted(__list: List[a], __lt: (a, a) => bool): List[a] = {
    pure def __countSmaller(__j: int): int = {
      pure val __jth = __list[__j]
      __list.indices().filter(__i =>
        __lt(__list[__i], __jth) or (__list[__i] == __jth and __i < __j)
      )
      .size()
    }

    pure val __permutation =
      __list.indices().mapBy(__i => __countSmaller(__i))
    // The code below is producing an incorrect result.
    // Consider __list == [ 3, 5, 1]. The result is [ 5, 1, 3 ].
    // We should invert __permutation first.
    // For this, we would require choose_some, see #150.
    range(0, __list.length()).foldl([], (__l, __i) =>
      __l.append(__list[__permutation.get(__i)])
    )
  }

  run listSortedTest = all {
    assert([ 5, 1, 3 ] == listSorted([ 1, 3, 5 ], (x, y) => x < y)),
    assert([ 1, 5, 1, 3, 5 ] == listSorted([ 1, 1, 3, 5, 5 ], (x, y) => x < y)),
  }
}