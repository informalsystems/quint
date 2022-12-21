// module test1 {
//   def max(x, y) = if (x > y) x else y
// }
module test2 {
    var v: bool
    pure def myAnd2(x, y) = x.and(y)
    pure def f(x) = not(x)
    temporal a = f(always(v))

    pure def max(x, y) = if (x > y) x else y
    def F(b) = not(v)
}
