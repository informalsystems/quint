# Integration tests against Apalache


All of the test inputs in the following test cases are commands executed by
`bash`.

We currently assume that the Apalache server has already been started. 
So before running these tests, in a separate terminal session, run

```
apalache-mc server
```

This requirement will be removed with https://github.com/informalsystems/quint/issues/823

<!-- !test program
bash -
-->

## Configuration errors

### Verifying spec with invalid init param produces an error

<!-- !test in invalid init -->
```
quint verify --init=invalidInit ../examples/language-features/booleans.qnt
```

<!-- !test exit 1 -->
<!-- !test err invalid init -->
```
error: [QNT404] Name 'invalidInit' not found
error: name resolution failed
```


## Successful verification


### Can verify `../examples/classic/sequential/BinSearch/BinSearch.qnt`

Contains an import + const instantiation.

<!-- !test check can check BinSearch.qnt -->
```
quint verify --invariant=Postcondition --main=BinSearch10 ../examples/classic/sequential/BinSearch/BinSearch.qnt
```

<!-- !test check can check BinSearch10.qnt using APALACHE_DIST -->
```
APALACHE_DIST=_build/apalache quint verify --invariant=Postcondition --main=BinSearch10 ../examples/classic/sequential/BinSearch/BinSearch.qnt
```

### Default `step` and `init` operators are found

<!-- !test check can find default operator names -->
```
quint verify ../examples/verification/defaultOpNames.qnt
```

### Can verify with single invariant

<!-- !test check can specify --invariant -->
```
quint verify --invariant inv ../examples/verification/defaultOpNames.qnt
```

### Can verify with two invariants

<!-- !test check can specify multiple invariants -->
```
quint verify --invariant inv,inv2 ../examples/verification/defaultOpNames.qnt
```

## Violations

### Variant violations are reported with traces

<!-- !test in prints a trace on invariant violation -->
```
output=$(quint verify --invariant inv ./testFixture/apalache/violateOnFive.qnt)
exit_code=$?
echo "$output" | sed -e 's/([0-9]*ms)/(duration)/'
exit $exit_code
```

<!-- !test exit 1 -->
<!-- !test err prints a trace on invariant violation -->
```
error: found a counterexample
```

<!-- !test out prints a trace on invariant violation -->
```
An example execution:

[State 0] { n: 1 }

[State 1] { n: 2 }

[State 2] { n: 3 }

[State 3] { n: 4 }

[State 4] { n: 5 }

[violation] Found an issue (duration).
```

### Variant violations write ITF to file when `--out-itf` is specified

<!-- !test in writes an ITF trace to file -->
```
quint verify --out-itf violateOnFive.itf.json --invariant inv ./testFixture/apalache/violateOnFive.qnt
jq '.[0]."#meta".format' violateOnFive.itf.json
rm ./violateOnFive.itf.json
```

<!-- !test err writes an ITF trace to file -->
```
error: found a counterexample
```

<!-- !test out writes an ITF trace to file -->
```
"ITF"
```

## Deadlocks

<!-- !test in reports deadlock -->
```
output=$(quint verify ./testFixture/apalache/deadlock.qnt)
exit_code=$?
echo "$output" | sed -e 's/([0-9]*ms)/(duration)/'
exit $exit_code
```

<!-- !test exit 1 -->
<!-- !test err reports deadlock -->
```
error: reached a deadlock
```

<!-- !test out reports deadlock -->
```
An example execution:

[State 0] { n: 1 }

[State 1] { n: 2 }

[State 2] { n: 3 }

[State 3] { n: 4 }

[State 4] { n: 5 }

[violation] Found an issue (duration).
```

## Temporal properties

### Can verify with single temporal property

<!-- !test check can specify --temporal -->
```
quint verify --temporal eventuallyOne ./testFixture/apalache/temporalTest.qnt
```

### Can verify with two temporal properties

<!-- !test check can specify multiple temporal props -->
```
quint verify --temporal eventuallyOne,eventuallyFive ./testFixture/apalache/temporalTest.qnt
```

### Temporal violations are reported with traces

<!-- !test in prints a trace on temporal violation -->
```
output=$(quint verify --temporal eventuallyZero ./testFixture/apalache/temporalTest.qnt)
exit_code=$?
echo "$output" | egrep 'State|__InLoop:|n:'
exit $exit_code
```

<!-- !test exit 1 -->
<!-- !test err prints a trace on temporal violation -->
```
error: found a counterexample
```

<!-- !test out prints a trace on temporal violation -->
```
An example execution:
[State 0]
  __InLoop: false,
  __saved_n: 1,
  n: 1
[State 1]
  __InLoop: true,
  __saved_n: 1,
  n: 2
[State 2]
  __InLoop: true,
  __saved_n: 1,
  n: 3
[State 3]
  __InLoop: true,
  __saved_n: 1,
  n: 4
[State 4]
  __InLoop: true,
  __saved_n: 1,
  n: 5
[State 5]
  __InLoop: true,
  __saved_n: 1,
  n: 1
```
