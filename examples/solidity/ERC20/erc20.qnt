// -*- mode: Bluespec; -*-

/**
 * A specification of simple ERC20 that should be easy to use in other specs.
 *
 * The module erc20 closely follows the implementation of ERC20 by OpenZeppelin.
 * However, since Quint is not Solidity, we have to adapt to the features of Quint.
 *
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
 *
 * Igor Konnov, Informal Systems, 2023
 */
module erc20 {
    import basicSpells.* from "../../spells/basicSpells"
    // An address is simply is string. The particular format is not essential.
    type Address = str
    // the special zero address, which corresponds to the address 0 in EVM
    pure val ZERO_ADDRESS = "0"

    // We fix the pool of all addresses, as this make the specification easier to write.
    // To instantiate erc20 with a fixed set of addresses, use:
    // import erc20(AllAddresses = Set(ZERO_ADDRESS, "a", "b", "c")) as myToken
    // val myTokenState = myToken::newErc20("b", 1000)
    const AllAddresses: Set[Address]

    // An EVM integer is 256 bits.
    // We are using big integers and check for overflows manually.
    type Uint = int
    pure val MAX_UINT = 2^256 - 1
    pure def isUint(i: int): bool = 0 <= i and i <= MAX_UINT

    // A state of an ERC20 contract/token
    type Erc20State = {
        balances: Address -> Uint,
        totalSupply: Uint,
        allowance: (Address, Address) -> Uint,
        owner: Address,
    }

    // contract initialization
    pure def newErc20(sender: Address, initialSupply: Uint): Erc20State = {
        balances: AllAddresses.mapBy(a => if (a != sender) 0 else initialSupply),
        totalSupply: initialSupply,
        allowance: tuples(AllAddresses, AllAddresses).mapBy(p => 0),
        owner: sender,
    }

    /**
     * Returns the amount of tokens in existence.
     */
    pure def totalSupply(state: Erc20State): Uint = {
        state.totalSupply
    }

    // An internal implementation, similar to OpenZeppelin's
    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ca822213f2275a14c26167bd387ac3522da67fe9/contracts/token/ERC20/ERC20.sol#L222
    pure def _transfer(state: Erc20State, fromAddr: Address, toAddr: Address, amount: Uint): Result[Erc20State, str] = {
      if (fromAddr == ZERO_ADDRESS) {
        Err("ERC20: transfer from the zero address")
      } else if (toAddr == ZERO_ADDRESS) {
        Err("ERC20: transfer to the zero address")
      } else {
        _update(state, fromAddr, toAddr, amount)
      }
    }

     pure def _update(state: Erc20State, fromAddr: Address, toAddr: Address, amount: Uint): Result[Erc20State, str] = {
      if (fromAddr == ZERO_ADDRESS and toAddr == ZERO_ADDRESS) {
        // Nothing to do
        Ok(state)
      } else if (fromAddr == ZERO_ADDRESS) {
        // Mint, increase total supply
        Ok({ ...state, totalSupply: state.totalSupply + amount })
      } else if (toAddr == ZERO_ADDRESS) {
        // Burn, decrease total supply
        Ok({ ...state, totalSupply: state.totalSupply - amount })
      } else {
        // A transfer between non-zero addresses
        val fromBalance = state.balances.get(fromAddr)
        if (fromBalance < amount) {
          Err("ERC20: Insufficient balance")
        } else {
          Ok({
            ...state,
            balances: state.balances.setBy(fromAddr, balance => balance - amount)
                                    .setBy(toAddr, balance => balance + amount)
          })
        }
      }
    }

    /**
     * ERC20: Moves amount tokens from the sender’s account to `toAddress`.
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Quint: also return an error code and the new state.
     * If the error != "", the new state should be applied.
     */
    pure def transfer(state: Erc20State, sender: Address,
            toAddr: Address, amount: Uint): Result[Erc20State, str] = {
        // `transfer` always returns true, but we should check Result[Erc20State, str].error
        _transfer(state, sender, toAddr, amount)
    }

    pure def approve(state: Erc20State, sender: Address, spender: Address, amount: Uint): Result[Erc20State, str] = {
        _approve(state, sender, spender, amount)
    }

    /**
     * ERC20: Returns the remaining number of tokens that spender will be allowed to
     * spend on behalf of owner through transferFrom. This is zero by default.
     *
     * This value may change when approve or transferFrom are called.
     *
     * Quint: the actual allowance is set up to 0 in newErc20.
     */
    pure def allowance(state: Erc20State, owner: Address, spender: Address): Uint = {
        state.allowance.get((owner, spender))
    }

    /**
     * ERC20: Sets amount as the allowance of spender over the caller’s tokens.
     *
     * Returns a boolean value (and the new state) indicating whether the
     * operation succeeded.
     *
     * Quint: also return an error code and the new state.
     * If the error != "", the new state should be applied.
     */
    pure def _approve(state: Erc20State, owner: Address, spender: Address, amount: Uint): Result[Erc20State, str] = {
      if (owner == ZERO_ADDRESS) {
        Err("ERC20: Invalid approver")
      } else if (spender == ZERO_ADDRESS) {
        Err("ERC20: Invalid spender")
      } else {
        // the case of sender == spender seems to be allowed
        val new_allowance = state.allowance.set((owner, spender), amount)
        Ok({ ...state, allowance: new_allowance })
      }
    }

    /**
     * Moves amount tokens from `fromAddr` to `toAddr` using the allowance mechanism.
     * amount is then deducted from the caller’s allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Quint: also return an error code and the new state.
     * If the error != "", the new state should be applied.
     */
    pure def transferFrom(state: Erc20State, sender: Address,
            fromAddr: Address, toAddr: Address, amount: Uint): Result[Erc20State, str] = {
         _spendAllowance(state, fromAddr, sender, amount)
           .chainResult(s => _transfer(s, fromAddr, toAddr, amount))
    }

  pure def _spendAllowance(state: Erc20State, owner: Address, spender: Address, amount: Uint): Result[Erc20State, str] = {
    val current_allowance = state.allowance.getOrElse((owner, spender), 0)

    if (current_allowance == MAX_UINT) {
      // Does not update the allowance value in case of infinite allowance.
      Ok(state)
    } else {
      if (current_allowance < amount) {
        Err("ERC20: Insufficient Allowance")
      } else {
        _approve(state, owner, spender, current_allowance - amount)
      }
    }
  }

    // Properties that do not belong to the original EIP20 spec,
    // but they should hold true.

    pure def sumOverBalances(balances: Address -> int): int = {
        balances.keys().fold(0, (sum, a) => sum + balances.get(a))
    }

    // The total supply, as stored in the state,
    // is equal to the sum of amounts over all balances.
    pure def isTotalSupplyCorrect(state: Erc20State): bool = {
      state.balances.sumOverBalances() == state.totalSupply
    }

    // Zero address should not carry coins.
    pure def isZeroAddressEmpty(state: Erc20State): bool = {
        state.balances.get(ZERO_ADDRESS) == 0
    }

    // There are no overflows in totalSupply, balances, and approve.
    pure def isNoOverflows(state: Erc20State): bool = and {
        isUint(state.totalSupply),
        state.balances.keys().forall(a => isUint(state.balances.get(a))),
        state.allowance.keys().forall(a => isUint(state.allowance.get(a))),
    }
}

// A set of tests to check the contract
module erc20Tests {
    import basicSpells.* from "../../spells/basicSpells"
    // We are using this module to test the contract,
    // so we fix the set of addresses right away.
    pure val ADDR = Set("0", "alice", "bob", "eve")
    // import all definitions from erc20 for the fixed addresses
    import erc20(AllAddresses = ADDR).*

    // We also restrict the amounts to restrict the search scope.
    // When #566 is fixed, we would be able to use 256-bit integers.
    pure val AMOUNTS = 0.to(100)

    var erc20State: Erc20State
    var error: str

    action init = all {
        nondet sender = ADDR.exclude(Set(ZERO_ADDRESS)).oneOf()
        nondet initialSupply = oneOf(AMOUNTS)
        erc20State' = newErc20(sender, initialSupply),
    }

    // a helper action that assigns to state, provided that there are no errors
    action assign_result(result: Result[Erc20State, str]): bool = all {
      match result {
          | Ok(s) => all {
              erc20State' = s,
              error' = "",
            }
          | Err(e) => all {
              erc20State' = erc20State,
              error' = e,
            }
      },
    }

    action step = {
        // run the contract methods
        nondet sender = oneOf(ADDR)
        nondet amount = oneOf(AMOUNTS)
        any {
            // transfer
            nondet toAddr = oneOf(ADDR)
            assign_result(erc20State.transfer(sender, toAddr, amount)),
            // approve
            nondet spender = oneOf(ADDR)
            assign_result(erc20State.approve(sender, spender, amount)),
            // transferFrom
            nondet fromAddr = oneOf(ADDR)
            nondet toAddr = oneOf(ADDR)
            assign_result(erc20State.transferFrom(sender, fromAddr, toAddr, amount)),
        }
    }

    // check the following invariants via:
    // quint run --verbosity=3 --main=erc20Tests --invariant=noOverflowsInv erc20.qnt
    val totalSupplyInv = isTotalSupplyCorrect(erc20State)

    val zeroAddressInv = isZeroAddressEmpty(erc20State)

    val noOverflowsInv = isNoOverflows(erc20State)

    // Randomized tests that test whether postconditions holds true.

    // Since we want to test ERC20 methods in arbitrary states,
    // not just in the initial states, we have to describe "reasonable" states.
    action initArbitrary = {
        nondet owner = ADDR.exclude(Set(ZERO_ADDRESS)).oneOf()
        nondet balances = ADDR.setOfMaps(AMOUNTS).oneOf()
        nondet allowances = tuples(ADDR, ADDR).setOfMaps(AMOUNTS).oneOf()
        erc20State' = {
            balances: balances,
            totalSupply: sumOverBalances(balances),
            allowance: allowances,
            owner: owner,
        }
    }

    // We want the contract to be only in "valid" states.
    // So we have to define what it means.
    pure def isValid(s: Erc20State): bool = and {
        isZeroAddressEmpty(s),
        isTotalSupplyCorrect(s),
        isNoOverflows(s),
    }

    // the result of transfer matches our intuition
    run transferTest = {
        nondet sender = oneOf(ADDR)
        nondet amount = oneOf(AMOUNTS)
        nondet toAddr = oneOf(ADDR)
        initArbitrary.then(
            match erc20State.transfer(sender, toAddr, amount) {
              // if there were, no guarantees
              | Err(err) => erc20State' = erc20State
              | Ok(newState) =>
                val ob = erc20State.balances
                val nb = newState.balances
                all {
                    assert(or {
                        // if we started in an invalid state, no guarantees
                        not(isValid(erc20State)),
                        if (sender != toAddr) and {
                            nb.get(sender) == ob.get(sender) - amount,
                            nb.get(toAddr) == ob.get(toAddr) + amount,
                            ADDR.forall(a =>
                                a == sender or a == toAddr or nb.get(a) == ob.get(a)
                            ),
                        } else {
                            nb == ob
                        },
                    }),
                    assert(newState.allowance == erc20State.allowance),
                    assert(newState.owner == erc20State.owner),
                    assert(newState.totalSupply == erc20State.totalSupply),
                    // the new state has to be valid only if the old one was valid
                    assert(newState.isValid() or not(erc20State.isValid())),
                    erc20State' = newState
            }
          }
        )
    }

    // TODO: add functional tests for approve and transferFrom
}

// executing ERC20 transactions together with the mempool
module mempool {
    import basicSpells.* from "../../spells/basicSpells"
    // We are using this module to test the contract,
    // so we fix the set of addresses right away.
    pure val ADDR = Set("alice", "bob", "eve", "0")
    // import all definitions from erc20 for the fixed addresses
    import erc20(AllAddresses = ADDR).*

    pure val AMOUNTS = 0.to(MAX_UINT)

    type Status =
      | Pending
      | Success
      | Failure(str)

    // What kind of transaction could be submitted to the mempool.
    type Transaction =
      | Transfer({status: Status, sender: Address, toAddr: Address, amount: Uint})
      | Approve({status: Status, sender: Address, spender: Address, amount: Uint})
      | TransferFrom({status: Status, sender: Address, fromAddr: Address, toAddr: Address, amount: Uint})

    // the state of the ERC20 contract (we have just one here)
    var erc20State: Erc20State
    // The state of the mempool. Recall that transactions are not ordered!
    // For simplicity, we do not count identical transactions twice.
    // If we needed that, we could add an id field to a transaction.
    var mempool: Set[Transaction]
    // The last submitted or executed transaction
    var lastTx: Option[Transaction]

    pure def withStatus(tx: Transaction, status: Status): Transaction = match tx {
      | Transfer(t) => Transfer({ ...t, status: status })
      | Approve(t) => Approve({ ...t, status: status })
      | TransferFrom(t) => TransferFrom({ ...t, status: status })
    }

    action init = all {
        nondet sender = oneOf(ADDR.exclude(Set(ZERO_ADDRESS)))
        nondet initialSupply = oneOf(AMOUNTS)
        erc20State' = newErc20(sender, initialSupply),
        mempool' = Set(),
        lastTx' = None,
    }

    // Submit a transaction to the memory pool.
    // This transaction is simply added to the pool, but not executed.
    action submit(tx: Transaction): bool = all {
        mempool' = mempool.union(Set(tx)),
        erc20State' = erc20State,
        lastTx' = Some(tx),
    }

    // an auxilliary action that assigns variables from a method execution result
    action assign_result(tx: Transaction, r: Result[Erc20State, str]): bool = all {
        match r {
          | Err(err) => all {
            lastTx' = Some(tx.withStatus(Failure(err))),
            erc20State' = erc20State,
         }
         | Ok(state) => all {
            lastTx' = Some(tx.withStatus(Success)),
            erc20State' = state,
         }
      }
    }

    // commit a transaction from the memory pool
    action commit(tx: Transaction): bool = all {
        mempool' = mempool.exclude(Set(tx)),
        val result = match tx {
          | Transfer(t) => transfer(erc20State, t.sender, t.toAddr, t.amount)
          | Approve(t) => approve(erc20State, t.sender, t.spender, t.amount)
          | TransferFrom(t) => transferFrom(erc20State, t.sender, t.fromAddr, t.toAddr, t.amount)
        }
        assign_result(tx, result)
    }
    // Possible behavior of the mempool and ERC20
    // (constrained by the above parameters)
    action step =
        any {
            // Post the contract transactions.
            nondet sender = oneOf(ADDR)
            nondet amount = oneOf(AMOUNTS)
            any {
                // transfer
                nondet toAddr = oneOf(ADDR)
                submit(Transfer({status: Pending, sender: sender, toAddr: toAddr, amount: amount})),
                // approve
                nondet spender = oneOf(ADDR)
                submit(Approve({status: Pending, sender: sender, spender: spender, amount: amount})),
                // transferFrom
                nondet fromAddr = oneOf(ADDR)
                nondet toAddr = oneOf(ADDR)
                submit(TransferFrom({status: Pending, sender: sender, fromAddr: fromAddr, toAddr: toAddr, amount: amount})),
            },
            // commit one of the contract transactions
            all {
                mempool != Set(),
                nondet tx = oneOf(mempool)
                commit(tx)
            }
        }

    /**
    * No transferFrom should be possible, while there is a pending approval
    * for a smaller amount. This invariant is violated, as explained in:
    *
    * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    *
    * We can check this invariant with the Quint simulator:
    *
    * quint run --max-samples=1000000 --max-steps=6 \
    *   --invariant=noTransferFromWhileApproveInFlight --main=mempool erc20.qnt
    */
    val noTransferFromWhileApproveInFlight = {
        val badExample = match lastTx {
          | None => false
          | Some(tx) => match tx {
            | TransferFrom(t) => and {
              t.amount > 0,
              t.status == Success,
              mempool.exists(tx => match tx {
                | Approve(a) => all {
                    a.sender == t.fromAddr,
                    a.spender == t.sender,
                    a.amount < t.amount,
                    a.amount > 0,
                  }
                | _ => false
              })
            }
            | _ => false
          }
        }
        not(badExample)
    }
    
    /**
     * A test that demonstrates that the above invariant may be violated.
     * Yes, we have copied it from the simulator output.
     */
    run transferFromWhileApproveInFlightTest = {
        all {
            erc20State' = newErc20("alice", 91),
            mempool' = Set(),
            lastTx' = None,
        }
        // alice set a high approval for bob
        .then(submit(Approve({ status: Pending, sender: "alice", spender: "bob", amount: 92 })))
        // bob immediately initiates his transferFrom transaction
        .then(submit(TransferFrom({ status: Pending, sender: "bob", fromAddr: "alice", toAddr: "eve", amount: 54 })))
        // alice changes her mind and lowers her approval to bob
        .then(submit(Approve({ status: Pending, sender: "alice", spender: "bob", amount: 9 })))
        // but the previous approval arrives at the ledger
        .then(commit(Approve({ status: Pending, sender: "alice", spender: "bob", amount: 92 })))
        // ...and bob manages to transfer more than alice wanted to
        .then(commit(TransferFrom({ status: Pending, sender: "bob", fromAddr: "alice", toAddr: "eve", amount: 54 })))
        .then(all { step, assert(not(noTransferFromWhileApproveInFlight)) })
    }
}
