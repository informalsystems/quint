module t {
    val A = Set("a", "b", "c")
    val B = Set(2, 3, 4)
    val C = Set("x", "y")

    var myMap2: str -> (int -> str)

    action init = {
        nondet _foo = A.setOfMaps(B.setOfMaps(C)).oneOf()
        myMap2' = _foo
    }

    action step = all {
        myMap2' = myMap2,
    }

    val inv = myMap2.keys() == A
}