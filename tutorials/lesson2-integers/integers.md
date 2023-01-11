# Lesson 2 - Integers
## 1. Introduction

*6 more steps to the finish line*

**Scores to earn with secret codes: 10**

This lesson teaches you the basics of operations over integers.
If you have programming experience, you know most of these operators.
So it should not take you long to finish this lesson.
        
## 2. Integer literals

*5 more steps to the finish line*

Integer literals are written using the standard syntax:
0, 1, -1, 2, -2, ..., 314159265358979323846264338327950288419716939937510.

It is important to understand that Quint integers are big integers.
There is neither a minimum integer, nor there is a maximum integer.
        
**Example:**

```scala
    // 0 is an integer literal
    pure val int0 = 0

    // 1 is an integer literal
    pure val int1 = 2

    // 2 is an integer literal
    pure val negative1 = -3
```

## 3. Integer exponentiation

*4 more steps to the finish line*

          

We start with the exponentiation `i^j` over integers,
which is also written as `pow(i, j)` in many languages.
The result of `i^j` is simply `i` multiplied by itself `j - 1` times.
This is the first operator, as it lets us to write nice examples
in the following steps.

To get a better intuition at how `i^j` works, run the following examples:

          

```sh
echo "2^32" | quint
```


```sh
echo "2^64" | quint
```


```sh
echo "2^256" | quint
```


```sh
echo "2^512" | quint
```


Exponentiation is not defined on all of its arguments.
Try the following examples to get the intuition.
          

```sh
echo "(-2)^3" | quint
```


```sh
echo "(-2)^4" | quint
```


```sh
echo "2^(-4)" | quint
```


```sh
echo "0^3" | quint
```


```sh
echo "0^0" | quint
```

**Example:**

```scala
    // i^j is the integer exponentiation, that is,
    // `i` multiplied by itself `j - 1` times
    pure def myPow(i, j) = i^j 
```

## 4. Integer addition

*3 more steps to the finish line*

          

We can add two integers by writing `i + j`. Importantly, integers cannot
overflow, as they are big integers.

Try this simple example:

          

```sh
echo "2022 + 2023" | quint
```



It is important to remember that Quint integers follow the laws
of commutativity and associativity:

          

```sh
echo "11 + 17 == 17 + 11" | quint
```


```sh
echo "(11 + 17) + 19 == 11 + (17 + 19)" | quint
```

**Example:**

```scala
    // i + j is the integer addition
    pure def myAdd(i, j) = i + j 
```

## 5. Integer subtraction

*2 more steps to the finish line*

          

We can add two integers by writing `i - j`.

 - Try this and see the result of the evaluation:

          

```sh
echo "2022 - 2023" | quint
```



 - Addition and subtraction have the same priority.
   Hence they are applied from left to right.

          

```sh
echo "11 + 13 - 17" | quint
```

**Example:**

```scala
    // i - j is the integer subtraction
    pure def mySub(i, j) = i - j 
```

## 6. Integer multiplication

*1 more step to the finish line*

          

We can multiply two integers by writing `i * j`.
Remember that multiplication cannot produce any side effects like overflows.

 - Try this:

          

```sh
echo "2022 * 2023" | quint
```



 - Or that:

          

```sh
echo "4294967295 + 18446744073709551615" | quint
```

**Example:**

```scala
    // i * j is the integer multiplication
    pure def myMul(i, j) = i * j 
```

# Done!

  You have made it!

  Submit to us the secret codes that you have found in
  this tutorial, and we will place you on the scoreboard.
      