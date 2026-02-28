import { describe, it } from 'mocha'
import { assert } from 'chai'
import { addNamespacesToDef, LookupDefinition } from '../../src/names/base'

describe('addNamespacesToDef', () => {
  function makeDef(name: string, namespaces?: string[]): LookupDefinition {
    return {
      kind: 'def',
      name,
      namespaces,
      id: 1n,
      qualifier: 'def',
      expr: { kind: 'bool', value: true, id: 2n },
    }
  }

  it('adds a namespace to a definition without existing namespaces', () => {
    const def = makeDef('foo')
    const result = addNamespacesToDef(def, ['bar'])

    assert.deepEqual(result.namespaces, ['bar'])
  })

  it('adds multiple namespaces in order', () => {
    const def = makeDef('foo')
    const result = addNamespacesToDef(def, ['bar', 'baz'])

    assert.deepEqual(result.namespaces, ['bar', 'baz'])
  })

  it('does not add a namespace that already exists in the array', () => {
    const def = makeDef('foo', ['bar', 'baz'])
    const result = addNamespacesToDef(def, ['bar'])

    assert.deepEqual(result.namespaces, ['bar', 'baz'])
  })

  it('does not add a namespace that exists in the middle of the array', () => {
    const def = makeDef('foo', ['a', 'bar', 'c'])
    const result = addNamespacesToDef(def, ['bar'])

    assert.deepEqual(result.namespaces, ['a', 'bar', 'c'])
  })

  it('does not add a namespace that is a segment of the name', () => {
    const def = makeDef('bar::foo')
    const result = addNamespacesToDef(def, ['bar'])

    assert.deepEqual(result.namespaces, undefined)
  })

  it('does not add a namespace that is in the middle of the name', () => {
    const def = makeDef('a::bar::c')
    const result = addNamespacesToDef(def, ['bar'])

    assert.deepEqual(result.namespaces, undefined)
  })

  it('does not add a namespace that is at the end of the name', () => {
    const def = makeDef('a::b::bar')
    const result = addNamespacesToDef(def, ['bar'])

    assert.deepEqual(result.namespaces, undefined)
  })

  it('adds a namespace that is a substring but not a segment of the name', () => {
    const def = makeDef('foobar')
    const result = addNamespacesToDef(def, ['bar'])

    // 'bar' is a substring of 'foobar' but not a complete segment
    assert.deepEqual(result.namespaces, ['bar'])
  })

  it('skips empty namespaces', () => {
    const def = makeDef('foo')
    const result = addNamespacesToDef(def, ['', 'bar', ''])

    assert.deepEqual(result.namespaces, ['bar'])
  })

  it('handles mixed new and existing namespaces', () => {
    const def = makeDef('foo', ['existing'])
    const result = addNamespacesToDef(def, ['existing', 'new', 'existing'])

    // 'existing' should not be added, 'new' should be added once
    assert.deepEqual(result.namespaces, ['existing', 'new'])
  })

  it('does not modify the original definition', () => {
    const def = makeDef('foo', ['bar'])
    const result = addNamespacesToDef(def, ['baz'])

    assert.deepEqual(def.namespaces, ['bar'])
    assert.deepEqual(result.namespaces, ['bar', 'baz'])
  })
})
