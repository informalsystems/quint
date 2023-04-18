/**
 * This module collects definitions that are ubiquitous.
 * One day they will become the standard library of Quint.
 */
module basicSpells {
  /**
   * An annotation for writing preconditions.
   * @param __cond condition to check
   * @returns true if and only if __cond evaluates to true
   */
  pure def require(__cond: bool): bool = __cond

  run requireTest = all {
    assert(require(4 > 3)),
    assert(not(require(false))),
  }

  /**
   * A convenience operator that returns a string error code,
   * if the condition does not hold true.
   *
   * @param __cond condition to check
   * @param __error a non-empty error message
   * @returns "", when __cond holds true; otherwise __error
   */
  pure def requires(__cond: bool, __error: str): str = {
    if (__cond) "" else __error
  }

  run requiresTest = all {
    assert(requires(4 > 3, "4 > 3") == ""),
    assert(requires(4 < 3, "false: 4 < 3") == "false: 4 < 3"),
  }


  /**
   * Compute the maximum of two integers.
   *
   * @param __i first integer
   * @param __j second integer
   * @returns the maximum of __i and __j
   */
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

  /**
   * Remove a set element.
   *
   * @param __set a set to remove an element from
   * @param __elem an element to remove
   * @returns a new set that contains all elements of __set but __elem
   */
  pure def setRemove(__set: Set[a], __elem: a): Set[a] = {
    __set.exclude(Set(__elem))
  }

  run setRemoveTest = all {
    assert(Set(2, 4) == Set(2, 3, 4).setRemove(3)),
    assert(Set() == Set().setRemove(3)),
  }

  /**
   * Remove a map entry.
   *
   * @param __map a map to remove an entry from
   * @param __key the key of an entry to remove
   * @returns a new map that contains all entries of __map
   *          that do not have the key __key
   */
   pure def mapRemove(__map: a -> b, __key: a): a -> b = {
    __map.keys().setRemove(__key).mapBy(__k => __map.get(__k))
  }

  run mapRemoveTest = all {
    assert(Map(3 -> 4, 7 -> 8) == Map(3 -> 4, 5 -> 6, 7 -> 8).mapRemove(5)),
    assert(Map() == Map().mapRemove(3)),
  }
}