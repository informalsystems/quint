// This is a protocol specification of ICS23, tuned towards the IAVL case.
//
// For details of ICS23, see:
// https://github.com/cosmos/ibc/tree/main/spec/core/ics-023-vector-commitments
//
// For the implementation of ICS23, see:
// https://github.com/confio/ics23/
//
// Igor Konnov, Informal Systems, 2022-2023
// Josef Widder, Informal Systems, 2024
// Aleksandar Ignjatijevic, Informal Systems, 2024
// Gabriela Moreira, Informal Systems, 2024

// This is a specification of the membership and non-membership proofs
// of ICS23:
//
// https://github.com/confio/ics23/blob/master/go/proof.go
module ics23 {
  import basicSpells.* from "../../spells/basicSpells"
  import hashes.* from "./hashes"

  // ICS23 proof checking.
  // In contrast to the ICS23 implementation, we specialize it to binary trees:
  // https://github.com/confio/ics23/tree/master/go
  type InnerSpec = {
    minPrefixLength: int,
    maxPrefixLength: int,
    childSize: int,
    emptyChild: Term,
    childOrder: List[int],
  }

  pure val IavlSpec: InnerSpec = {
    minPrefixLength: 4,
    maxPrefixLength: 12,
    childSize: 33,
    emptyChild: Hash256_ZERO,
    childOrder: [0, 1]
  }

  type Padding = {
    minPrefix: int,
    maxPrefix: int,
    suffix: int,
  }

  type LeafOp = {
    // The implementation additionally stores hashing and length functions:
    // hash, prehashKey, prehashValue, len. Since we fix the spec to IAVL,
    // we do not have to carry them around.
    prefix: Term
  }

  type InnerOp = {
    // The implementation additionally stores the hashing function.
    // Since we fix the spec to IAVL, we do not have to carry it around.
    prefix: Term,
    suffix: Term
  }

  /// a proof of existence of (key, value)
  type ExistenceProof = {
    key: Bytes, value: Bytes, leaf: LeafOp, path: List[InnerOp]
  }

  /// a proof of non-existence of a key
  type NonExistenceProof = {
    key: Bytes, left: Option[ExistenceProof], right: Option[ExistenceProof]
  }

  pure def hashLeaf(key: Bytes, value: Bytes, prefix: Term): Term = {
    termHash(prefix
      // TODO: use encodeVarintProto
      // https://github.com/cosmos/ics23/blob/d0edf8e9cd38f7fc1bfc4311b2814e5d2ea966e8/go/proof.go#L67
      .termConcat(raw([length(key)]))
      .termConcat(raw(key))
      .termConcat(raw([32]))
      .termConcat(termHash(raw(value))))

  }

  /// calculate a hash from an exists proof
  def existsCalculate(p: ExistenceProof): Term = {
    // This is how the leaf hash is computed.
    // Notice that the key is not hashed.
    val leafHash = hashLeaf(p.key, p.value, p.leaf.prefix)

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
  def verifyMembership(root: Term,
      proof: ExistenceProof, key: Bytes, value: Bytes): bool = {
    // TODO: specify Decompress
    // TODO: specify the case of CommitmentProof_Batch
    // TODO: CheckAgainstSpec ensures that the proof can be verified
    //       by the spec checker
    verify(proof, root, key, value)
  }

  /// checks if an op has the expected padding
  pure def hasPadding(op: InnerOp, pad: Padding): bool = and {
    q::debug("min ok", op.prefix.termLen() >= pad.minPrefix),
    q::debug("max ok", op.prefix.termLen() <= pad.maxPrefix),
    // When inner turns left, suffixLen == child_size,
    // that is, we store the hash of the right child in the suffix.
    // When inner turns right, suffixLen == 0,
    // that is, we store the hash of the left child in the prefix.
    q::debug("ok", op.suffix.termLen() == pad.suffix),
  }

  pure def getPadding(spec: InnerSpec, branch: int): Option[Padding] = {
    match spec.childOrder.findFirst(x => x == branch) {
      | Some(idx) => {
        pure val prefix = idx * spec.childSize
        pure val suffix = spec.childSize * (spec.childOrder.length() - 1 - idx)
        Some({
          minPrefix: prefix + spec.minPrefixLength,
          maxPrefix: prefix + spec.maxPrefixLength,
          suffix: suffix,
        })
      }
      | None => None
    }
  }

  /// This will look at the proof and determine which order it is.
  /// So we can see if it is branch 0, 1, 2 etc... to determine neighbors
  pure def orderFromPadding(spec: InnerSpec, op: InnerOp): Option[int] = {
    pure val len = spec.childOrder.length()
    range(0, len).find_first(branch => {
      match getPadding(spec, branch) {
        | Some(padding) => hasPadding(op, padding)
        | None => false // This should actually early return but this is impossible for our InnerSpec
      }
    })
  }

  /// leftBranchesAreEmpty returns true if the padding bytes correspond to all
  /// empty siblings on the left side of a branch, ie. it's a valid placeholder
  /// on a leftmost path
  def leftBranchesAreEmpty(spec: InnerSpec, op: InnerOp): bool = {
    pure val idx = orderFromPadding(spec, op)
    pure val leftBranches = idx.unwrap()
    and {
      idx != None,
      leftBranches != 0,
      op.prefix.termLen() >= leftBranches * spec.childSize,
      pure val actualPrefix = op.prefix.termLen() - leftBranches * spec.childSize
      0.to(leftBranches - 1).forall(i => {
        pure val idx = spec.childOrder.findFirst(x => x == i).unwrap()
        val from_index = actualPrefix + idx * spec.childSize
        spec.emptyChild == op.prefix.termSlice(from_index, from_index + spec.childSize)
      })
    }
  }

  /// IsLeftMost returns true if this is the left-most path in the tree,
  /// excluding placeholder (empty child) nodes
  def isLeftMost(spec: InnerSpec, path: List[InnerOp]): bool = {
    match getPadding(spec, 0) {
      | Some(pad) => {
        path.indices().forall(i =>
          val step = path[i]
          or {
            // the path goes left
            hasPadding(step, pad),
            // the path goes right, but the left child is empty (a gap)
            leftBranchesAreEmpty(spec, step)
          }
        )
      }
      | None => false
    }
  }

  /// rightBranchesAreEmpty returns true if the padding bytes correspond
  /// to all empty siblings on the right side of a branch,
  /// i.e. it's a valid placeholder on a rightmost path
  def rightBranchesAreEmpty(spec: InnerSpec, op: InnerOp): bool = and {
    val idx = orderFromPadding(spec, op)
    pure val rightBranches = spec.childOrder.length() - 1 - idx.unwrap()
    and {
      idx != None,
      rightBranches != 0,
      op.suffix.termLen() == spec.childSize,
      0.to(rightBranches - 1).forall(i => {
        pure val idx = spec.childOrder.findFirst(x => x == i).unwrap()
        val from_index = idx * spec.childSize
        spec.emptyChild == op.suffix.termSlice(from_index, from_index + spec.childSize)
      })
    }
  }

  /// IsRightMost returns true if this is the left-most path in the tree,
  /// excluding placeholder (empty child) nodes
  def isRightMost(spec: InnerSpec, path: List[InnerOp]): bool = {
    pure val idx = spec.childOrder.length() - 1
    match getPadding(spec, idx) {
      | Some(pad) => {
        path.indices().forall(i =>
          val step = path[i]
          or {
            // the path goes right
            hasPadding(step, pad),
            // the path goes left, but the right child is empty (a gap)
            rightBranchesAreEmpty(spec, step)
          }
        )
      }
      | None => false
    }
  }

  /// isLeftStep assumes left and right have common parents
  /// checks if left is exactly one slot to the left of right
  def isLeftStep(spec: InnerSpec, left: InnerOp, right: InnerOp): bool = {
    // 'left' turns left, and 'right' turns right
    val lorder = q::debug("lorder", orderFromPadding(spec, q::debug("l op", left)))
    val rorder = q::debug("rorder", orderFromPadding(spec, q::debug("r op", right)))
    and {
      lorder != None,
      rorder != None,
      rorder.unwrap() == lorder.unwrap() + 1
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
  def isLeftNeighbor(spec: InnerSpec, lpath: List[InnerOp], rpath: List[InnerOp]): bool = {
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
        q::debug("path match", 1.to(dist).forall(k =>
          val lnode = lpath[li + k]
          val rnode = rpath[ri + k]
          and {
            lnode.prefix == rnode.prefix,
            lnode.suffix == rnode.suffix
          }
        )),
        // Now topleft and topright are the first divergent nodes
        // make sure they are left and right of each other.
        // Actually, lpath[li] and rpath[ri] are an abstraction
        // of the same tree node:
        //  the left one stores the hash of the right one, whereas
        //  the right one stores the hash of the left one.
        q::debug("isLeftStep", isLeftStep(spec, lpath[li], rpath[ri])),
        // left and right are remaining children below the split,
        // ensure left child is the rightmost path, and visa versa
        isRightMost(spec, lpath.slice(0, li)),
        isLeftMost(spec, rpath.slice(0, ri)),
      })
    )
  }

  /// VerifyNonMembership returns true iff
  /// proof is (contains) a NonExistenceProof,
  /// both left and right sub-proofs are valid existence proofs (see above) or nil,
  /// left and right proofs are neighbors (or left/right most if one is nil),
  /// provided key is between the keys of the two proofs
  def verifyNonMembership(root: Term,
      np: NonExistenceProof, key: Bytes): bool = and {
    // implicit assumption, missing in the code:
    // https://github.com/informalsystems/ics23-audit/issues/14
    np.key == key,
    // Verify
    np.left != None or np.right != None,
    np.left != None implies {
      pure val left = np.left.unwrap()
      and {
        lessThan(left.key, key),
        verify(left, root, left.key, left.value),
        lessThan(left.key, key),
      }
    },
    np.right != None implies {
      pure val right = np.right.unwrap()
      and {
        lessThan(key, right.key),
        verify(right, root, right.key, right.value),
        lessThan(key, right.key),
      }
    },

    pure val spec = IavlSpec
    if (np.left == None) {
      isLeftMost(spec, np.right.unwrap().path)
    } else if (np.right == None) {
      isRightMost(spec, np.left.unwrap().path)
    } else {
      q::debug("isLeftNeighbor", isLeftNeighbor(spec, np.left.unwrap().path, np.right.unwrap().path))
    }
  }
}
