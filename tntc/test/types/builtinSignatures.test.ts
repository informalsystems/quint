import { describe, it } from 'mocha'
import { assert } from 'chai'
import { getSignatures } from '../../src/types/builtinSignatures'
import { parseTypeOrThrow } from '../../src/types/parser'
import { TypeScheme } from '../../src/types/base'
import { typeSchemeToString } from '../../src/types/printing'

describe('getSignatures', () => {
  const signatures = getSignatures()

  it('contains quantified signatures for seq', () => {
    const seqSignature = signatures.get('seq')!

    const expectedSignature = {
      type: parseTypeOrThrow('(a, a, a) => seq(a)'),
      variables: new Set(['a']),
    }

    const result = seqSignature(3)

    assert.deepEqual(result, expectedSignature, `expected ${typeSchemeToString(expectedSignature)}, got ${typeSchemeToString(result)}`)
  })

  it('contains quantified signatures for the tuple constructor', () => {
    const tupSignature = signatures.get('tup')!

    const expectedSignature: TypeScheme = {
      type: parseTypeOrThrow('(t0, t1, t2) => (t0, t1, t2)'),
      variables: new Set(['t0', 't1', 't2']),
    }

    const result = tupSignature(3)

    assert.deepEqual(result, expectedSignature, `expected ${typeSchemeToString(expectedSignature)}, got ${typeSchemeToString(result)}`)
  })

  it('contains quantified signatures for the record constructor', () => {
    const recSignature = signatures.get('rec')!

    const expectedSignature: TypeScheme = {
      type: parseTypeOrThrow('(n0, t0, n1, t1) => { n0: t0, n1: t1 }'),
      variables: new Set(['n0', 't0', 'n1', 't1']),
    }

    const result = recSignature(4)

    assert.deepEqual(result, expectedSignature, `expected ${typeSchemeToString(expectedSignature)}, got ${typeSchemeToString(result)}`)
  })

  it('contains quantified signatures for match', () => {
    const matchSignature = signatures.get('match')!

    const expectedSignature: TypeScheme = {
      type: parseTypeOrThrow('(a, str, (a) => b, str, (a) => b) => b'),
      variables: new Set(['a', 'b']),
    }

    const result = matchSignature(5)

    assert.deepEqual(result, expectedSignature, `expected ${typeSchemeToString(expectedSignature)}, got ${typeSchemeToString(result)}`)
  })

  it('contains quantified signatures for tuples', () => {
    const tuplesSignature = signatures.get('tuples')!

    const expectedSignature: TypeScheme = {
      type: parseTypeOrThrow('(set(t0), set(t1), set(t2)) => set((t0, t1, t2))'),
      variables: new Set(['t0', 't1', 't2']),
    }

    const result = tuplesSignature(3)

    assert.deepEqual(result, expectedSignature, `expected ${typeSchemeToString(expectedSignature)}, got ${typeSchemeToString(result)}`)
  })
})
