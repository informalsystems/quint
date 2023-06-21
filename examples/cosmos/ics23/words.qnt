/// A symbolic specification of a string that is suitable for reasoning about
/// strings and hashes (such as SHA256). The exact hash function is irrelevant.
/// The only assumption is that a hash is irreversible.
///
/// Similar to symbolic reasoning by Dolev and Yao, we would like to represent:
///  - a raw sequence of bytes, e.g., [ 1, 2, 3 ],
///  - a hashed sequence, e.g., h([ 1, 2, 3 ]),
///  - a concatenation of a raw sequence and a hash (in any order),
///    e.g., [ 1, 2 ] + h([ 3, 4 ])],
///  - nested hashes, e.g., h([ 1, 2 ] + h([ 3, 4 ])).
///
/// So the idea is basically to represent words as terms, where the atoms are
/// sequences of integers, and terms are constructed as n-ary applications
/// of the symbol "h", which means "hash". Since Quint enforces strict typing
/// and it does not allow for inductive/recursive algebraic data types,
/// we represent terms as maps that encode trees. For instance,
/// the term h([ 1, 2 ] + h([ 3, 4 ])) + [ 5, 6 ] corresponds to the tree:
///
///       "h"      [ 5, 6 ]
///     /     \
/// [ 1, 2 ]   "h"
///          /
///      [ 3, 4 ]
///
/// The above tree is represented as a map in Quint:
///
/// Map([ 0 ] -> { t: "h", b: [] },
///     [ 0, 0 ] -> { t: "r", b: [ 1, 2 ] },
///     [ 0, 1 ] -> { t: "h", b: [] } ),
///     [ 0, 1, 0 ] -> { t: "r", b: [ 3, 4 ] },
///     [ 1 ] -> { t: "r", b: [ 5, 6 ] })
///
/// Igor Konnov, Informal Systems, 2022-2023
module words {
  /// compare two lists of integers (e.g., bytes) lexicographically
  pure def lessThan(w1: List[int], w2: List[int]): bool = {
    pure val len1 = length(w1)
    pure val len2 = length(w2)
    or {
      len1 < len2 and w1.indices().forall(i => w1[i] == w2[i]),
      and {
        len1 == len2,
        w1.indices().exists(i => and {
          w1[i] < w2[i],
          w1.indices().forall(j => j < i implies w1[i] == w2[j])
        })
      }
    }
  }

  /// A tree node that represents a fragment of a term
  type TERM_NODE_T = {
    // node type: either "h" (for hash), or "r" (for raw sequence)
    t: str,
    // the bytes when t = "r", and [] when t = "h"
    b: List[int]
  }

  /// A word is a map from a path to the term node.
  /// The first root's child is [ 0 ], the second root's child is [ 1 ],
  /// the first child of [ 0 ] is [ 0, 0], etc.
  type TERM_T = List[int] -> TERM_NODE_T

  // Construct the term that encodes a raw sequence of bytes
  pure def raw(bytes: List[int]): TERM_T = {
    Map([ 0 ] -> { t: "r", b: bytes })
  }

  /// Does the term represent the empty raw sequence of bytes
  pure def isNil(term: TERM_T): bool = {
    term == Map([ 0 ] -> { t: "r", b: [] })
  }

  // Hash a term
  pure def hash(term: TERM_T): TERM_T = {
    // add "h" on top, which has the key [ 0 ], and attach term to it
    pure val paths = Set([ 0 ]).union(keys(term).map(p => [ 0 ].concat(p)))
    paths.mapBy(p =>
      if (p == [ 0 ]) {
        { t: "h", b: [] }
      } else {
        term.get(p.slice(1, length(p)))
      }
    )
  }

  /// Concatenate two terms. Special attention is paid to the case when the
  /// both terms are raw sequences, which requires them to be merged.
  pure def plus(left: TERM_T, right: TERM_T): TERM_T = {
    pure val l = left.get([0])
    pure val r = right.get([0])
    if (size(keys(left)) == 1 and size(keys(right)) == 1 and l.t == "r" and r.t == "r") {
      // both arguments are raw sequences, produce a single raw sequence
      Map([0] -> { t: "r", b: l.b.concat(r.b) })
    } else {
      // Merge the arguments as trees representing terms.
      // The number of root's children in the left term:
      pure val lwidth = size(keys(left).filter(p => length(p) == 1))
      // the paths of the right term shifted to the right by lwidth
      pure val rshifted =
        keys(right).map(p => [ lwidth + p[0] ].concat(p.slice(1, length(p))))
      // the paths of the concatenation
      pure val paths = keys(left).union(rshifted)
      // the resulting term as a map
      paths.mapBy(p =>
        if (p[0] < lwidth) {
          left.get(p)
        } else {
          right.get( [ p[0] - lwidth ].concat(p.slice(1, length(p))))
        }
      )
    }
  }
}
