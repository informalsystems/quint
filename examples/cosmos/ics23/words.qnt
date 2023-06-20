/// A minimal specification of words as lists of integers.
///
/// Igor Konnov, Informal Systems, 2022-2023
module words {
  /// We represent byte sequences as lists of integers
  type WORD_T = List[int]

  /// we interpret the empty word as nil
  def isNil(word) = length(word) == 0

  /// compare two integer words lexicographically
  def lessThan(w1, w2) = {
    val len1 = length(w1)
    val len2 = length(w2)
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
}
