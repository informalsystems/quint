# Overview

This is a formal specification and correctness proof of the `leftpad` string padding function. The model implements and verifies a function that pads a string to a specified length by adding a specified character to the beginning of the string.

# Objective

Prove the correctness of the `leftpad` function by demonstrating that it satisfies three key invariants:

1. The length of the output is the maximum of the desired length and the input string's length
2. The prefix consists only of padding characters
3. The suffix is the original input string

# Components

## Constants

- `MAX_UINT`: Maximum length (2^8 - 1) for input/output strings
- `CHARS`: Set of valid characters (including digits, letters, and punctuation)

## Variables

- `n`: Desired length of the padded string
- `char`: Character to use for padding
- `input`: The input string (represented as a list of characters)
- `output`: The resulting padded string

## Helper Functions

- `max`: Returns the maximum of two integers
- `repeat`: Generates a list by repeating a character a specified number of times
- `take`: Returns the first `n` characters of a list
- `drop`: Returns all but the first n characters of a list

## Main Function

- `leftpad`: Pads the input string with the specified character to reach the desired length

# Invariants

The model proves three key properties about the `leftpad` function:

## 1. Length Invariant

```
output.length() == max(n, input.length())
```

The output length is always the maximum of the desired length and the input string's length.

## 2. Prefix Invariant

When padding is needed (`n > input.length()`), the prefix consists only of padding characters:

```
output.take(n - input.length()) == repeat(char, n - input.length())
```

## 3. Suffix Invariant

The suffix of the output matches the input string:

```
if (n > input.length())
  output.drop(n - input.length()) == input
else
  output == input
```

# Usage

- **Initialization:** The model starts with a simple example: padding "foo" with "!"
- **Step Actions:** The model explores different combinations of:
  - Input strings of varying lengths
  - Different padding characters
  - Different desired lengths

## Running the Model

```
quint run lets_prove_leftpad.qnt
```
