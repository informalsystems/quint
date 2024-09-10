This is a formal specification and invariants of [ICS23 Spec][] in Quint.
If this is the first Quint specification you see, we recommend checking simpler
specifications first. This one is quite advanced.

## Quint specification

 Specification [ics23.qnt](./ics23.qnt) is the Quint specification that contains
 four modules:

  - Module `hashes` introduces a specification of hashes via a symbolic
    representation of irreversible hashes.

  - Module `ics23` contains membership and non-membership proofs,
    following the ICS23 code.

  - Module `ics23test` contains basic unit tests that demonstrate simple
    scenarios of membership and non-membership verification.

  - Module `treeGen` contains advanced randomized tests
    that generate randomized tests for ICS23.

**Unit tests.** You can use Quint REPL to run basic unit tests as follows:

```sh
$ quint test ics23test.qnt
```

**Randomized invariant checking.** Also, you can check membership and
non-membership invariants with the random simulator:

```sh
$ quint run --invariant=nonMemInv --max-samples=1000 treeGen.qnt
$ quint run --invariant=memInv --max-samples=1000 treeGen.qnt
```

If the simulator finds a violation to the above invariants, please let us know,
as these invariants should hold true.

If you would like to produce several examples of checking membership and
non-membership, run the simulator as follows:

```sh
$ quint run --invariant=memExample --max-samples=1000 treeGen.qnt
$ quint run --invariant=nonMemExample --max-samples=1000 treeGen.qnt
```

[ICS23 Spec]: https://github.com/cosmos/ibc/tree/main/spec/core/ics-023-vector-commitments
[ICS23]: https://github.com/confio/ics23/
