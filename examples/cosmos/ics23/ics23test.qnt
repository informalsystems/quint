/// A few unit tests to improve our understanding of the specification.
///
/// To execute the unit tests, type the following:
///
/// $ quint test ics23test.qnt
///
/// Igor Konnov, Informal Systems, 2022-2023 
module ics23test {
  import hashes.* from "./hashes"
  import ics23.* from "./ics23"

  // test data
  val a = [5]
  val b = [6]
  val c = [7]
  val d = [8]
  val ab = [5, 6]
  val ba = [6, 5]
  val abc = [5, 6, 7]
  val abcd = [5, 6, 7, 8]

  val allStrings = Set([], a, ab, ba, abc, abcd, [1], [2], [3], [4])

  pure val existsCalculateTest = {
    pure val result = existsCalculate({
      key: [ 5 ],
      value: [ 5, 6 ],
      leaf: {
        prefix: raw([ 9, 10, 11, 12 ])
      },
      path: [
        { prefix: raw([ 5, 6, 7, 8, 9 ]), suffix: raw([ 8 ]) },
        { prefix: raw([ 5, 6, 7, 8 ]), suffix: raw([ 7 ]) }
      ]
    })
    // a map representation of the term with hashes
    pure val expected = Map(
      [0, 0] -> { b: [5, 6, 7, 8], t: "r" },
      [0, 1, 0] -> { b: [5, 6, 7, 8, 9], t: "r" },
      [0, 1, 1, 0] -> { b: [9, 10, 11, 12, 1, 5, 32], t: "r" },
      [0, 1, 1, 1, 0] -> { b: [5, 6], t: "r" },
      [0, 1, 1, 1] -> { b: [], t: "h" },
      [0, 1, 1] -> { b: [], t: "h" },
      [0, 1, 2] -> { b: [8], t: "r" },
      [0, 1] -> { b: [], t: "h" },
      [0, 2] -> { b: [7], t: "r" },
      [0] -> { b: [], t: "h" }
    )
    assert(expected == result)
  }

  pure val isLeftMost1Test = {
    assert(isLeftMost([
      { prefix: raw([1, 2, 3, 4]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: raw([2, 3, 4, 5]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: raw([3, 4, 5, 6]), suffix: termHashWithLen(raw([3, 4, 5])) }
    ]))
  }

  pure val isLeftMost2Test =
    assert(isLeftMost([
      { prefix: termConcat(raw([ 1, 2, 3, 4 ]), EmptyChild), suffix: raw([]) },
      { prefix: raw([ 2, 3, 4, 5 ]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: raw([ 3, 4, 5, 6 ]), suffix: termHashWithLen(raw([3, 4, 5])) }
    ]))

  pure val isLeftMost3Test = {
    assert(isLeftMost([
      { prefix: raw([ 1, 2, 3, 4 ]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: termConcat(raw([ 2, 3, 4, 5 ]), EmptyChild), suffix: raw([]) },
      { prefix: raw([3, 4, 5, 6]), suffix: termHashWithLen(raw([3, 4, 5])) }
    ]))
  }

  pure val isRightMost1Test =
    assert(isRightMost([
      { prefix: termConcat(raw([1, 2, 3, 4 ]), termHashWithLen(raw([ 4, 5, 6 ]))), suffix: raw([]) },
      { prefix: termConcat(raw([2, 3, 4, 5 ]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) },
      { prefix: termConcat(raw([3, 4, 5, 6 ]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) }
    ]))

  pure val isRightMost2Test =
    assert(isRightMost([
      { prefix: termConcat(raw([1, 2, 3, 4]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) },
      { prefix: raw([2, 3, 4, 5]), suffix: EmptyChild },
      { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([3, 4, 5]))), suffix: raw([]) }
    ]))

  pure val isLeftStep1Test =
    assert(isLeftStep(
      { prefix: raw([1, 2, 3, 4]), suffix: termHashWithLen(raw([4, 5, 6])) },
      { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([7, 8, 9]))), suffix: raw([]) }
    ))

  pure val isLeftNeighborTest =
    assert(isLeftNeighbor(
      [
        { prefix: raw([1, 2, 3, 4]), suffix: termHashWithLen(raw([4, 5, 6])) },
        { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([7, 8, 9]))), suffix: raw([]) }
      ],
      [
        { prefix: termConcat(raw([1, 2, 3, 4]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) },
        { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([7, 8, 9]))), suffix: raw([]) }
      ]
    ))

  pure val verifyNonMembershipTest = {
    //    *
    //   / \
    // 2:3 4:5
    pure val lhash = existsCalculate({
      key: [2], value: [3], leaf: { prefix: raw([ 0, 1, 2, 3 ]) }, path: []
    })
    pure val rhash = existsCalculate({
      key:[4], value: [5], leaf: { prefix: raw([ 0, 1, 2, 3 ]) }, path: []
    })
    // the left proof
    pure val lproof: ExistsProof_t = {
      key: [ 2 ],
      value: [ 3 ],
      leaf: { prefix: raw([ 0, 1, 2, 3 ]) },
      path: [{ prefix: raw([ 0, 1, 2, 3 ]), suffix: raw([32]).termConcat(rhash) }]
    }
    // the right proof
    pure val rproof: ExistsProof_t = {
      key: [ 4 ],
      value: [ 5 ],
      leaf: { prefix: raw([ 0, 1, 2, 3 ]) },
      path: [{ prefix: raw([ 0, 1, 2, 3, 32 ]).termConcat(lhash), suffix: raw([ ]) }]
    }
    pure val root = termHash(raw([ 0, 1, 2, 3, 32 ]).termConcat(lhash).termConcat(rhash))
    pure val nilProof: ExistsProof_t =
      { key: [], value: [], leaf: { prefix: raw([]) }, path: [] }
    and {
      pure val np1 = { key: [1], left: nilProof, right: lproof }
      assert(verifyNonMembership(root, np1, [ 1 ])),
      pure val np2 = { key: [2], left: lproof, right: rproof }
      assert(not(verifyNonMembership(root, np2, [ 2 ]))),
      pure val np3 = { key: [3], left: lproof, right: rproof }
      assert(verifyNonMembership(root, np3, [ 3 ])),
      pure val np4 = { key: [2], left: lproof, right: rproof }
      assert(not(verifyNonMembership(root, np4, [ 4 ]))),
      pure val np5 = { key: [5], left: rproof, right: nilProof }
      assert(verifyNonMembership(root, np5, [ 5 ])),
    }
  }
}
