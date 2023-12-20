import { describe, it } from 'mocha'
import { assert } from 'chai'
import { TypeInferenceResult, TypeInferrer } from '../../src/types/inferrer'
import { typeSchemeToString } from '../../src/types/printing'
import { errorTreeToString } from '../../src/errorTree'
import { parseMockedModule } from '../util'

// Utility used to print update `stringType` values to make
// updating the expected values in the following tests less
// painful.
function _printUpdatedStringTypes(stringTypes: (string | bigint)[][]) {
  console.log('[')
  stringTypes.forEach(([n, t]) => console.log(`[${n}n, '${t}'],`))
  console.log(']')
}

describe('inferTypes', () => {
  function inferTypesForModules(text: string): TypeInferenceResult {
    const { modules, table } = parseMockedModule(text)

    const inferrer = new TypeInferrer(table)
    return inferrer.inferTypes(modules.flatMap(m => m.declarations))
  }

  function inferTypesForDefs(defs: string[]): TypeInferenceResult {
    const text = `module wrapper { ${defs.join('\n')} }`
    return inferTypesForModules(text)
  }

  it('infers types for basic expressions', () => {
    const defs = ['def a = 1 + 2', 'def b(p, q) = p + q', 'val c = val m = 2 { m }', 'def d(S) = S.map(p => p + 10)']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    // _printUpdatedStringTypes(stringTypes)
    assert.sameDeepMembers(stringTypes, [
      [1n, 'int'],
      [2n, 'int'],
      [3n, 'int'],
      [4n, 'int'],
      [5n, 'int'],
      [6n, 'int'],
      [7n, 'int'],
      [8n, 'int'],
      [9n, 'int'],
      [10n, '(int, int) => int'],
      [11n, '(int, int) => int'],
      [12n, 'int'],
      [13n, 'int'],
      [14n, 'int'],
      [15n, 'int'],
      [16n, 'int'],
      [17n, 'Set[int]'],
      [18n, 'Set[int]'],
      [19n, 'int'],
      [20n, 'int'],
      [21n, 'int'],
      [22n, 'int'],
      [23n, '(int) => int'],
      [24n, 'Set[int]'],
      [25n, '(Set[int]) => Set[int]'],
      [26n, '(Set[int]) => Set[int]'],
    ])
  })

  it('infers types for high-order operators', () => {
    const defs = ['def a(f, p) = f(p)', 'def b(g, q) = g(q) + g(not(q))']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    // _printUpdatedStringTypes(stringTypes)
    assert.sameDeepMembers(stringTypes, [
      [7n, '(bool) => int'],
      [8n, 'bool'],
      [9n, 'bool'],
      [10n, 'int'],
      [11n, 'bool'],
      [12n, 'bool'],
      [13n, 'int'],
      [14n, 'int'],
      [15n, '((bool) => int, bool) => int'],
      [16n, '((bool) => int, bool) => int'],
      [1n, '∀ t0, t1 . (t0) => t1'],
      [2n, '∀ t0 . t0'],
      [3n, '∀ t0 . t0'],
      [4n, '∀ t0 . t0'],
      [5n, '∀ t0, t1 . ((t0) => t1, t0) => t1'],
      [6n, '∀ t0, t1 . ((t0) => t1, t0) => t1'],
    ])
  })

  it('infers types for records', () => {
    const defs = [
      'var x: { f1: int, f2: bool }',
      'val m = Set(x, { f1: 1, f2: true })',
      'def e(p) = x.with("f1", p.f1)',
      'val a = e({ f1: 2 }).fieldNames()',
    ]

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    // _printUpdatedStringTypes(stringTypes)
    assert.sameDeepMembers(stringTypes, [
      [4n, '{ f1: int, f2: bool }'],
      [5n, '{ f1: int, f2: bool }'],
      [7n, 'str'],
      [6n, 'int'],
      [9n, 'str'],
      [8n, 'bool'],
      [10n, '{ f1: int, f2: bool }'],
      [11n, 'Set[{ f1: int, f2: bool }]'],
      [12n, 'Set[{ f1: int, f2: bool }]'],
      [13n, '∀ r0 . { f1: int | r0 }'],
      [14n, '{ f1: int, f2: bool }'],
      [15n, 'str'],
      [16n, '∀ r0 . { f1: int | r0 }'],
      [17n, 'str'],
      [18n, 'int'],
      [19n, '{ f1: int, f2: bool }'],
      [20n, '∀ r0 . ({ f1: int | r0 }) => { f1: int, f2: bool }'],
      [21n, '∀ r0 . ({ f1: int | r0 }) => { f1: int, f2: bool }'],
      [23n, 'str'],
      [22n, 'int'],
      [24n, '{ f1: int }'],
      [25n, '{ f1: int, f2: bool }'],
      [26n, 'Set[str]'],
      [27n, 'Set[str]'],
    ])
  })

  it('infers types for tuples', () => {
    const defs = ['def e(p, q) = (p._1, q._2)']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    // _printUpdatedStringTypes(stringTypes)
    assert.sameDeepMembers(stringTypes, [
      [1n, '∀ t0, r0 . (t0 | r0)'],
      [2n, '∀ t0, t1, r0 . (t0, t1 | r0)'],
      [3n, '∀ t0, r0 . (t0 | r0)'],
      [4n, 'int'],
      [5n, '∀ t0 . t0'],
      [6n, '∀ t0, t1, r0 . (t0, t1 | r0)'],
      [7n, 'int'],
      [8n, '∀ t0 . t0'],
      [9n, '∀ t0, t1 . (t0, t1)'],
      [10n, '∀ t0, t1, t2, r0, r1 . ((t0 | r0), (t1, t2 | r1)) => (t0, t2)'],
      [11n, '∀ t0, t1, t2, r0, r1 . ((t0 | r0), (t1, t2 | r1)) => (t0, t2)'],
    ])
  })

  it('infers types for variants', () => {
    const defs = ['type T = A(int) | B', 'val a = variant("A", 3)']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    assert.sameDeepMembers(stringTypes, [
      [14n, 'str'],
      [15n, 'int'],
      [16n, '(A(int) | B({}))'],
      [17n, '(A(int) | B({}))'],
      [10n, 'str'],
      [11n, '{}'],
      [12n, '(B({}) | A(int))'],
      [13n, '(B({}) | A(int))'],
      [5n, 'int'],
      [4n, 'str'],
      [6n, 'int'],
      [7n, '(A(int) | B({}))'],
      [8n, '(int) => (A(int) | B({}))'],
      [9n, '(int) => (A(int) | B({}))'],
    ])
  })

  it('infers types for different sum type declarations with the same label but different values', () => {
    // See https://github.com/informalsystems/quint/issues/1275
    const text = `
module A {
  type T1 = | A(int)
}

module B {
  type T2 = | A(bool)
}
`

    const [errors, _] = inferTypesForModules(text)
    assert.deepEqual([...errors.entries()], [])
  })

  it('infers types for match expression', () => {
    const defs = ['type T = A(int) | B', 'val a = variant("A", 3)', 'val nine = match a { A(n) => n * n | B => 9 }']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    assert.sameDeepMembers(stringTypes, [
      [14n, 'str'],
      [15n, 'int'],
      [16n, '(A(int) | B({}))'],
      [17n, '(A(int) | B({}))'],
      [10n, 'str'],
      [11n, '{}'],
      [12n, '(B({}) | A(int))'],
      [13n, '(B({}) | A(int))'],
      [18n, '(A(int) | B({}))'],
      [24n, 'str'],
      [26n, 'int'],
      [19n, 'int'],
      [20n, 'int'],
      [21n, 'int'],
      [25n, '(int) => int'],
      [27n, 'str'],
      [29n, '{}'],
      [22n, 'int'],
      [28n, '({}) => int'],
      [23n, 'int'],
      [30n, 'int'],
      [5n, 'int'],
      [4n, 'str'],
      [6n, 'int'],
      [7n, '(A(int) | B({}))'],
      [8n, '(int) => (A(int) | B({}))'],
      [9n, '(int) => (A(int) | B({}))'],
    ])
  })

  it('infers types for match expression with wildcard case', () => {
    const defs = ['type T = A(int) | B', 'val nine : int = match B { _ => 9 }']

    const [errors, _] = inferTypesForDefs(defs)
    assert.isEmpty(errors)
  })

  it('reports a type error for match expressions that return inconsitent types in cases', () => {
    const defs = [
      'type T = A(int) | B',
      'val a = variant("A", 3)',
      'val nine = match a { A(n) => n * n | B => "not an int" }',
    ]

    const [errors, _] = inferTypesForDefs(defs)
    assert.isNotEmpty(errors)
    assert.match([...errors.values()].map(errorTreeToString)[0], RegExp("Couldn't unify int and str"))
  })

  it('reports a type error for match expressions with multiple wildcard cases', () => {
    const defs = [
      'type T = A(int) | B | C',
      'val a = variant("A", 3)',
      'val nine = match B { A(n) => "OK" | _ => "first wilcard" | _ => "second, invalid wildcard" }',
    ]

    const [errors, _] = inferTypesForDefs(defs)
    assert.isNotEmpty(errors)
    assert.match([...errors.values()].map(errorTreeToString)[0], RegExp('Invalid wildcard match'))
  })

  it('reports a type error for match expressions with non-final wildcard case', () => {
    const defs = [
      'type T = A(int) | B | C',
      'val a = variant("A", 3)',
      'val nine = match B { A(n) => "OK" | _ => "invalid, non-final wilcard" | C => "OK" }',
    ]

    const [errors, _] = inferTypesForDefs(defs)
    assert.isNotEmpty(errors)
    assert.match([...errors.values()].map(errorTreeToString)[0], RegExp('Invalid wildcard match'))
  })

  it('reports a type error for match expressions on non-variant expressions', () => {
    const defs = [
      'val notAVariant = "this is not a variant"',
      'val invalid = match notAVariant { A(n) => n * n | B => 9 }',
    ]

    const [errors, _] = inferTypesForDefs(defs)
    assert.isNotEmpty(errors)
    assert.match([...errors.values()].map(errorTreeToString)[0], RegExp(`Couldn't unify str and sum`))
  })

  it('reports a type error for matchVariant operator with non-label arguments', () => {
    const defs = ['type T = A(int) | B', 'val a = variant("A", 3)', 'val nine = matchVariant(a, 3, (_ => 9))']

    const [errors, _] = inferTypesForDefs(defs)
    assert.isNotEmpty(errors)
    assert.match(
      [...errors.values()].map(errorTreeToString)[0],
      RegExp('Match variant name must be a string literal but it is a int: 3')
    )
  })

  it('reports a type error for a non-applicable case', () => {
    const defs = [
      'type T = A(int) | B',
      'val a = variant("A", 3)',
      'val nonExhaustive = match a { A(x) => x * x | B => 9 | NotAVariant => 9 }',
    ]

    const [errors, _] = inferTypesForDefs(defs)
    assert.isNotEmpty(errors)
    assert.match([...errors.values()].map(errorTreeToString)[0], RegExp(`Couldn't unify empty and row`))
  })

  it('reports a type error for non-exhaustive match', () => {
    const defs = [
      'type T = A(int) | B',
      'val a = variant("A", 3)',
      'val nonExhaustive = match a { NoMatch(x) => x * x }',
    ]

    const [errors, _] = inferTypesForDefs(defs)
    assert.isNotEmpty(errors)
    assert.match([...errors.values()].map(errorTreeToString)[0], RegExp('Incompatible tails for rows'))
  })

  it('keeps track of free variables in nested scopes (#966)', () => {
    const defs = ['def f(a) = a == "x"', 'def g(b) = val nested = (1,2) { f(b) }']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    assert.includeDeepMembers(stringTypes, [[15n, '(str) => bool']])
  })

  it('considers annotations', () => {
    const defs = ['def e(p): (int) => int = p']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    // _printUpdatedStringTypes(stringTypes)
    assert.sameDeepMembers(stringTypes, [
      [1n, 'int'],
      [5n, 'int'],
      [6n, '(int) => int'],
      [7n, '(int) => int'],
    ])
  })

  it('keeps track of free names properly (#693)', () => {
    const defs = ['val b(x: int -> str): int = val c = x.keys() { 1 }']

    const [errors, types] = inferTypesForDefs(defs)
    assert.isEmpty(errors, `Should find no errors, found: ${[...errors.values()].map(errorTreeToString)}`)

    const stringTypes = Array.from(types.entries()).map(([id, type]) => [id, typeSchemeToString(type)])
    // _printUpdatedStringTypes(stringTypes)
    assert.sameDeepMembers(stringTypes, [
      [1n, '(int -> str)'],
      [6n, '(int -> str)'],
      [7n, 'Set[int]'],
      [8n, 'Set[int]'],
      [9n, 'int'],
      [10n, 'int'],
      [12n, '((int -> str)) => int'],
      [13n, '((int -> str)) => int'],
    ])
  })

  it('checks annotations', () => {
    const defs = ['def e(p): (t) => t = p + 1']

    const [errors] = inferTypesForDefs(defs)
    assert.sameDeepMembers(
      [...errors.entries()],
      [
        [
          4n,
          {
            location: 'Checking type annotation (t) => t',
            children: [
              {
                location: 'Checking variable t',
                message: 'Type annotation is too general: t should be int',
                children: [],
              },
            ],
          },
        ],
      ]
    )
  })

  it('fails when types are not unifiable', () => {
    const defs = ['def a = 1.map(p => p + 10)']

    const [errors] = inferTypesForDefs(defs)

    assert.sameDeepMembers(
      [...errors.entries()],
      [
        [
          7n,
          {
            location: 'Trying to unify (Set[_t1], (_t1) => _t2) => Set[_t2] and (int, (int) => int) => _t3',
            children: [
              {
                location: 'Trying to unify Set[_t1] and int',
                message: "Couldn't unify set and int",
                children: [],
              },
            ],
          },
        ],
      ]
    )
  })
})
