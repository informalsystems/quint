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

 - Try this:

          </block>
          <run>echo "2022 + 2023" | quint</run>
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
