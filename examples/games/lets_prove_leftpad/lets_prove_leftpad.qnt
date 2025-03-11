/**
 * A formal specification and proof of the leftpad string padding function.
 * This model implements and verifies a function that pads a string to a specified
 * length by adding a specified character to the beginning of the string.
 *
 * Carlos Rodriguez, Informal Systems, 2025
 */

module LeftPad {
  /// Maximum length of the input string or padded string
  pure val MAX_UINT = 2^8 - 1

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
    "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}",
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

  /// Generates a list of characters by repeating a character a number of times
  pure def repeat(c: str, times: int): List[str] =
    range(0, times).foldl([], (acc, _) => acc.append(c))

  /// Takes the first n characters of a list of characters
  pure def take(s: List[str], n: int): List[str] =
    range(0, n).foldl([], (acc, i) => if (i < s.length()) acc.append(s.nth(i)) else acc)

  /// Drops the first n characters of a list of characters
  pure def drop(s: List[str], n: int): List[str] =
    range(n, s.length()).foldl([], (acc, i) => acc.append(s.nth(i)))

  /// The main padding function that adds padding characters to the beginning of a string
  action leftpad(s: List[str], char: str, n: int): bool = all {
    output' = if (s.length() >= n)
      s
    else
      repeat(char, n - s.length()).concat(s)
  }

  /// Initialize the state with a simple example: padding "foo" with "!"
  action init = {
    val string = List("f", "o", "o")
    all {
      n' = 0,
      char' = "!",
      input' = string,
      output' = string,
    }
  }

  /// Step explores different combinations of inputs, padding chars and desired lengths
  action step = all {
    // Input string
    nondet inputChar = CHARS.oneOf()
    nondet inputLen = 0.to(MAX_UINT).oneOf()
    val string = repeat(inputChar, inputLen)
    // Padding character
    nondet paddingChar = CHARS.oneOf()
    // Desired length
    nondet len = 0.to(MAX_UINT).oneOf()
    all {
      input' = string,
      char' = paddingChar,
      n' = len,
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
