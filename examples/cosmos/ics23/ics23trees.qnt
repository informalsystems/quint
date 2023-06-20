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
/// $ quint run --invariant=NonMemInv ics23trees.qnt
/// $ quint run --invariant=MemInv ics23trees.qnt
///
/// We expect these tests to always pass. If you the simulator reports
/// a counterexample, there must be an error somewhere.
///
/// Igor Konnov, Informal Systems, 2022-2023
module ics23trees {
  import words.* from "./words"
  import ics23.* from "./ics23"

  /// We represent a binary tree as a collection of maps,
  /// whose keys are simply integer values 1..n, with 1 being the root.
  /// Similar to pointer-based representations of trees (e.g., in C),
  /// this data structure requires additional invariants to make sure
  /// that it actually defines a binary tree.
  /// This is in contrast to the typical data structures in
  /// programming languages.
  type TREE_T = {
    // every leaf has a key and value assigned
    leafs: int -> { key: WORD_T, value: WORD_T },
    // intermediate nodes have left and/or right children
    left: int -> int,
    right: int -> int
  }

  /// the tree generated so far
  var tree: TREE_T
  /// the node nodeHashes
  var nodeHashes: int -> WORD_T
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
  /// the binary encoding. For example, if a leaf has the index 4,
  /// that is, 100b, then it has the parents 3 = 10b and 1 = 1b.
  def parents(i) = 1.to(height).map(h => i / (2^h)).exclude(Set(0))

  /// is a given key a node (inner or leaf) of a tree
  def isNode(t, key) = or {
    key == 1,
    t.leafs.keys().contains(key),
    t.left.keys().contains(key),
    t.right.keys().contains(key),
  }

  /// Compute nodeHashes of all nodes into a map.
  def computeHashes(t) = {
    // compute the hash of a single node, assuming that the children's
    // nodeHashes have been computed
    def putNodeHash(hashMap, key): (int -> List[int], int) => (int -> List[int]) = {
      val h =
        if (t.leafs.keys().contains(key)) {
          // a leaf
          val leaf = t.leafs.get(key)
          // Hash the leaf as in ics23.existsCalculate.
          // In our trees, prefixes are always 0.
          hash([0].append(length(leaf.key))
          .concat(hash(leaf.key))
          .append(length(leaf.value))
          .concat(hash(leaf.value)))
        } else {
          // an inner node, assuming that the children nodeHashes were computed
          def hashOrEmpty(childMap) =
            if (childMap.keys().contains(key)) {
              hashMap.get(childMap.get(key))
            } else {
              EmptyChild
            }
          // hash the prefix ([0]) and the hash of the children
          hash([0].concat(hashOrEmpty(t.left)).concat(hashOrEmpty(t.right)))
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

  /// It's very easy to produce binary trees by picking an arbitrary graph and
  /// restricting it with the predicate isTree. However, this approach produces
  /// very sparse sets of states, to be explored by random search. Hence, we
  /// use a more algorithmic approach that represents trees with binary words.
  action init = {
    // produce an arbitrary tree with leafs in e.g. [2, 8)
    nondet idx = 2.to(2^height - 1).powerset().oneOf()
    // remove those numbers that should serve as intermediate nodes
    val leafKeys = idx.filter(i => idx.forall(j => not(i.in(parents(j)))))
    // compute all parents
    val allParents = leafKeys.map(i => parents(i)).flatten()
    // all intermediate nodes that have a left successor
    val leftKeys = allParents.filter(i =>
      allParents.union(leafKeys).exists(j => 2 * i == j))
    // all intermediate nodes that have a right successor
    val rightKeys = allParents.filter(i =>
      allParents.union(leafKeys).exists(j => 2 * i + 1 == j))
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
      // pick arbitrary left and right keys for non-membership proofs
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
  def leafToExistsProof(key) =
    val value = tree.leafs.get(key).value
    // encode all intermediate nodes upwards
    val path = range(1, height + 1)
      .foldl([],
      (p, h) =>
        if (key < 2^h) {
          p
        } else {
          val parent = key / (2^h)
          def hashOrChild(childMap) =
            if (childMap.keys().contains(parent)) {
              nodeHashes.get(childMap.get(parent))
            } else {
              EmptyChild
            }
          // depending on whether the node is going to left or right,
          // push the hashes in the prefix and the suffix
          if (key == 2 * parent) {
            val right = hashOrChild(tree.right)
            p.append({ prefix: [0], suffix: right })
          } else {
            val left = hashOrChild(tree.left)
            p.append({ prefix: [0].concat(left), suffix: [] })
          }
        }
    )
    // return the exists proof, where the key is the index itself
    {
      key: [key],
      value: tree.leafs.get(key).value,
      leaf: { prefix: [0] },
      path: path,
    }

  /// The transition does nothing. The state was computed in Init.
  action step = all {
    // nothing changes
    tree' = tree,
    nodeHashes' = nodeHashes,
    leftKey' = leftKey,
    rightKey' = rightKey,
    inputKey' = inputKey,
  }

  /// make sure that the proofs are the same for all the leafs
  val TreeProofInv =
    and {
      leftKey.in(tree.leafs.keys()),
      rightKey.in(tree.leafs.keys())
    } implies {
      val lroot = existsCalculate(leafToExistsProof(leftKey))
      val rroot = existsCalculate(leafToExistsProof(rightKey))
      lroot == rroot
    }

  /// The invariant of membership verification:
  /// If the input key belongs to the leafs,
  /// we should be able to prove its membership.
  val MemInv = or {
    not(inputKey.in(tree.leafs.keys())),
    val proof = leafToExistsProof(inputKey)
    val root = existsCalculate(proof)
    verifyMembership(root, proof, [inputKey], proof.value)
  }

  /// check this property to produce an example of where MemInv is violated
  val MemExample =
    not(MemInv)

  // A few lemmas for NonMemInv:
  // MemberShouldFalsify, NonMemberInTheMiddle, NonMemberLeft, NonMemberRight

  def MemberShouldFalsify(lproof, rproof) = and {
    // if the input key belongs to the leafs,
    // we should not be able to disprove its membership
    inputKey.in(tree.leafs.keys()),
    val nproof = { key: [inputKey], left: lproof, right: rproof }
    val root = existsCalculate(lproof)
    not(verifyNonMembership(root, nproof, [inputKey]))
  }

  def NonMemberInTheMiddle(lproof, rproof) = and {
    // we should be able to prove its non-membership,
    // unless the choice of the keys is bad
    not(inputKey.in(tree.leafs.keys())),
    val nproof = { key: [inputKey], left: lproof, right: rproof }
    val root = existsCalculate(lproof)
    val noKeyInTheMiddle = and {
      // there is no leaf between leftKey and rightKey
      tree.leafs.keys().forall(k => k <= leftKey or k >= rightKey),
      // the keys are not misplaced
      leftKey < inputKey,
      inputKey < rightKey,
    }
    noKeyInTheMiddle iff verifyNonMembership(root, nproof, [inputKey])
  }

  def NonMemberLeft(lproof, rproof) = and {
    // the input key is to the left
    isNil(lproof.key),
    // non-membership is true when the right key is left-most
    and {
      tree.leafs.keys().forall(k => rightKey <= k),
      inputKey < rightKey,
    } iff and {
      // or there is a proof
      val root = existsCalculate(rproof)
      val nproof = { key: [inputKey], left: lproof, right: rproof }
      verifyNonMembership(root, nproof, [inputKey])
    }
  }

  def NonMemberRight(lproof, rproof) = and {
    // the input key is to the right
    isNil(rproof.key),
    // non-membership is true when the left key is the right-most
    and {
      tree.leafs.keys().forall(k => (k <= leftKey)),
      inputKey > leftKey,
    } iff and {
      // or there is a proof
      val root = existsCalculate(lproof)
      val nproof = { key: [inputKey], left: lproof, right: rproof }
      verifyNonMembership(root, nproof, [inputKey])
    }
  }

  // The invariant of non-membership verification.
  // Consider all possible positions of the input key and the left/right keys.
  val NonMemInv =
    def proofOrNil(key) = {
      if (tree.leafs.keys().contains(key))
        leafToExistsProof(key)
      else
        { key: [], value: [], leaf: { prefix: [] }, path: [] }
    }
    val lproof = proofOrNil(leftKey)
    val rproof = proofOrNil(rightKey)
    or {
      MemberShouldFalsify(lproof, rproof),
      NonMemberInTheMiddle(lproof, rproof),
      NonMemberLeft(lproof, rproof),
      NonMemberRight(lproof, rproof),
      // trivial cases:
      inputKey < rightKey and not(isNil(lproof.key)),
      inputKey > leftKey and not(isNil(rproof.key)),
    }

  /// check this property to produce an example of where NonMemInv is violated
  val NonMemExample =
    not(NonMemInv)

  /// Predicate isTree(t) is true iff t defines an ordered binary tree starting
  /// with 1. It's probably hard to read. However, it is what one has to specify
  /// to express that an arbitrary graph is an ordered tree.
  def isTree(t: TREE_T): bool = and {
    t.leafs.keys().intersect(t.left.keys()) == Set(),
    t.leafs.keys().intersect(t.right.keys()) == Set(),
    1.in(t.leafs.keys().union(t.left.keys().union(t.right.keys()))),
    // we impose an order on the keys, to break cycles and DAGs
    t.left.keys().forall(k => t.left.get(k) > k),
    t.right.keys().forall(k => t.right.get(k) > k),
    t.left.keys().intersect(t.right.keys())
      .forall(k => t.left.get(k) < t.right.get(k)),
    // the leafs are ordered w.r.t. their keys
    val leafKeys = t.leafs.keys()
    tuples(leafKeys, leafKeys).forall(kk =>
      kk._1 < kk._2 implies lessThan(t.leafs.get(kk._1).key, t.leafs.get(kk._2).key)
    ),
    // all nodes have a parent
    (t.leafs.keys().union(t.left.keys()).union(t.right.keys()))
      .forall(k => or {
      // the root
      k == 1,
      // there is a left parent
      t.left.keys().exists(p => t.left.get(p) == k),
      // there is a right parent
      t.right.keys().exists(p => t.right.get(p) == k),
    }),
  }
}