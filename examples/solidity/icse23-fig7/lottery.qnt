// -*- mode: Bluespec; -*-
// A Quint version of the contract presented in Figure 7 of the paper:
//
// https://github.com/ZhangZhuoSJTU/Web3Bugs/blob/main/papers/icse23.pdf

// A specification of the lottery contract.
// We write this specification by following functional idioms,
// as this way allows us to easily compose this contract with mempool.
// A non-functional way would be more concise but not that easier to compose.
module lottery {
    type Address = str
    // here we simply ignore the number of bits and do not check for overflows
    type Uint64 = int
    type Uint = int

    // the contract in the paper uses "onlyOwner", we fix the owner for simplicity
    pure def onlyOwner(addr: Address): str = {
        if (addr == "owner") "" else "must be the owner"
    }

    // a state of the lottery contract
    type LotteryState = {
        // user address -> lottery id -> count
        tickets: Address -> Uint64 -> Uint,
        // the winning id
        winningId: Uint64,
        // whether the owner is drawing
        drawingPhase: bool,
    }

    // The result of executing a lottery method (error, nextState).
    // If error != "", error stores the error message.
    // In the future, we should use ADTs:
    // https://github.com/informalsystems/quint/issues/539
    type LotteryResult = (str, LotteryState)

    pure def returnError(msg: str, state: LotteryState): LotteryResult = {
        (msg, state)
    }

    pure def returnState(state: LotteryState): LotteryResult = {
        ("", state)
    }

    // An auxilliary definition similar to Solidity's require
    pure def require(cond: bool, msg: str): str = {
        if (cond) "" else msg
    }

    // an easy way to chain require calls
    pure def andRequire(prevErr: str, cond: bool, msg: str): str = {
        if (prevErr != "") prevErr else require(cond, msg)
    }

    // a nice definition that should be included in the standard library
    pure def getOrElse(m: a -> b, key: a, default: b): b =
        if (key.in(m.keys())) m.get(key) else default

    // contract initialization
    pure val newLottery: LotteryState = {
        tickets: Map(),
        winningId: 0,
        drawingPhase: false
    }

    // invoked every day to reset a round
    pure def reset(state: LotteryState, sender: Address): LotteryResult = {
        pure val err = onlyOwner(sender)
        if (err != "") {
            returnError(err, state)
        } else {
            returnState({ tickets: Map(), winningId: 0, drawingPhase: false })
        }
    }

    pure def buy(state: LotteryState, sender: Address, id: Uint64, amount: Uint): LotteryResult = {
        pure val err =
            require(state.winningId == 0, "already drawn")
              .andRequire(not(state.drawingPhase), "drawing")
        if (err != "") {
            returnError(err, state)
        } else {
            // receivePayment(sender, amount)
            pure val senderTickets = state.tickets.getOrElse(sender, Map())
            pure val newAmounts = senderTickets.put(id, senderTickets.getOrElse(id, amount))
            returnState(state.with("tickets", state.tickets.put(sender, newAmounts)))
        }
    }

    pure def enterDrawingPhase(state: LotteryState, sender: Address): LotteryResult = {
        pure val err = onlyOwner(sender)
        if (err != "") {
            returnError(err, state)
        } else {
            returnState(state.with("drawingPhase", true))
        }
    }

    // id is randomly chosen off-chain, i.e., by chainlink
    pure def draw(state: LotteryState, sender: Address, id: Uint64): LotteryResult = {
        pure val err =
            require(state.winningId == 0, "already drawn")
                .andRequire(state.drawingPhase, "not drawing")
                .andRequire(id != 0, "invalid winning number")
        if (err != "") {
            returnError(err, state)
        } else {
            returnState(state.with("winningId", id))
        }
    }

    action claimReward(state: LotteryState, sender: Address): LotteryResult = {
        pure val err = require(state.winningId != 0, "not drawn")
        if (err != "") {
            returnError(err, state)
        } else {
            // how rewards are claimed is not specified
            returnState(state)
        }
    }

    action multiBuy(state: LotteryState, sender: Address, ids: List[Uint64], amounts: List[Uint]): LotteryResult = {
        // Note that passing ids and amounts as two lists is not natural in Quint.
        // A map of ids to amounts would be more natural in Quint.
        // Since we model the parameters as in the original Solidity contract,
        // we have to make a few hoops.
        val err = require(state.winningId == 0, "already drawn")
        if (err != "") {
            returnError(err, state)
        } else {
            // Solidity creates an empty map automatically, Quint is strict.
            val senderTickets = state.tickets.getOrElse(sender, Map())
            val newAmounts =
                // find the new amounts for sender
                keys(senderTickets).union(indices(ids).map(i => ids[i]))
                    .mapBy(id =>
                        // ids is a list. Hence, we have to sum over the amounts that match the id
                        val topUp =
                            indices(ids)
                                .filter(i => ids[i] == id)
                                .map(i => amounts[i])
                                .fold(0, (sum, a) => sum + a)

                        senderTickets.getOrElse(id, 0) + topUp
                    )

            returnState(state.with("tickets", state.tickets.put(sender, newAmounts)))
        }
    }
}

// executing lottery transactions from the mempool
module lotteryMempool {
    import lottery.*

    // What kind of transaction could be submitted to the mempool.
    // Currently, we are using a record to represent all kinds of transactions.
    // In the future, we should use ADTs:
    // https://github.com/informalsystems/quint/issues/539
    type Transaction = {
        kind: str,
        sender: Address,
        id: Uint64,
        amount: Uint,
        ids: List[Uint64],
        amounts: List[Uint]
    }

    pure def ResetTx(sender: Address): Transaction = {
        kind: "reset", sender: sender, id: 0, amount: 0, ids: [], amounts: []
    }

    pure def BuyTx(sender: Address, id: Uint64, amount: Uint): Transaction = {
        kind: "buy", sender: sender, id: id, amount: amount, ids: [], amounts: []
    }

    pure def EnterDrawingPhaseTx(sender: Address): Transaction = {
        kind: "enterDrawingPhase", sender: sender, id: 0, amount: 0, ids: [], amounts: []
    }

    pure def DrawTx(sender: Address, id: Uint64): Transaction = {
        kind: "draw", sender: sender, id: id, amount: 0, ids: [], amounts: []
    }

    pure def ClaimRewardTx(sender: Address): Transaction = {
        kind: "claimReward", sender: sender, id: 0, amount: 0, ids: [], amounts: []
    }

    pure def MultiBuyTx(sender: Address, ids: List[Uint64], amounts: List[Uint]): Transaction = {
        kind: "multiBuy", sender: sender, id: 0, amount: 0, ids: ids, amounts: amounts
    }

    // the state of the lottery contract (we have just one here)
    var lotteryState: LotteryState
    // The state of the mempool. Recall that transactions are not ordered!
    // For simplicity, we do not count identical transactions twice.
    // If we needed that, we could add an id field to a transaction.
    var mempool: Set[Transaction]
    // The status of the last transaction (either an error message, or "")
    var lastStatus: str

    action init = all {
        lotteryState' = newLottery,
        mempool' = Set(),
        lastStatus' = "",
    }

    // Submit a transaction to the memory pool.
    // This transaction is simply added to the pool, but not executed.
    action submit(tx: Transaction): bool = all {
        mempool' = mempool.union(Set(tx)),
        lotteryState' = lotteryState,
        lastStatus' = lastStatus,
    }

    // an auxilliary action that assigns variables from a method execution result
    action fromResult(r: LotteryResult): bool = all {
        lastStatus' = r._1,
        lotteryState' = r._2,
    }

    // commit a transaction from the memory pool
    action commit(tx: Transaction): bool = all {
        mempool' = mempool.exclude(Set(tx)),
        any {
            all {
                tx.kind == "reset",
                fromResult(reset(lotteryState, tx.sender))
            },
            all {
                tx.kind == "buy",
                fromResult(buy(lotteryState, tx.sender, tx.id, tx.amount))
            },
            all {
                tx.kind == "enterDrawingPhase",
                fromResult(enterDrawingPhase(lotteryState, tx.sender))
            },
            all {
                tx.kind == "draw",
                fromResult(draw(lotteryState, tx.sender, tx.id))
            },
            all {
                tx.kind == "claimReward",
                fromResult(claimReward(lotteryState, tx.sender))
            },
            all {
                tx.kind == "multiBuy",
                fromResult(multiBuy(lotteryState, tx.sender, tx.ids, tx.amounts))
            },
        }
    }
}

// a few tests that demonstrate the happy and unhappy paths
module lotteryTests {
    import lotteryMempool.*

    // this will be done automatically in the future
    action allUnchanged = all {
        mempool' = mempool,
        lotteryState' = lotteryState,
        lastStatus' = lastStatus,
    }

    run buyDrawTest = {
        init.then(submit(ResetTx("owner")))
            .then(commit(ResetTx("owner")))
            .then(submit(BuyTx("alice", 1, 1000)))
            .then(submit(BuyTx("bob", 3, 2000)))
            .then(commit(BuyTx("bob", 3, 2000)))
            .then(commit(BuyTx("alice", 1, 1000)))
            .then(submit(EnterDrawingPhaseTx("owner")))
            .then(commit(EnterDrawingPhaseTx("owner")))
            .then(submit(DrawTx("owner", 3)))
            .then(commit(DrawTx("owner", 3)))
            .then(submit(ClaimRewardTx("bob")))
            .then(commit(ClaimRewardTx("bob")))
    }

    run buyFailureTest = {
        init.then(submit(ResetTx("owner")))
            .then(commit(ResetTx("owner")))
            .then(submit(BuyTx("alice", 1, 1000)))
            .then(commit(BuyTx("alice", 1, 1000)))
            .then(submit(EnterDrawingPhaseTx("owner")))
            .then(submit(BuyTx("bob", 3, 2000)))
            .then(commit(EnterDrawingPhaseTx("owner")))
            // bob's transaction arrives too late
            .then(commit(BuyTx("bob", 3, 2000)))
            .then(all {
                assert(lastStatus == "drawing"),
                allUnchanged,
            })
    }

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
}