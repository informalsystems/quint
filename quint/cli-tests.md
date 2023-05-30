This is a script for running examples with `quint`.

This script requires [`txm`](https://www.npmjs.com/package/txm) to be
installed:

```sh
npm install -g txm
```

*NOTE*: these tests only check that particular invocations succeed or fail. For
tests that examine particular output, use
[./io-cli-tests.md](./io-cli-tests.md).

All tests in the following cases are run as commands to `bash`.

<!-- !test program
bash -
-->

### OK on repl input

<!-- !test check repl 1 + 1 -->
    echo "1 + 1" | quint

### OK on parse Paxos

<!-- !test check Paxos -->
    quint parse ../examples/classic/distributed/Paxos/Paxos.qnt

### OK on typecheck Paxos

<!-- !test check Paxos - Types & Effects -->
    quint typecheck ../examples/classic/distributed/Paxos/Paxos.qnt

### OK on parse Voting

<!-- !test check Voting -->
    quint parse ../examples/classic/distributed/Paxos/Voting.qnt

### OK on typecheck Voting

<!-- !test check Voting - Types & Effects -->
    quint typecheck ../examples/classic/distributed/Paxos/Voting.qnt

### OK on parse ReadersWriters

<!-- !test check ReadersWriters -->
    quint parse ../examples/classic/distributed/ReadersWriters/ReadersWriters.qnt

### OK on typecheck ReadersWriters

<!-- !test check ReadersWriters - Types & Effects -->
    quint typecheck ../examples/classic/distributed/ReadersWriters/ReadersWriters.qnt

### OK on parse EWD840

<!-- !test check EWD840 -->
    quint parse ../examples/classic/distributed/ewd840/ewd840.qnt

### OK on typecheck EWD840

This example was pointing to Paxos. Now it does not typecheck.
See [#581](https://github.com/informalsystems/quint/issues/581).

Temporarily disabled.

<!-- test check EWD840 - Types & Effects -->
    quint typecheck ../examples/classic/distributed/ewd840/ewd840.qnt

### OK on parse Tendermint

<!-- !test check Tendermint -->
    quint parse ../examples/cosmos/tendermint/TendermintAcc005.qnt

### OK on typecheck Tendermint

<!-- !test check Tendermint - Types & Effects -->
    quint typecheck ../examples/cosmos/tendermint/TendermintAcc005.qnt

### OK on test Tendermint

<!-- !test check Tendermint - Test -->
    quint test --max-samples=100 --main InstanceTests ../examples/cosmos/tendermint/TendermintAcc005.qnt

### OK on parse imports

<!-- !test check imports -->
    quint parse ../examples/language-features/imports.qnt

### OK on typecheck imports

<!-- !test check imports - Types & Effects -->
    quint typecheck ../examples/language-features/imports.qnt

### OK on parse instances

<!-- !test check instances -->
    quint parse ../examples/language-features/instances.qnt

### OK on typecheck instances

<!-- !test check instances - Types & Effects -->
    quint typecheck ../examples/language-features/instances.qnt

### OK on parse instancesFrom

<!-- !test check instancesFrom -->
    quint parse ../examples/language-features/instancesFrom.qnt

### OK on typecheck instancesFrom

<!-- !test check instancesFrom - Types & Effects -->
    quint typecheck ../examples/language-features/instancesFrom.qnt

### OK on parse option

<!-- !test check option -->
    quint parse ../examples/language-features/option.qnt

### OK on typecheck option

<!-- !test check option - Types & Effects -->
    quint typecheck ../examples/language-features/option.qnt

### OK on parse BinSearch

<!-- !test check BinSearch -->
    quint parse ../examples/classic/sequential/BinSearch/BinSearch.qnt

### OK on typecheck BinSearch

<!-- !test check BinSearch - Types & Effects -->
    quint typecheck ../examples/classic/sequential/BinSearch/BinSearch.qnt

### OK on parse TicTacToe

<!-- !test check TicTacToe -->
    quint parse ../examples/puzzles/tictactoe/tictactoe.qnt

### OK on typecheck TicTacToe

<!-- !test check TicTacToe - Types & Effects -->
    quint typecheck ../examples/puzzles/tictactoe/tictactoe.qnt

### OK on parse ics20 bank

<!-- !test check ics20 bank -->
    quint parse ../examples/cosmos/ics20/bank.qnt

### OK on typecheck ics20 bank

<!-- !test check ics20 bank - Types & Effects -->
    quint typecheck ../examples/cosmos/ics20/bank.qnt

### OK on parse ics23

<!-- !test check ics23 -->
    quint parse ../examples/cosmos/ics23/ics23.qnt

### OK on typecheck ics23

<!-- !test check ics23 - Types & Effects -->
    quint typecheck ../examples/cosmos/ics23/ics23.qnt

### OK on parse ERC20

<!-- !test check ERC20 -->
    quint parse ../examples/solidity/ERC20/erc20.qnt

### OK on typecheck ERC20

<!-- !test check ERC20 - Types & Effects -->
    quint typecheck ../examples/solidity/ERC20/erc20.qnt

### OK on parse Lamport Mutex

<!-- !test check LamportMutex -->
    quint parse ../examples/classic/distributed/LamportMutex/LamportMutex.qnt

### OK on typecheck Lamport Mutex

<!-- !test check LamportMutex - Types & Effects -->
    quint typecheck ../examples/classic/distributed/LamportMutex/LamportMutex.qnt

### OK on parse counters

<!-- !test check counters -->
    quint parse ../examples/language-features/counters.qnt

### OK on parse records

<!-- !test check records -->
    quint parse ../examples/language-features/records.qnt

### OK on typecheck records

<!-- !test check records - Types & Effects-->
    quint typecheck ../examples/language-features/records.qnt

### OK on parse tuples

<!-- !test check tuples -->
    quint parse ../examples/language-features/tuples.qnt

### OK on typecheck tuples

<!-- !test check tuples - Types & Effects-->
    quint typecheck ../examples/language-features/tuples.qnt

### OK on typecheck clockSync3

<!-- !test check typecheck clockSync3.qnt -->
    quint typecheck ../examples/classic/distributed/ClockSync/clockSync3.qnt

### OK on typecheck counters

<!-- !test check counters - Types & Effects-->
    quint typecheck ../examples/language-features/counters.qnt

### OK on typecheck booleans

<!-- !test check booleans - Types & Effects-->
    quint typecheck ../examples/language-features/booleans.qnt

### OK on typecheck coin

<!-- !test check coin - Types & Effects-->
    quint typecheck ../examples/solidity/Coin/coin.qnt

### OK on test SimpleAuctionNonComposable.qnt

<!-- !test check SimpleAuctionNonComposable - Syntax/Types & Effects/Unit tests -->
    quint test --main=SimpleAuction ../examples/solidity/SimpleAuction/SimpleAuctionNonComposable.qnt

### OK on test nondet.qnt

<!-- !test check nondet - Syntax/Types & Effects/Unit tests -->
    quint test --main=nondetEx ../examples/language-features/nondet.qnt

### OK on test lottery.qnt

<!-- TODO: Spec test is erroneous https://github.com/informalsystems/quint/issues/775 -->
<!-- check lottery - Syntax/Types & Effects/Unit tests -->
<!--     quint test --main=lotteryTests ../examples/solidity/icse23-fig7/lottery.qnt -->

### OK on test erc20.qnt::mempool

<!-- !test check erc20::mempool - Syntax/Types & Effects/Unit tests -->
    quint test --main=mempool ../examples/solidity/ERC20/erc20.qnt

### OK on test erc20.qnt::erc20Tests

<!-- !test check erc20::erc20Tests - Syntax/Types & Effects/Unit tests -->
    quint test --main=erc20Tests ../examples/solidity/ERC20/erc20.qnt

### OK on test ics20 bank

<!-- !test check ics20 bank - Syntax/Types & Effects/Unit tests -->
    quint test --main bankTests ../examples/cosmos/ics20/bank.qnt

### OK on test ics20 denomTrace
<!-- !test check ics20 denomTrace - Syntax/Types & Effects/Unit tests -->
    quint test --main=properChannelsTests ../examples/cosmos/ics20/denomTrace.qnt

### OK on test ics20
<!-- !test check ics20 - Syntax/Types & Effects/Unit tests -->
    quint test --main ics20Test ../examples/cosmos/ics20/ics20.qnt

### OK on test importFrom

<!-- !test check importFrom - Syntax/Types & Effects/Unit tests -->
    quint test ../examples/language-features/importFrom.qnt

### OK on run prisoners

<!-- !test check prisoners - Syntax/Types & Effects/Invariants -->
    quint run --main=prisoners3 --invariant='countInv and safetyInv' \
    ../examples/puzzles/prisoners/prisoners.qnt

### OK on typecheck SuperSpec.qnt

<!-- !test check SuperSpec - Types & Effects-->
    quint typecheck testFixture/SuperSpec.qnt

### OK REPL tutorial

The REPL tutorial is reproducible in REPL.

<!-- !test check REPL tutorial -->
```
if [ "$UNAME" == "Linux" -o "$UNAME" == "Darwin" ]; then
  quint -q -r ../tutorials/repl/kettle.qnt::kettle <../tutorials/repl/replTestIn.txt \
    | diff - ../tutorials/repl/replTestOut.txt
fi
# else diff does not work as expected on windows
```

### OK on test basicSpells

<!-- !test check basicSpells - Syntax/Types & Effects/Unit tests -->
    quint test ../examples/spells/basicSpells.qnt

### OK on test commonSpells

<!-- !test check commonSpells - Syntax/Types & Effects/Unit tests -->
    quint test ../examples/spells/commonSpells.qnt

### OK on test rareSpells

<!-- !test check rareSpells - Syntax/Types & Effects/Unit tests -->
    quint test ../examples/spells/rareSpells.qnt

### OK on test bug843pureValCache

<!-- !test check bug843pureValCache - Syntax/Types & Effects/Unit tests -->
    quint test ./testFixture/bug843pureValCache.qnt

### OK on run lottery

<!-- !test exit 1 -->
<!-- !test check lottery - Run -->
    quint run --max-samples=10000 --max-steps=10 --seed=0x29f8e8021fae9 \
      --invariant=noBuyInDrawingInv --main=lotteryMempool \
      ../examples/solidity/icse23-fig7/lottery.qnt