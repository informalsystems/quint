/// Advanced randomized simulation (a la PBT) by generating
/// random sorted binary trees of small heights over a small set of keys.
///
/// We specify arbitrary binary trees, whose keys (in the leafs) are sorted.
/// We do not have to specify IAVL+ trees to produce test data for ICS23.
/// Note that this module is needed only for testing of ICS23,
/// not for the operation of ICS23.
///
/// To execute advanced PBT-like tests for 1000 runs in the simulator,
/// type the following:
///
/// $ quint run --invariant=nonMemInv treeGen.qnt
/// $ quint run --invariant=memInv treeGen.qnt
///
/// We expect these tests to always pass. If the simulator reports
/// a counterexample, there must be an error somewhere.
///
/// Igor Konnov, Informal Systems, 2022-2023
module treeGen {
  import basicSpells.* from "../../spells/basicSpells"
  import hashes.* from "./hashes"
  import ics23.* from "./ics23"

  /// We represent a binary tree as a collection of maps,
  /// whose keys are simply integer values 1..n, with 1 being the root.
  /// Similar to pointer-based representations of trees (e.g., in C),
  /// this data structure requires additional invariants to make sure
  /// that it actually defines a binary tree.
  /// This is in contrast to the typical data structures in
  /// programming languages.
  type Tree = {
    // every leaf has a key and value assigned
    leafs: int -> { key: Bytes, value: Bytes },
    // intermediate nodes have left and/or right children
    left: int -> int,
    right: int -> int
  }

  /// the tree generated so far
  var tree: Tree
  /// the node hashes
  var nodeHashes: int -> Term
  /// the keys to use for non-membership proofs
  var leftKey: int
  var rightKey: int
  /// the key whose non-membership or membership we want to prove
  var inputKey: int

  /// limit values to a small set
  val Byte = 0.to(7).union(Set(32))

  /// the maximum tree height
  val height = 3

  /// Compute all parents from the binary representation of the index.
  /// To simplify random generation of the trees, we are using
  /// a binary encoding. For example, if a leaf has the index 4,
  /// that is, 100b, then it has the parents 3 = 10b and 1 = 1b.
  /// See the exact definition below.
  def parents(i) = 1.to(height).map(h => i / (2^h)).exclude(Set(0))

  /// is a given key a node (inner or leaf) of a tree
  def isNode(t: Tree, key: int): bool = or {
    key == 1, // the root
    t.leafs.keys().contains(key),
    t.left.keys().contains(key),
    t.right.keys().contains(key),
  }

  /// Compute nodeHashes of all nodes into a map.
  def computeHashes(t) = {
    // compute the hash of a single node, assuming that the children's
    // nodeHashes have been computed
    def putNodeHash(hashMap: int -> Term, key: int): (int -> Term) = {
      val h =
        if (t.leafs.keys().contains(key)) {
          // simply use existsCalculate on the leaf
          val leaf = t.leafs.get(key)
          existsCalculate({
            key: leaf.key, value: leaf.value, leaf: { prefix: raw([0]) }, path: []
          })
       } else {
          // an inner node, assuming that the children nodeHashes were computed
          def hashOrZeroes(childMap) =
            if (childMap.keys().contains(key)) {
              hashMap.get(childMap.get(key))
            } else {
              Hash256_ZERO
            }
          // hash the prefix ([0]) and the hash of the children
          termHash(raw([0])
            .termConcat(hashOrZeroes(t.left))
            .termConcat(hashOrZeroes(t.right)))
        }
      // store the hash
      hashMap.put(key, h)
    }
    // go over the nodes from max to min
    val maxNode = 2^height
    0.range(2^height)
      .foldl(Map(),
        (m, key) =>
          if (isNode(t, maxNode - key)) putNodeHash(m, maxNode - key) else m
    )
  }

  /// We use an algorithmic approach that represents trees with binary words.
  action init = {
    // produce an arbitrary tree with leafs in e.g. [2, 8)
    nondet idx = 2.to(2^height - 1).powerset().oneOf()
    // remove those numbers that should serve as intermediate nodes
    val leafKeys = idx.filter(i => idx.forall(j => not(i.in(parents(j)))))
    // compute all parents
    val allParents = leafKeys.map(i => parents(i)).flatten()
    val allNodes = allParents.union(leafKeys)
    // all intermediate nodes that have a left successor
    val leftKeys = allParents.filter(i => allNodes.contains(2 * i))
    // all intermediate nodes that have a right successor
    val rightKeys = allParents.filter(i => allNodes.contains(2 * i + 1))
    // left mapping
    val left = leftKeys.mapBy(i => 2 * i)
    // right mapping
    val right = rightKeys.mapBy(i => 2 * i + 1)
    all {
      // ignore the case of empty trees
      leafKeys != Set(),
      // assign values to the keys
      nondet vs = leafKeys.setOfMaps(Byte).oneOf()
      val leafs = vs.keys().mapBy(k => { key: [k], value: [vs.get(k)] })
      // the resulting tree
      val t = { leafs: leafs, left: left, right: right }
      all {
        tree' = t,
        nodeHashes' = computeHashes(t),
      },
      // pick arbitrary left and right keys for proofs
      nondet i = leafKeys.oneOf()
      leftKey' = i,
      nondet i = leafKeys.oneOf()
      rightKey' = i,
      // pick an arbitrary input key
      nondet i = Byte.oneOf()
      inputKey' = i
    }
  }

  /// convert a tree leaf to an exists proof
  def leafToExistsProof(key: int): ExistenceProof =
    val value = tree.leafs.get(key).value
    // encode all intermediate nodes upwards
    val path = range(1, height + 1)
      .foldl([],
      (p, h) =>
        if (key < 2^h) {
          p
        } else {
          val parent = key / (2^h)
          val parentsChild = key / (2^(h - 1))
          def hashOrZeroes(childMap) =
            if (childMap.keys().contains(parent)) {
              nodeHashes.get(childMap.get(parent))
            } else {
              Hash256_ZERO
            }
          // depending on whether the node is going to left or right,
          // push the hashes in the prefix and the suffix
          if (parentsChild % 2 == 0) {
            // going to the left
            val right = hashOrZeroes(tree.right)
            p.append({ prefix: raw([0]), suffix: right })
          } else {
            // going to the right
            val left = hashOrZeroes(tree.left)
            p.append({ prefix: raw([0]).termConcat(left), suffix: Map() })
          }
        }
    )
    // return the exists proof, where the key is the index itself
    {
      key: [key],
      value: value,
      leaf: { prefix: raw([0]) },
      path: path,
    }

  /// The transition does nothing. The state was computed in `init`.
  action step = all {
    // nothing changes
    tree' = tree,
    nodeHashes' = nodeHashes,
    leftKey' = leftKey,
    rightKey' = rightKey,
    inputKey' = inputKey,
  }

  /// make sure that the roots obtained from the proofs are the same for all the leafs
  val treeProofInv =
    and {
      leftKey.in(tree.leafs.keys()),
      rightKey.in(tree.leafs.keys())
    } implies {
      val lroot = existsCalculate(leafToExistsProof(leftKey))
      val rroot = existsCalculate(leafToExistsProof(rightKey))
      val rootHash = nodeHashes.get(1)
      and {
        lroot == rootHash,
        rroot == rootHash,
      }
    }

  /// The invariant of membership verification:
  /// If the input key belongs to the leafs,
  /// we should be able to prove its membership.
  val memInv = or {
    not(inputKey.in(tree.leafs.keys())),
    val proof = leafToExistsProof(inputKey)
    val root = existsCalculate(proof)
    verifyMembership(root, proof, [inputKey], proof.value)
  }

  /// check this property to produce an example of where MemInv is violated
  val memExample = not(memInv)

  // A few lemmas for NonMemInv:
  // memberShouldFalsify, nonMemberInTheMiddle, nonMemberLeft, nonMemberRight

  def memberShouldFalsify(lproof, rproof) = and {
    // if the input key belongs to the leafs,
    // we should not be able to disprove its membership
    inputKey.in(tree.leafs.keys()),
    val nproof: NonExistenceProof = { key: [inputKey], left: lproof, right: rproof }
    val root = if (lproof != None) existsCalculate(lproof.unwrap()) else existsCalculate(rproof.unwrap())
    not(verifyNonMembership(root, nproof, [inputKey]))
  }

  def nonMemberInTheMiddle(lproof, rproof) = and {
    // we should be able to prove its non-membership,
    // unless the choice of the keys is bad
    not(inputKey.in(tree.leafs.keys())),
    val nproof = { key: [inputKey], left: lproof, right: rproof }
    val root = if (lproof != None) existsCalculate(lproof.unwrap()) else existsCalculate(rproof.unwrap())
    val noKeyInTheMiddle = and {
      // there is no leaf between leftKey and rightKey
      tree.leafs.keys().forall(k => k <= leftKey or k >= rightKey),
      // the keys are not misplaced
      leftKey < inputKey,
      inputKey < rightKey,
    }
    noKeyInTheMiddle iff verifyNonMembership(root, nproof, [inputKey])
  }

  def nonMemberLeft(lproof, rproof) = and {
    // the input key is to the left
    lproof == None,
    // non-membership is true when the right key is left-most
    and {
      tree.leafs.keys().forall(k => rightKey <= k),
      inputKey < rightKey,
    } iff and {
      // or there is a proof
      val root = existsCalculate(rproof.unwrap())
      val nproof = { key: [inputKey], left: lproof, right: rproof }
      verifyNonMembership(root, nproof, [inputKey])
    }
  }

  def nonMemberRight(lproof, rproof) = and {
    // the input key is to the right
    rproof == None,
    // non-membership is true when the left key is the right-most
    and {
      tree.leafs.keys().forall(k => (k <= leftKey)),
      inputKey > leftKey,
    } iff and {
      // or there is a proof
      val root = existsCalculate(lproof.unwrap())
      val nproof = { key: [inputKey], left: lproof, right: rproof }
      verifyNonMembership(root, nproof, [inputKey])
    }
  }

  // The invariant of non-membership verification.
  // Consider all possible positions of the input key and the left/right keys.
  val nonMemInv =
    def proofOrNil(key) = {
      if (tree.leafs.keys().contains(key))
        Some(leafToExistsProof(key))
      else
        None
    }
    val lproof = proofOrNil(leftKey)
    val rproof = proofOrNil(rightKey)
    or {
      memberShouldFalsify(lproof, rproof),
      nonMemberInTheMiddle(lproof, rproof),
      nonMemberLeft(lproof, rproof),
      nonMemberRight(lproof, rproof),
      // trivial cases:
      inputKey < rightKey and lproof != None,
      inputKey > leftKey and rproof != None,
    }

  /// check this property to produce an example of where NonMemInv is violated
  val nonMemExample = not(nonMemInv)

  val allInvariants = all {
    if (treeProofInv) true else q::debug("treeProofInv", false),
    if (memInv) true else q::debug("memInv", false),
    if (nonMemInv) true else q::debug("nonMemInv", false),
  }
}
