/// A few unit tests to improve our understanding of the specification.
///
/// To execute the unit tests, type the following:
///
/// $ quint test ics23test.qnt
///
/// Igor Konnov, Informal Systems, 2022-2023 
module ics23test {
  import basicSpells.* from "../../spells/basicSpells"
  import hashes.* from "./hashes"
  import ics23.* from "./ics23"

  // prepend the hash with the length marker
  pure def termHashWithLen(term: Term): Term = {
    raw([ 32 ]).termConcat(termHash(term))
  }

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
      [0, 0] -> Raw([5, 6, 7, 8]),
      [0, 1, 0] -> Raw([5, 6, 7, 8, 9]),
      [0, 1, 1, 0] -> Raw([9, 10, 11, 12, 1, 5, 32]),
      [0, 1, 1, 1, 0] -> Raw([5, 6]),
      [0, 1, 1, 1] -> Hash,
      [0, 1, 1] -> Hash,
      [0, 1, 2] -> Raw([8]),
      [0, 1] -> Hash,
      [0, 2] -> Raw([7]),
      [0] -> Hash
    )
    assert(expected == result)
  }

  pure val isLeftMost1Test = {
    assert(isLeftMost(IavlSpec, [
      { prefix: raw([1, 2, 3, 4]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: raw([2, 3, 4, 5]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: raw([3, 4, 5, 6]), suffix: termHashWithLen(raw([3, 4, 5])) }
    ]))
  }

  pure val isLeftMost2Test =
    assert(isLeftMost(IavlSpec, [
      { prefix: termConcat(raw([ 1, 2, 3, 4, 5 ]), Hash256_ZERO), suffix: raw([]) },
      { prefix: raw([ 2, 3, 4, 5, 6 ]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: raw([ 3, 4, 5, 6, 7 ]), suffix: termHashWithLen(raw([3, 4, 5])) }
    ]))

  pure val isLeftMost3Test = {
    assert(isLeftMost(IavlSpec, [
      { prefix: raw([ 1, 2, 3, 4 ]), suffix: termHashWithLen(raw([3, 4, 5])) },
      { prefix: termConcat(raw([ 2, 3, 4, 5 ]), Hash256_ZERO), suffix: raw([]) },
      { prefix: raw([3, 4, 5, 6]), suffix: termHashWithLen(raw([3, 4, 5])) }
    ]))
  }

  pure val isRightMost1Test =
    assert(isRightMost(IavlSpec, [
      { prefix: termConcat(raw([1, 2, 3, 4 ]), termHashWithLen(raw([ 4, 5, 6 ]))), suffix: raw([]) },
      { prefix: termConcat(raw([2, 3, 4, 5 ]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) },
      { prefix: termConcat(raw([3, 4, 5, 6 ]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) }
    ]))

  pure val isRightMost2Test =
    assert(isRightMost(IavlSpec, [
      { prefix: termConcat(raw([1, 2, 3, 4]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) },
      { prefix: raw([2, 3, 4, 5]), suffix: Hash256_ZERO },
      { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([3, 4, 5]))), suffix: raw([]) }
    ]))

  pure val isLeftStep1Test =
    assert(isLeftStep(
      IavlSpec,
      { prefix: raw([1, 2, 3, 4]), suffix: termHashWithLen(raw([4, 5, 6])) },
      { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([7, 8, 9]))), suffix: raw([]) }
    ))

  pure val isLeftNeighborTest =
    assert(isLeftNeighbor(
      IavlSpec,
      [
        { prefix: raw([1, 2, 3, 4]), suffix: termHashWithLen(raw([4, 5, 6])) },
        { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([7, 8, 9]))), suffix: raw([]) }
      ],
      [
        { prefix: termConcat(raw([1, 2, 3, 4]), termHashWithLen(raw([4, 5, 6]))), suffix: raw([]) },
        { prefix: termConcat(raw([2, 3, 4, 5]), termHashWithLen(raw([7, 8, 9]))), suffix: raw([]) }
      ]
    ))


  // Test setup to verify non membership
  //      1
  //     / \
  //    2   3
  //   /   /
  // 4:3  6:5
  pure val hash4 = hashLeaf([4], [7], raw([0]))
  pure val hash6 = hashLeaf([6], [4], raw([0]))
  pure val hash2 = termHash(raw([0]).termConcat(hash4).termConcat(Hash256_ZERO))
  pure val hash3 = termHash(raw([0]).termConcat(hash6).termConcat(Hash256_ZERO))
  // the left proof
  pure val lproof: ExistenceProof = {
    key: [ 4 ],
    value: [ 7 ],
    leaf: { prefix: raw([ 0 ]) },
    path: [
      { prefix: raw([0]), suffix: Hash256_ZERO },
      { prefix: raw([0]), suffix: hash3 }
    ]
  }
  // the right proof
  pure val rproof: ExistenceProof = {
    key: [ 6 ],
    value: [ 4 ],
    leaf: { prefix: raw([ 0 ]) },
    path: [
      { prefix: raw([0]), suffix: Hash256_ZERO },
      { prefix: raw([0]).termConcat(hash2), suffix: Map() },
    ]
  }

  pure val root = termHash(raw([0]).termConcat(hash2).termConcat(hash3))

  run rootTest = and {
    assert(root == existsCalculate(lproof)),
    assert(root == existsCalculate(rproof)),
  }

  run verifyNonMembership1Test = {
    pure val np1 = { key: [1], left: None, right: Some(lproof) }
    assert(verifyNonMembership(root, np1, [ 1 ]))
  }

  run verifyNonMembership2Test = {
    pure val np2 = { key: [2], left: None, right: Some(lproof) }
    assert(verifyNonMembership(root, np2, [ 2 ]))
  }

  run verifyNonMembership3Test = {
    pure val np3 = { key: [3], left: None, right: Some(lproof) }
    assert(verifyNonMembership(root, np3, [ 3 ]))
  }

  run verifyNonMembership4Test = {
    pure val np4 = { key: [4], left: Some(lproof), right: Some(rproof) }
    assert(not(verifyNonMembership(root, np4, [ 4 ])))
  }

  run verifyNonMembership5Test = {
    pure val np5 = { key: [5], left: Some(lproof), right: Some(rproof) }
    assert(verifyNonMembership(root, np5, [ 5 ]))
  }

  run verifyNonMembership6Test = {
    pure val np6 = { key: [6], left: Some(lproof), right: Some(rproof) }
    assert(not(verifyNonMembership(root, np6, [ 6 ])))
  }

  run verifyNonMembership7Test = {
    pure val np7 = { key: [7], left: Some(rproof), right: None }
    assert(verifyNonMembership(root, np7, [ 7 ]))
  }
}
