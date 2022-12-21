module PureOperators {

  pure def min(values): (set(int)) => int = {
    values.fold(2^32, (x, y => if (x < y) x else y))
  }

  pure def min_alt(values): (set(int)) => int = {
    values.filter(v => values.exclude(v).forall(x => v <= x)).guess(x => x)
  }

  pure def max(values) = {
    values.fold(0, (x, y => if (x > y) x else y))
  }

  pure def fibonacci(n): (int) => int = {
    1.to(n).fold((0, 1), (t, _acc => (t._2, t._1 + t._2)))._2
  }

  // [r EXCEPT !.f = e]
  // r.with(f, e)

  // def binSearch(n, values) = {
  //   val mid = low.add(high.add(-low) / 2)
  //   val end = length(values) - 1
  //   val reducedSeq = range(0..log(2,length())).foldl((0, end), (acc, _) => if (vs.nth(mid) > n) vs.slice(0, mid) else vs.slice(mid, end))

  //   reducedSeq.head
  // }
}
