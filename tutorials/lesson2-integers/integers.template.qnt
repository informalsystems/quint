/*
 If you do not know how to start this lesson, do one of the following:

 1. Run a Codetour tutorial as follows:
    - Open Visual Studio Code.
    - Install the Quint and Codetour extensions.
    - Choose the tour "Lesson 2 - Integers".
    
 2. Read the accompanying markdown file.
 */
/*!
  <tutorial>
    <title>Lesson 2 - Integers</title>
    <steps>
 !*/
module integersLesson {
    /*!
      <step>
        <title>Introduction</title>
        <description>
**Scores to earn with secret codes: 10**

This lesson teaches you the basics of operations over integers.
If you have programming experience, you know most of these operators.
So it should not take you long to finish this lesson.
        </description>
        <file>$file</file>
        <line>$line</line>
      </step>
    !*/

    // 0 is an integer literal
    pure val int0 = 0

    // 1 is an integer literal
    pure val int1 = 2

    // 2 is an integer literal
    pure val negative1 = -3
    /*!
      <step>
        <file>$file</file>
        <line>$line</line>
        <title>Integer literals</title>
        <description>
Integer literals are written using the standard syntax:
0, 1, -1, 2, -2, ..., 314159265358979323846264338327950288419716939937510.

It is important to understand that Quint integers are big integers.
There is neither a minimum integer, nor there is a maximum integer.
        </description>
      </step>
     !*/

    // i^j is the integer exponentiation, that is,
    // `i` multiplied by itself `j - 1` times
    pure def myPow(i, j) = i^j 
    /*!
      <step>
        <file>$file</file>
        <line>$line</line>
        <title>Integer exponentiation</title>
        <description>
          <block>
We start with the exponentiation `i^j` over integers,
which is also written as `pow(i, j)` in many languages.
The result of `i^j` is simply `i` multiplied by itself `j - 1` times.
This is the first operator, as it lets us to write nice examples
in the following steps.

To get a better intuition at how `i^j` works, run the following examples:

          </block>
          <run>echo "2^32" | quint</run>
          <expect>4294967296</expect>
          <run>echo "2^64" | quint</run>
          <expect>18446744073709551616</expect>
          <run>echo "2^256" | quint</run>
          <expect>115792089237316195423570985008687907853269984665640564039457584007913129639936</expect>
          <run>echo "2^512" | quint</run>
          <expect>13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084096</expect>

          <block>
Exponentiation is not defined on all of its arguments.
Try the following examples to get the intuition.
          </block>
          <run>echo "(-2)^3" | quint</run>
          <expect>-8</expect>
          <run>echo "(-2)^4" | quint</run>
          <expect>16</expect>
          <run>echo "2^(-4)" | quint</run>
          <expect>error</expect>
          <run>echo "0^3" | quint</run>
          <expect>0</expect>
          <run>echo "0^0" | quint</run>
          <expect>it should error, see #492</expect>
        </description>
      </step>
     !*/

    // i + j is the integer addition
    pure def myAdd(i, j) = i + j 
    /*!
      <step>
        <file>$file</file>
        <line>$line</line>
        <title>Integer addition</title>
        <description>
          <block>
We can add two integers by writing `i + j`. Importantly, integers cannot
overflow, as they are big integers.

Try this simple example:

          </block>
          <run>echo "2022 + 2023" | quint</run>
          <expect>4045</expect>
          <block>

It is important to remember that Quint integers follow the laws
of commutativity and associativity:

          </block>
          <run>echo "11 + 17 == 17 + 11" | quint</run>
          <expect>true</expect>
          <run>echo "(11 + 17) + 19 == 11 + (17 + 19)" | quint</run>
          <expect>true</expect>
        </description>
      </step>
     !*/

    // i - j is the integer subtraction
    pure def mySub(i, j) = i - j 
    /*!
      <step>
        <file>$file</file>
        <line>$line</line>
        <title>Integer subtraction</title>
        <description>
          <block>
We can add two integers by writing `i - j`.

 - Try this and see the result of the evaluation:

          </block>
          <run>echo "2022 - 2023" | quint</run>
          <expect>-1</expect>
          <block>

 - Addition and subtraction have the same priority.
   Hence they are applied from left to right.

          </block>
          <run>echo "11 + 13 - 17" | quint</run>
          <expect>7</expect>
        </description>
      </step>
     !*/

    // i * j is the integer multiplication
    pure def myMul(i, j) = i * j 
    /*!
      <step>
        <file>$file</file>
        <line>$line</line>
        <title>Integer multiplication</title>
        <description>
          <block>
We can multiply two integers by writing `i * j`.
Remember that multiplication cannot produce any side effects like overflows.

 - Try this:

          </block>
          <run>echo "2022 * 2023" | quint</run>
          <expect>4045</expect>
          <block>

 - Or that:

          </block>
          <run>echo "4294967295 + 18446744073709551615" | quint</run>
          <expect>18446744078004518910</expect>
        </description>
      </step>
     !*/
}

/*!
    </steps>
  </tutorial>
 !*/
