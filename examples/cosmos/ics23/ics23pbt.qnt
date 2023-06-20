/// Simple property-based tests for ics23. They happened to be not very useful,
/// as random simulation alone cannot produce even simple examples of sound
/// non-membership proofs.
///
/// For more advanced property-based testing, see ics23trees.qnt.
///
/// To execute simple PBT-like tests for 1000 runs of length up to 10 steps
/// in the simulator, type the following:
///
/// $ quint run --invariant=noVerifyInv ics23pbt.qnt
/// $ quint run --invariant=noNonMemInv ics23pbt.qnt
///
/// If the simulator finds an example that violates TestVerify or TestNonMem,
/// it displays this counterexample.
///
/// Igor Konnov, Informal Systems, 2022-2023
module ics23pbt {
  import words.* from "./words"
  import ics23.* from "./ics23"

  // an non-membership proof
  var nonMemProof: NonExistsProof_T
  // a key to test
  var inputKey: WORD_T

  // We limit the letters to a very small set,
  // including '32' for hash headers.
  val Byte = 0.to(3).union(Set(32))

  val toWord(m) =
    m.keys().fold([], (l, i) => l.append(m.get(i)))

  action genKey =
    nondet i = Byte.oneOf()
    inputKey' = [i]

  action init = all {
    genKey,
    // we start with leafs in the initial state
    nondet lk = Byte.oneOf()
    nondet lv = Byte.oneOf()
    nondet lp = Byte.oneOf()
    nondet rk = Byte.oneOf()
    nondet rv = Byte.oneOf()
    nondet rp = Byte.oneOf()
    nondet pk = Byte.oneOf()
    val lproof = {
      key: [ lk ], value: [ lv ],
      leaf: { prefix: [ lp ] }, path: []
    }
    val rproof = {
      key: [ rk ], value: [ rv ], leaf: { prefix: [ rp ] }, path: []
    }
    nonMemProof' = { key: [ pk ], left: lproof, right: rproof }
  }

  def extend(proof, dir, word) =
    val node =
      if (dir == "turnLeft") {
        prefix: word,
        suffix: []
      } else {
        prefix: word.slice(0, MaxPrefixLen),
        suffix: word.slice(MaxPrefixLen, MaxPrefixLen + ChildSize)
      }
    proof.with("path", proof.path.append(node))

  /// grow the proof on the left
  action growLeft =
    nondet dir = Set("turnLeft", "turnRight").oneOf()
    nondet m = 1.to(MaxPrefixLen + ChildSize).setOfMaps(Byte).oneOf()
    nonMemProof' =
      nonMemProof.with("left", nonMemProof.left.extend(dir, toWord(m)))

  /// grow the proof on the right
  action growRight =
    nondet dir = Set("turnLeft", "turnRight").oneOf()
    nondet m = 1.to(MaxPrefixLen + ChildSize).setOfMaps(Byte).oneOf()
    nonMemProof' =
      nonMemProof.with("right", nonMemProof.right.extend(dir, toWord(m)))

  action step = all {
    genKey,
    any {
      growLeft,
      growRight
    },
  }

  /// by checking this invariant, we may produce an example of when
  /// verifyMembership succeeds
  val noVerifyInv = {
    val root = existsCalculate(nonMemProof.left)
    not(verifyMembership(root,
      nonMemProof.left, inputKey, nonMemProof.left.value))
  }

  /// by checking this invariant, we may produce an example of when
  /// verifyNonMembership succeeds
  val noNonMemInv = or {
    lessThan(inputKey, nonMemProof.left.key),
    lessThan(nonMemProof.right.key, inputKey),
    val root = existsCalculate(nonMemProof.left)
    not(verifyNonMembership(root, nonMemProof, inputKey))
  }
}