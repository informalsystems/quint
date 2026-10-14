module instanceWithVar {
  const N: int
  var counter: int

  action init = counter' = 0
}

module bug2027instanceAssignRhs {
  import instanceWithVar(N = 1) as V

  var y: int

  action init = all { V::init, y' = 1 }
  action step = all {
    // The right-hand side reads `y`, a variable of this module, not of the instance
    V::counter' = y,
    y' = y + 1,
  }

  // V::counter follows y, one step behind
  val inv = V::counter == y - 1
}
