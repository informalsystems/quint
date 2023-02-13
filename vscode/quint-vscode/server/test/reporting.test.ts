import { describe, it } from 'mocha'
import { assert } from 'chai'
import { Loc, QuintError } from '@informalsystems/quint'
import { assembleDiagnostic, diagnosticsFromErrors, findBestMatchingResult, findName, locToRange } from '../src/reporting'
import { Position } from 'vscode-languageserver'
import { parseOrThrow } from './util'

describe('diagnosticsFromErrorMap', () => {
  const errors: [bigint, QuintError][] = [
    [1n, { code: 'QNT000', message: 'Message', data: {} }],
  ]

  const sourceMap = new Map<bigint, Loc>([
    [1n, { start: { col: 1, index: 1, line: 1 }, end: { col: 1, index: 1, line: 1 }, source: 'mocked_path' }],
  ])

  it('assembles diagnosticts from error maps', () => {
    const diagnostics = diagnosticsFromErrors(errors, sourceMap)

    assert.sameDeepMembers(diagnostics, [
      {
        message: 'Message',
        range: {
          start: { character: 1, line: 1 },
          end: { character: 2, line: 1 },
        },
        severity: 1,
        code: 'QNT000',
        source: 'quint',
        data: {},
      },
    ])
  })
})

describe('assembleDiagnostic', () => {
  const loc: Loc = { start: { col: 1, index: 1, line: 1 }, end: { col: 1, index: 1, line: 1 }, source: 'mocked_path' }

  it('assembles a single diagnostict', () => {
    const diagnostic = assembleDiagnostic({ code: 'QNT000', message: 'Message', data: {} }, loc)

    assert.deepEqual(diagnostic, {
      message: 'Message',
      range: {
        start: { character: 1, line: 1 },
        end: { character: 2, line: 1 },
      },
      severity: 1,
      code: 'QNT000',
      source: 'quint',
      data: {},
    })
  })
})

describe('findBestMatchingResult', () => {
  const sourceMap = new Map<bigint, Loc>([
    [1n, { start: { col: 1, index: 1, line: 1 }, end: { col: 1, index: 1, line: 1 }, source: 'mocked_path' }],
    [2n, { start: { col: 1, index: 1, line: 1 }, end: { col: 10, index: 10, line: 1 }, source: 'mocked_path' }],
    [3n, { start: { col: 1, index: 11, line: 2 }, end: { col: 2, index: 12, line: 2 }, source: 'mocked_path' }],
  ])

  const results: [bigint, string][] = [
    [1n, 'result 1'],
    [2n, 'result 2'],
    [3n, 'result 3'],
  ]
  it('finds the result with best matching loc to the position - 1', () => {
    const position: Position = { line: 1, character: 1 }

    const [_loc, result] = findBestMatchingResult(sourceMap, results, position)

    assert.deepEqual(result, 'result 1')
  })

  it('finds the result with best matching loc to the position - 2', () => {
    const position: Position = { line: 1, character: 8 }

    const [_loc, result] = findBestMatchingResult(sourceMap, results, position)

    assert.deepEqual(result, 'result 2')
  })

  it('finds the result with best matching loc to the position - 3', () => {
    const position: Position = { line: 2, character: 1 }

    const [_loc, result] = findBestMatchingResult(sourceMap, results, position)

    assert.deepEqual(result, 'result 3')
  })

  describe('findName', () => {
    const [modules, sourceMap, _table] = parseOrThrow('module test { val foo = Nat.isFinite() }')
    const results: [Loc, bigint][] = [...sourceMap.entries()].map(([id, loc]) => [loc, id])

    it('finds the name when position is under a name', () => {
      const position: Position = { line: 0, character: 25 }

      const [_module, name, _id] = findName(modules, results, position) ?? [undefined, undefined]

      assert.deepEqual(name, 'Nat')
    })

    it('finds the name when position is under an application', () => {
      const position: Position = { line: 0, character: 29 }

      const [_module, name, _id] = findName(modules, results, position) ?? [undefined, undefined]

      assert.deepEqual(name, 'isFinite')
    })

    it('returns undefined when the position is not under a name', () => {
      const position: Position = { line: 1, character: 8 }

      const result = findName(modules, results, position)

      assert.deepEqual(result, undefined)
    })
  })

  describe('locToRange', () => {
    it('converts a loc to a range', () => {
      const loc: Loc = {
        source: 'mocked_path',
        start: { col: 1, index: 1, line: 1 },
        end: { col: 5, index: 1, line: 1 },
      }

      const range = locToRange(loc)

      assert.deepEqual(range, {
        start: { character: 1, line: 1 },
        end: { character: 6, line: 1 },
      })
    })
  })
})
