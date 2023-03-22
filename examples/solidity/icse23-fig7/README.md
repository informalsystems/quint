# Specifying the lottery contract in Quint

In [lottery.qnt](./lottery.qnt), we specify the lottery contract
that is used as an illustration of atomicity violation in
the paper (Fig. 7):

    Zhuo Zhang, Brian Zhang, Wen Xu, Zhiqiang Lin, "Demystifying Exploitable Bugs in Smart Contracts." ICSE'23.

This example belongs to one of the issues that are not detected
automatically by static analysis tools. But even if this behavior
cannot be automatically detected, can it be specified? The ability
to specify it is the first step towards automatic verification.

To be more exact, the problematic behavior is formally specified
with the test:

```bluespec
    // This is the scenario reported in the paper.
    // By modeling the mempool, we can specify this scenario.
    run lotteryMultiBuyTest = {
        init.then(submit(ResetTx("owner")))
            .then(commit(ResetTx("owner")))
            .then(submit(BuyTx("alice", 1, 1000)))
            .then(commit(BuyTx("alice", 1, 1000)))
            .then(submit(EnterDrawingPhaseTx("owner")))
            .then(commit(EnterDrawingPhaseTx("owner")))
            .then(submit(DrawTx("owner", 3)))
            // Bob can buy lottery tickets in the drawing phase,
            // by front-running the draw transaction
            .then(submit(MultiBuyTx("bob", [3], [2000])))
            .then(commit(MultiBuyTx("bob", [3], [2000])))
            .then(commit(DrawTx("owner", 3)))
    }
```