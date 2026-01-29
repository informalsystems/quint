import { describe, it } from 'mocha'
import { assert } from 'chai'
import { QuintRecordType, QuintSumType, QuintType } from '../../src/ir/quintTypes'
import { TypeScheme } from '../../src/types/base'
import { normalizeTypeSchemes } from '../../src/types/normalize'

describe('normalizeTypeSchemes', () => {
  it('syncs quantified variables with the scheme type', () => {
    const schemeWithExtraVars: TypeScheme = {
      type: { kind: 'int' },
      typeVariables: new Set(['a']),
      rowVariables: new Set(['r']),
    }

    const schemeWithMissingVars: TypeScheme = {
      type: { kind: 'var', name: 'a' },
      typeVariables: new Set(),
      rowVariables: new Set(),
    }

    const recWithRowVar: QuintRecordType = {
      kind: 'rec',
      fields: { kind: 'var', name: 'r' },
    }

    const schemeWithMissingRowVars: TypeScheme = {
      type: recWithRowVar as QuintType,
      typeVariables: new Set(),
      rowVariables: new Set(),
    }

    const types = new Map<bigint, TypeScheme>([
      [1n, schemeWithExtraVars],
      [2n, schemeWithMissingVars],
      [3n, schemeWithMissingRowVars],
    ])

    const normalized = normalizeTypeSchemes(types)

    const normalized1 = normalized.get(1n)!
    assert.sameMembers([...normalized1.typeVariables], [])
    assert.sameMembers([...normalized1.rowVariables], [])

    const normalized2 = normalized.get(2n)!
    assert.sameMembers([...normalized2.typeVariables], ['a'])
    assert.sameMembers([...normalized2.rowVariables], [])

    const normalized3 = normalized.get(3n)!
    assert.sameMembers([...normalized3.typeVariables], [])
    assert.sameMembers([...normalized3.rowVariables], ['r'])
  })

  // Regression test for issue #1492: Single-variant sum types could carry
  // stale row variables after type inference, causing Apalache to crash with
  // "Operator EXISTS3 cannot be applied to arguments of types (Id(Int), Set(Id(Int) | d), Bool)"
  it('removes stale row variables from single-variant sum types (issue #1492)', () => {
    // Simulates `type MyId = Id(int)` which after inference might still carry
    // a row variable 'd' in the scheme even though the sum type has no open row
    const singleVariantSumType: QuintSumType = {
      kind: 'sum',
      fields: {
        kind: 'row',
        fields: [{ fieldName: 'Id', fieldType: { kind: 'int' } }],
        other: { kind: 'empty' },
      },
    }

    // The scheme incorrectly has a stale row variable 'd' from inference
    const schemeWithStaleRowVar: TypeScheme = {
      type: singleVariantSumType as QuintType,
      typeVariables: new Set(),
      rowVariables: new Set(['d']), // This should be empty after normalization
    }

    // Also test a Set[MyId] type which is what triggers the EXISTS3 error
    const setOfSumType: QuintType = {
      kind: 'set',
      elem: singleVariantSumType as QuintType,
    }

    const schemeWithSetOfSum: TypeScheme = {
      type: setOfSumType,
      typeVariables: new Set(),
      rowVariables: new Set(['d']), // Stale row variable
    }

    const types = new Map<bigint, TypeScheme>([
      [100n, schemeWithStaleRowVar],
      [101n, schemeWithSetOfSum],
    ])

    const normalized = normalizeTypeSchemes(types)

    // After normalization, row variables should be empty since the sum type
    // has no open row (it ends with 'empty', not a row variable)
    const normalizedSum = normalized.get(100n)!
    assert.sameMembers([...normalizedSum.rowVariables], [], 'single-variant sum type should have no row variables')
    assert.sameMembers([...normalizedSum.typeVariables], [])

    const normalizedSetOfSum = normalized.get(101n)!
    assert.sameMembers(
      [...normalizedSetOfSum.rowVariables],
      [],
      'Set of single-variant sum type should have no row variables'
    )
    assert.sameMembers([...normalizedSetOfSum.typeVariables], [])
  })
})
