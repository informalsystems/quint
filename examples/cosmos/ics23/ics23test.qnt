/// A few unit tests to improve our understanding of the specification.
///
///
///
/// To execute the unit tests in REPL, type the following:
///
/// $ quint repl -r ics23test.qnt::ics23test
/// >>> allTests
///
/// REPL should display 'true'.
///
/// Igor Konnov, Informal Systems, 2022-2023 
module ics23test {
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
      key: [5],
      value: [5, 6],
      leaf: { prefix: [5, 6, 7] },
      path: [
        { prefix: [5, 6], suffix: [8] },
        { prefix: [5], suffix: [7] }
      ]
    })
    assert(result == [32, 0, 4])
  }

  pure val isLeftMost1Test = {
    assert(isLeftMost([
      { prefix: [1], suffix: [3, 4, 5] },
      { prefix: [2], suffix: [3, 4, 5] },
      { prefix: [3], suffix: [3, 4, 5] }
    ]))
  }

  pure val isLeftMost2Test =
    assert(isLeftMost([
      { prefix: [1, 0, 0, 0], suffix: [] },
      { prefix: [2], suffix: [3, 4, 5] },
      { prefix: [3], suffix: [3, 4, 5] }
    ]))

  pure val isLeftMost3Test = {
    assert(isLeftMost([
      { prefix: [1], suffix: [3, 4, 5 ] },
      { prefix: [2, 0, 0, 0], suffix: [] },
      { prefix: [3], suffix: [3, 4, 5] }
    ]))
  }

  pure val isRightMost1Test =
    assert(isRightMost([
      { prefix: [1, 4, 5, 6], suffix: [] },
      { prefix: [2, 4, 5, 6], suffix: [] },
      { prefix: [3, 3, 4, 5], suffix: [] }
    ]))

  pure val isRightMost2Test =
    assert(isRightMost([
      { prefix: [1, 4, 5, 6], suffix: [] },
      { prefix: [2], suffix: [0, 0, 0] },
      { prefix: [3, 3, 4, 5], suffix: [] }
    ]))

  pure val isLeftStep1Test =
    assert(isLeftStep(
      { prefix: [1], suffix: [4, 5, 6] },
      { prefix: [2, 7, 8, 9], suffix: [] }
    ))

  pure val isLeftNeighborTest =
    assert(isLeftNeighbor(
      [
        { prefix: [1], suffix: [4, 5, 6] },
        { prefix: [2, 7, 8, 9], suffix: [] }
      ],
      [
        { prefix: [1, 4, 5, 6], suffix: [] },
        { prefix: [2, 7, 8, 9], suffix: [] }
      ]
    ))

  pure val verifyNonMembershipTest = {
    //    *
    //   / \
    // 2,3 4,5
    val lhash = existsCalculate({
      key:[2], value: [3], leaf: { prefix: [ 0 ] }, path: []
    })
    val rhash = existsCalculate({
      key:[4], value: [5], leaf: { prefix: [ 0 ] }, path: []
    })
    val left = {
      key: [ 2 ],
      value: [ 3 ],
      leaf: { prefix: [ 0 ] },
      path: [{ prefix: [0], suffix: rhash }]
    }
    val right = {
      key: [ 4 ],
      value: [ 5 ],
      leaf: { prefix: [ 0 ] },
      path: [{ prefix: [0].concat(lhash), suffix: [] }]
    }
    val root = [32, 0, 2]
    val nilProof = { key: [], value: [], leaf: { prefix: [] }, path: [] }
    and {
      val np1 = { key: [1], left: nilProof, right: left }
      assert(verifyNonMembership(root, np1, [ 1 ])),
      val np2 = { key: [2], left: left, right: right }
      assert(not(verifyNonMembership(root, np2, [ 2 ]))),
      val np3 = { key: [3], left: left, right: right }
      assert(verifyNonMembership(root, np3, [ 3 ])),
      val np4 = { key: [2], left: left, right: right }
      assert(not(verifyNonMembership(root, np4, [ 4 ]))),
      val np5 = { key: [5], left: right, right: nilProof }
      assert(verifyNonMembership(root, np5, [ 5 ])),
    }
  }
}