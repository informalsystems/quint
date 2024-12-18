// This is a protocol specification of ICS23, tuned towards the IAVL case.
//
// For details of ICS23, see:
// https://github.com/cosmos/ibc/tree/main/spec/core/ics-023-vector-commitments
//
// For the implementation of ICS23, see:
// https://github.com/confio/ics23/
//
// We still have to parameterize the spec with the data structure parameters
// such as MinPrefixLen, MaxPrefixLen, ChildSize, and hash.
// For the moment, the main goal of this spec is to understand the algorithm
// and test it with the simulator.
//
// Igor Konnov, Informal Systems, 2022-2023

// This is a specification of the membership and non-membership proofs
// of ICS23 for IAVL trees:
//
// https://github.com/confio/ics23/blob/master/go/proof.go
module ics23 {
  import hashes.* from "./hashes"

  // ICS23 proof checking for IavlSpec.
  // In contrast to the ICS23 implementation, we specialize it to binary trees:
  // https://github.com/confio/ics23/tree/master/go

  // type aliases for readability
  type Key_t = Bytes_t
  type Value_t = Bytes_t
  type CommitmentRoot_t = Term_t
  type CommitmentProof_t = Term_t

  // ICS23 IavlSpec has:
  // MinPrefixLength = 4
  // MaxPrefixLength = 12
  // ChildSize = 33
  //
  // To ease spec testing, we set:
  pure val MinPrefixLen = 4
  pure val MaxPrefixLen = 12
  // It is crucial to make sure that ChildSize > MaxPrefixLen
  pure val ChildSize = 33 // 32 bytes in SHA256 + 1 byte for the length marker
  // Empty child is a predefined sequence that fills an absent child.
  // TODO: EmptyChild is set to nil in IavlSpec. We have 33 bytes.
  pure val EmptyChild = raw([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0,
  ])

  type LEAF_T = {
    // The implementation additionally stores hashing and length functions:
    // hash, prehashKey, prehashValue, len. Since we fix the spec to IAVL,
    // we do not have to carry them around.
    prefix: Term_t
  }

  type INNER_T = {
    // The implementation additionally stores the hashing function.
    // Since we fix the spec to IAVL, we do not have to carry it around.
    prefix: Term_t,
    suffix: Term_t
  }

  /// a proof of existence of (key, value)
  type ExistsProof_t = {
    key: Key_t, value: Value_t, leaf: LEAF_T, path: List[INNER_T]
  }

  /// a proof of non-existence of a key
  type NonExistsProof_t = {
    key: Key_t, left: ExistsProof_t, right: ExistsProof_t
  }

  /// calculate a hash from an exists proof
  def existsCalculate(p: ExistsProof_t): CommitmentProof_t = {
    // This is how the leaf hash is computed.
    // Notice that the key is not hashed.
    val leafHash =
      termHash(p.leaf.prefix
        // TODO: use encodeVarintProto
        // https://github.com/cosmos/ics23/blob/d0edf8e9cd38f7fc1bfc4311b2814e5d2ea966e8/go/proof.go#L67
        .termConcat(raw([length(p.key)]))
        .termConcat(raw(p.key))
        .termConcat(raw([32]))
        .termConcat(termHash(raw(p.value))))

    // the inner node nodeHashes are concatenated and hashed upwards
    p.path.foldl(leafHash,
      (child, inner) =>
        termHash(inner.prefix.termConcat(child).termConcat(inner.suffix)))
  }

  /// verify that a proof matches a root
  def verify(proof, root, key, value) = and {
    key == proof.key,
    value == proof.value,
    root == existsCalculate(proof)
  }

  /// VerifyMembership returns true iff
  /// proof is an ExistenceProof for the given key and value AND
  /// calculating the root for the ExistenceProof matches
  /// the provided CommitmentRoot
  def verifyMembership(root: CommitmentRoot_t,
      proof: ExistsProof_t, key: Key_t, value: Value_t): bool = {
    // TODO: specify Decompress
    // TODO: specify the case of CommitmentProof_Batch
    // TODO: CheckAgainstSpec ensures that the proof can be verified
    //       by the spec checker
    verify(proof, root, key, value)
  }

  /// checks if an op has the expected padding
  def hasPadding(inner: INNER_T,
      minPrefixLen: int, maxPrefixLen: int, suffixLen: int): bool = and {
    termLen(inner.prefix) >= minPrefixLen,
    termLen(inner.prefix) <= maxPrefixLen,
    // When inner turns left, suffixLen == ChildSize,
    // that is, we store the hash of the right child in the suffix.
    // When inner turns right, suffixLen == 0,
    // that is, we store the hash of the left child in the prefix.
    termLen(inner.suffix) == suffixLen
  }

  /// This will look at the proof and determine which order it is...
  /// So we can see if it is branch 0, 1, 2 etc... to determine neighbors
  /// https://github.com/confio/ics23/blob/a4daeb4c24ce1be827829c0841446abc690c4f11/go/proof.go#L400-L411
  def orderFromPadding(inner: INNER_T): (int, bool) = {
    // Specialize orderFromPadding to IavlSpec:
    // ChildOrder = { 0, 1 }
    // branch = 0: minp, maxp, suffix = MinPrefixLen, MaxPrefixLen, ChildSize
    // branch = 1: minp, maxp, suffix =
    //             ChildSize + MinPrefixLen, ChildSize + MaxPrefixLen, 0
    if (hasPadding(inner, MinPrefixLen, MaxPrefixLen, ChildSize)) {
      // the node turns left
      (0, true)
    } else if (hasPadding(inner, ChildSize + MinPrefixLen,
                          ChildSize + MaxPrefixLen, 0)) {
      // the node turns right
      (1, true)
    } else {
      // error
      (0, false)
    }
  }

  /// leftBranchesAreEmpty returns true if the padding bytes correspond to all
  /// empty siblings on the left side of a branch, ie. it's a valid placeholder
  /// on a leftmost path
  def leftBranchesAreEmpty(inner: INNER_T): bool = and {
    // the case of leftBranches == 0 returns false
    val order = orderFromPadding(inner)
    order._2 and order._1 != 0,
    // the remaining case is leftBranches == 1, see orderFromPadding
    // actualPrefix = len(inner.prefix) - 33
    termLen(inner.prefix) >= ChildSize,
    // getPosition(0) returns 0
    val fromIndex = termLen(inner.prefix) - ChildSize
    termSlice(inner.prefix, fromIndex, fromIndex + ChildSize) == EmptyChild
  }

  /// IsLeftMost returns true if this is the left-most path in the tree,
  /// excluding placeholder (empty child) nodes
  def isLeftMost(path: List[INNER_T]): bool = {
    // Calls getPadding(0) => idx = 0, prefix = 0.
    // We specialize the constants to IavlSpec.
    path.indices().forall(i =>
      val pathStep = path[i]
      or {
        // the path goes left
        hasPadding(pathStep, MinPrefixLen, MaxPrefixLen, ChildSize),
        // the path goes right, but the left child is empty (a gap)
        leftBranchesAreEmpty(pathStep)
      }
    )
  }

  /// rightBranchesAreEmpty returns true if the padding bytes correspond
  /// to all empty siblings on the right side of a branch,
  /// i.e. it's a valid placeholder on a rightmost path
  def rightBranchesAreEmpty(inner: INNER_T): bool = and {
    // the case of rightBranches == 0 returns false
    val order = orderFromPadding(inner)
    order._2 and order._1 != 1,
    // the remaining case is rightBranches == 1, see orderFromPadding
    termLen(inner.suffix) == ChildSize,
    // getPosition(0) returns 0, hence, from == 0
    inner.suffix == EmptyChild
  }

  /// IsRightMost returns true if this is the left-most path in the tree,
  /// excluding placeholder (empty child) nodes
  def isRightMost(path: List[INNER_T]): bool = {
    // Specialize to IavlSpec
    // Calls getPadding(1) => minPrefix, maxPrefix,
    //   suffix = ChildSize + MinPrefixLen, ChildSize + MaxPrefixLen, 0
    path.indices().forall(i =>
      val pathStep = path[i]
      or {
        // the path goes right
        hasPadding(pathStep, ChildSize + MinPrefixLen, ChildSize + MaxPrefixLen, 0),
        // the path goes left, but the right child is empty (a gap)
        rightBranchesAreEmpty(pathStep)
      }
    )
  }

  /// isLeftStep assumes left and right have common parents
  /// checks if left is exactly one slot to the left of right
  def isLeftStep(left: INNER_T, right: INNER_T): bool = {
    // 'left' turns left, and 'right' turns right
    val lorder = orderFromPadding(left)
    val rorder = orderFromPadding(right)
    and {
      lorder._2,
      rorder._2,
      rorder._1 == lorder._1 + 1
    }
  }

  /// IsLeftNeighbor returns true if `right` is the next possible path
  /// right of `left`
  ///
  /// Find the common suffix from the Left.Path and Right.Path and remove it.
  /// We have LPath and RPath now, which must be neighbors.
  /// Validate that LPath[len-1] is the left neighbor of RPath[len-1].
  /// For step in LPath[0..len-1], validate step is right-most node.
  /// For step in RPath[0..len-1], validate step is left-most node.
  def isLeftNeighbor(lpath: List[INNER_T], rpath: List[INNER_T]): bool = {
    // count common tail (from end, near root)
    // cut the left and right paths
    lpath.indices().exists(li =>
      rpath.indices().exists(ri => and {
        // they are equidistant from the root
        length(lpath) - li == length(rpath) - ri,
        // The distance to the root (the indices are 0-based).
        // dist == 0 holds for the root.
        val dist = length(lpath) - 1 - li
        // the prefixes and suffixes match just above the cut points
        1.to(dist).forall(k =>
          val lnode = lpath[li + k]
          val rnode = rpath[ri + k]
          and {
            lnode.prefix == rnode.prefix,
            lnode.suffix == rnode.suffix
          }
        ),
        // Now topleft and topright are the first divergent nodes
        // make sure they are left and right of each other.
        // Actually, lpath[li] and rpath[ri] are an abstraction
        // of the same tree node:
        //  the left one stores the hash of the right one, whereas
        //  the right one stores the hash of the left one.
        isLeftStep(lpath[li], rpath[ri]),
        // left and right are remaining children below the split,
        // ensure left child is the rightmost path, and visa versa
        isRightMost(lpath.slice(0, li)),
        isLeftMost(rpath.slice(0, ri)),
      })
    )
  }

  /// VerifyNonMembership returns true iff
  /// proof is (contains) a NonExistenceProof,
  /// both left and right sub-proofs are valid existence proofs (see above) or nil,
  /// left and right proofs are neighbors (or left/right most if one is nil),
  /// provided key is between the keys of the two proofs
  def verifyNonMembership(root: CommitmentRoot_t,
      np: NonExistsProof_t, key: Key_t): bool = and {
    // getNonExistProofForKey
    isNil(np.left.key) or lessThan(np.left.key, key),
    isNil(np.right.key) or lessThan(key, np.right.key),
    // implicit assumption, missing in the code:
    // https://github.com/informalsystems/ics23-audit/issues/14
    np.key == key,
    // Verify
    not(isNil(np.left.key)) or not(isNil(np.right.key)),
    isNil(np.left.key) or and {
      verify(np.left, root, np.left.key, np.left.value),
      lessThan(np.left.key, key),
    },
    isNil(np.right.key) or and {
      verify(np.right, root, np.right.key, np.right.value),
      lessThan(key, np.right.key),
    },
    if (isNil(np.left.key)) {
      isLeftMost(np.right.path)
    } else if (isNil(np.right.key)) {
      isRightMost(np.left.path)
    } else {
      isLeftNeighbor(np.left.path, np.right.path)
    }
  }
}
