# Lesson 3 - Basic anatomy of a protocol in Quint
## 1. Introduction

*1 more step to the finish line*

In this tutorial, we explain the standard structure of a Quint protocol.
Although Quint does not impose a very rigid structure on the protocol designers,
we have found that following the same practices helps protocol authors and
readers to cooperate more effectively.

As a motivating example we are using the subcurrency smart contract that
is introduced in the Solidity documentation, see
[Subcurrency](https://docs.soliditylang.org/en/v0.8.17/introduction-to-smart-contracts.html#subcurrency-example).
You do not have to know Solidity to understand our tutorial.
On contrary, you may acquire some basic understanding of Solidity contracts
by reading the Quint protocol specification.

In this tutorial, you will see how to:

 - Specify basic type aliases.

 - Define handy functions that can be used independently of the protocol.

 - Define the structure of the protocol states.

 - Define helper functions that read the current state but do not modify it.

 - Define actions that read and modify the current state of the protocol.

 - Write basic protocol tests.

 - Write protocol tests that use non-determinism.

 - Run basic randomized test to discover an invariant violation.

        
        

If you would like to see the complete code before diving into
the details, check [coin.qnt](./coin.qnt).
        
## The end

  You have made it!
      