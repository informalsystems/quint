module test {
  // This will produce a type error - map expects a Set but gets a List
  val foo = [1, 2].map(x => x + 1)
} 