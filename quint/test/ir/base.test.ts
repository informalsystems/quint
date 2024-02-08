import { describe, it } from 'mocha'
import { assert } from 'chai'
import { foldType, mapType } from '../../src/ir/base'
import { parseType } from '../../src/types/parser'
import { QuintType, typeToString } from '../../src'

const typeOfStr = (s: string) => parseType(s).unwrap()

// A complex, nested type used in all the tests
const type = typeOfStr('{} => {a: int, b: str, c: List[str], d: (int, Set[List[bool]])}')

describe('foldType', () => {
  it('can collect an array of all the sub-terms of a type', () => {
    const f = (acc: QuintType[], q: QuintType) => acc.concat(q)
    const actual = foldType(f, [], type).map(typeToString)
    const expected: string[] = [
      '{}',
      'int',
      'str',
      'str',
      'List[str]',
      'int',
      'bool',
      'List[bool]',
      'Set[List[bool]]',
      '(int, Set[List[bool]])',
      '{ a: int, b: str, c: List[str], d: (int, Set[List[bool]]) }',
      '({}) => { a: int, b: str, c: List[str], d: (int, Set[List[bool]]) }',
    ]
    assert.deepEqual(actual, expected)
  })

  it('is a left-biased, depth-first traversal, matching the way IDs are generated during parsing', () => {
    // We demonstrate this by showing that the IDs of all the sub-terms we collect
    // are in sequential order
    const f = (acc: number[], q: QuintType) => acc.concat(Number(q.id!))
    const actual = foldType(f, [], type)
    const sortedIDs = [...actual].sort((a, b) => a - b) // JS is cursed https://stackoverflow.com/a/69250874/1187277
    assert.deepEqual(actual, sortedIDs)
  })
})

describe('mapType', () => {
  it('transforms all sub-terms of a type', () => {
    const numberOfSubTerms = foldType((acc: QuintType[], q: QuintType) => acc.concat(q), [], type).length
    const typeWithAllIdsMappedTo0 = mapType((t: QuintType): QuintType => ({ ...t, id: 0n }), type)
    const allMappedIds = foldType((acc: bigint[], q: QuintType) => acc.concat(q.id!), [], typeWithAllIdsMappedTo0)

    assert.deepEqual(numberOfSubTerms, allMappedIds.length, 'mapType should preserve all IDs')
    assert.deepEqual(
      allMappedIds.reduce((a, b) => a + b),
      0n,
      'mapType should set all IDs to zero'
    )
  })
})
