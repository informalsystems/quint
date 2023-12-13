module transaction_commit {

  type Status = Working | Prepared | Committed | Aborted

  const ResourceManagers: Set[str]
  var statuses: str -> Status

  action init = ResourceManagers.mapBy(_ => Working)

  val canCommit: bool = ResourceManagers.forall(rm => statuses.get(rm).in(Set(Prepared, Committed)))
  val notCommitted: bool = ResourceManagers.forall(rm => statuses.get(rm) != Committed)

  action prepare(rm) = all {
    statuses.get(rm) == Working,
    statuses' = statuses.set(rm, Prepared)
  }

  action decide(rm) = any {
     all { statuses.get(rm) == Prepared,
           canCommit,
           statuses' = statuses.set(rm, Committed) },
     all { statuses.get(rm).in(Set(Working, Prepared)),
           notCommitted,
           statuses' = statuses.set(rm, Aborted) }
  }

  action step = {
    nondet rm = oneOf(ResourceManagers)
    any { prepare(rm), decide(rm) }
  }

  val consistencyInvariant = tuples(ResourceManagers, ResourceManagers).forall(
      ((rm1, rm2)) => not( statuses.get(rm1) == Aborted
                           and
                           statuses.get(rm1) == Committed ))
}
