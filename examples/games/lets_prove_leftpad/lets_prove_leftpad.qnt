/**
 * A formal specification and proof of the leftpad string padding function.
 * This model implements and verifies a function that pads a string to a specified
 * length by adding a specified character to the beginning of the string.
 *
 * Carlos Rodriguez, Informal Systems, 2025
 */

module lets_prove_leftpad {
  /// Maximum length of the input string or padded string
  pure val MAX_UINT = 100

  /// Characters that can be used for input or padding
  pure val CHARS = Set(
    // Digits
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    
    // Uppercase Letters
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z",
    
    // Lowercase Letters
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z",
    
    // Punctuation Symbols
    "!", "#", "$", "%", "&", "'", "(", ")", "*", "+", 
    ",", "-", ".", "/", ":", ";", "<", "=", ">", "?",
    "@", "[", "\\", "]", "^", "_", "{", "|", "}",
    "~"
  )

  // State
  var n: int // Desired length
  var char: str // Padding character
  var input: List[str] // Input string
  var output: List[str] // Output padded string

  /// Returns the maximum of two integers
  pure def max(x: int, y: int): int =
    if (x > y) x else y

  /// Takes the first n characters of a list of characters
  pure def take(s: List[str], n: int): List[str] =
    s.slice(0, n)

  /// Drops the first n characters of a list of characters
  pure def drop(s: List[str], n: int): List[str] =
    pure val len = s.length()
    s.slice(len - n, len)

  /// Generates a list of characters by repeating a character a number of times.
  /// As Apalache cannot handle ranges on non-constant values (0.to(x)), we repeat for the maximum
  /// range (constant) and then use `take` to reduce them to the actual size we want.
  pure def repeat(c: str, times: int): List[str] =
    0.to(MAX_UINT).fold([], (acc, _) => acc.append(c)).take(times)

  /// The main padding function that adds padding characters to the beginning of a string
  action leftpad(s: List[str], char: str, n: int): bool = all {
    output' = repeat(char, n - s.length()).concat(s)
  }

  /// Init explores different combinations of inputs, padding chars and desired lengths
  action init = all {
    all {
      input' = [],
      char' = "_",
      n' = 0,
      output' = []
    }
  }

  action step = all {
    n < 10,
    // Input string
    nondet next_char = CHARS.oneOf()
    val string = input.append(next_char)
    // Padding character
    nondet paddingChar = CHARS.oneOf()
    // Desired length
    nondet len = 0.to(MAX_UINT).oneOf()
    all {
      input' = string,
      char' = paddingChar,
      n' = n + 1,
      leftpad(string, paddingChar, len)
    }
  }

  // Invariants

  /// 1. The length of the output is max(n, len(input))
  val lengthInvariant = output.length() == max(n, input.length())

  /// 2. The prefix of the output is padding characters and nothing but padding characters
  val prefixInvariant = {
    val paddingLength = n - input.length()
    if (paddingLength > 0)
      output.take(paddingLength) == repeat(char, paddingLength)
    else
      true // No padding means no prefix to check
  }

  /// 3. The suffix of the output is the original string
  val suffixInvariant = {
    val paddingLength = n - input.length()
    if (paddingLength > 0)
      output.drop(paddingLength) == input
    else
      output == input // If no padding is added, the output is the original string
  }

  /// Safety property: The function satisfies all invariants
  val correctness = lengthInvariant and prefixInvariant and suffixInvariant
}
