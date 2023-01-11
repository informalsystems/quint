# Lesson 2 - Integers
## 1. Introduction

*3 more steps to the finish line*

**Scores to earn with secret codes: 10**

This lesson teaches you the basics of operations over integers.
If you have programming experience, you know most of these operators.
So it should not take you long to finish this lesson.
        
## 2. Integer literals

*2 more steps to the finish line*

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

## 3. Integer addition

*1 more step to the finish line*

          

We can add two integers by writing `i + j`. Importantly, integers cannot
overflow, as they are big integers.

 - Try this:

          

```sh
echo "2022 + 2023" | quint
```



 - Or that:

          

```sh
echo "4294967295 + 18446744073709551615" | quint
```

**Example:**

```scala
    // i + j is the integer addition
    pure def myAdd(i, j) = i + j 
```

# Done!

  You have made it!

  Submit to us the secret codes that you have found in
  this tutorial, and we will place you on the scoreboard.
      