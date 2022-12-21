
# ERC20 protocol

Modeling ERC20 tokens of Ethereum and the Approve-TransferFrom Attack:

EIP-20: https://eips.ethereum.org/EIPS/eip-20

Attack scenario:
https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit#

This protocol is defined over a set of addresses and possible ammounts of tokens that can be used in its methods.
```quint
const ADDR: set(ADDR)
const AMMOUNTS: set(int)
```

It interacts with some blockchain data, reading and updating the balance of accounts and allowances between accounts.
```quint
var balanceOf: ADDR -> int
var allowance: (ADDR, ADDR) -> int
```

The protocol works on top of Ethereum transactions, which can be seen as a set of pending transactions to be executed against the contract with unique IDs. This is a set instead of a sequence, as the order of transactions on Ethereum is not predefined. The unique IDs enable two 'equal' transactions to be submitted.
```quint
var pendingTransactions: set(TX)
var lastTx: TX
var nextTxId: int
```

## transfer

Transfers `value` amount of tokens from smart contract address `sender` to address `toAddr`, and MUST fire the Transfer event. The function SHOULD throw if the message caller’s account balance does not have enough tokens to spend.

Note Transfers of 0 values MUST be treated as normal transfers and fire the `Transfer` event
```quint
action SubmitTransfer(sender, toAddr, value) = {
  val newTx = { id: nextTxId, tag: "transfer", fail: false,
                sender: sender, toAddr: toAddr, value: value }
  all {
    pendingTransactions <- pendingTransactions.union(set(newTx)),
    lastTx <- { id: 0, tag: "none", fail: false },
    nextTxId <- nextTxId + 1,
    balanceOf <- balanceOf,
    allowance <- allowance,
  }
}
```

A pending transfer can be commited at any time. It fails iff one of this conditions is true:
- the value is negative;
- the sender has insufficient tokens;
- the receiver of the transfer is the same address as the sender;

If the transfer succeeds, the balances of both sender and receiver balances are updated.
```quint
action CommitTransfer(tx) = all {
  tx.tag == "transfer",
  pendingTransactions <- pendingTransactions.exclude(set(tx)),
  allowance <- allowance,
  nextTxId <- nextTxId,
  val fail = or {
   tx.value < 0,
   tx.value > balanceOf[tx.sender],
   tx.sender == tx.toAddr
  } all {
    lastTx <- tx.with("fail", fail),
    if (fail)
      balanceOf <- balanceOf
    else
      balanceOf <- balanceOf
                     .updateAs(tx.sender, v => v - tx.value)
                     .updateAs(tx.toAddr, v => v + tx.value)
  },
}
```
