import { parseTypeOrThrow } from './parser'
import { typeNames } from '../tntTypes'
import { Signature, TypeScheme } from './base'

export function getSignatures (): Map<string, Signature> {
  return new Map<string, Signature>(fixedAritySignatures.concat(multipleAritySignatures))
}

const literals = [
  { name: 'Nat', type: 'Set[int]' },
  { name: 'Int', type: 'Set[int]' },
  { name: 'Bool', type: 'Set[bool]' },
]

const booleanOperators = [
  { name: 'eq', type: '(a, a) => bool' },
  { name: 'neq', type: '(a, a) => bool' },
  { name: 'iff', type: '(bool, bool) => bool' },
  { name: 'implies', type: '(bool, bool) => bool' },
  { name: 'not', type: '(bool) => bool' },
]

const setOperators = [
  { name: 'guess', type: '(Set[a], (a) => bool) => bool' },
  { name: 'exists', type: '(Set[a], (a) => bool) => bool' },
  { name: 'forall', type: '(Set[a], (a) => bool) => bool' },
  { name: 'in', type: '(a, Set[a]) => bool' },
  { name: 'contains', type: '(Set[a], a) => bool' },
  { name: 'notin', type: '(a, Set[a]) => bool' },
  { name: 'union', type: '(Set[a], Set[a]) => Set[a]' },
  { name: 'intersect', type: '(Set[a], Set[a]) => Set[a]' },
  { name: 'exclude', type: '(Set[a], Set[a]) => Set[a]' },
  { name: 'subseteq', type: '(Set[a], Set[a]) => bool' },
  { name: 'filter', type: '(Set[a], (a) => bool) => Set[a]' },
  { name: 'map', type: '(Set[a], (a) => b) => Set[b]' },
  { name: 'fold', type: '(Set[a], b, (b, a) => b) => b' },
  { name: 'powerset', type: '(Set[a]) => Set[Set[a]]' },
  { name: 'flatten', type: '(Set[Set[a]]) => Set[a]' },
  { name: 'allLists', type: '(Set[a]) => List[a]' },
  { name: 'choose_some', type: '(Set[a]) => a' },
  { name: 'isFinite', type: '(Set[a]) => bool' },
  { name: 'size', type: '(Set[a]) => int' },
]

const mapOperators = [
  { name: 'get', type: '(a -> b, a) => b' },
  { name: 'keys', type: '(a -> b) => Set[a]' },
  { name: 'mapBy', type: '(Set[a], (a) => b) => a -> b' },
  { name: 'setToMap', type: '(Set[(a, b)]) => (a -> b)' },
  { name: 'setOfMaps', type: '(Set[a], Set[b]) => Set[a -> b]' },
  { name: 'set', type: '(a -> b, a, b) => a -> b' },
  { name: 'setBy', type: '(a -> b, a, (b) => b) => a -> b' },
  { name: 'put', type: '(a -> b, a, b) => a -> b' },
]

// FIXME: Make record and tuple signatures more strict once row types are implemented
const recordOperators = [
  { name: 'field', type: '(a, str) => b' },
  { name: 'fieldNames', type: '(a) => Set[str]' },
  { name: 'with', type: '(a, str, b) => a' },
]

const tupleOperators = [
  { name: 'item', type: '(a, int) => b' },
]

const listOperators = [
  { name: 'append', type: '(List[a], a) => List[a]' },
  { name: 'concat', type: '(List[a], List[a]) => List[a]' },
  { name: 'head', type: '(List[a]) => a' },
  { name: 'tail', type: '(List[a]) => List[a]' },
  { name: 'length', type: '(List[a]) => int' },
  { name: 'nth', type: '(List[a], int) => a' },
  { name: 'indices', type: '(List[a]) => Set[int]' },
  { name: 'replaceAt', type: '(List[a], int, a) => List[a]' },
  { name: 'slice', type: '(List[a], int, int) => List[a]' },
  { name: 'range', type: '(int, int) => List[int]' },
  { name: 'select', type: '(List[a], (a) => bool) => List[a]' },
  { name: 'foldl', type: '(List[a], b, (b, a) => b) => b' },
  { name: 'foldr', type: '(List[a], b, (a, b) => b) => b' },
]

const integerOperators = [
  { name: 'iadd', type: '(int, int) => int' },
  { name: 'isub', type: '(int, int) => int' },
  { name: 'imul', type: '(int, int) => int' },
  { name: 'idiv', type: '(int, int) => int' },
  { name: 'imod', type: '(int, int) => int' },
  { name: 'ipow', type: '(int, int) => int' },
  { name: 'ilt', type: '(int, int) => bool' },
  { name: 'igt', type: '(int, int) => bool' },
  { name: 'ilte', type: '(int, int) => bool' },
  { name: 'igte', type: '(int, int) => bool' },
  { name: 'to', type: '(int, int) => Set[int]' },
  { name: 'iuminus', type: '(int) => int' },
]
const temporalOperators = [
  { name: 'always', type: '(bool) => bool' },
  { name: 'eventually', type: '(bool) => bool' },
  { name: 'next', type: '(a) => a' },
  { name: 'stutter', type: '(bool, a) => bool' },
  { name: 'nostutter', type: '(bool, a) => bool' },
  { name: 'enabled', type: '(bool) => bool' },
  { name: 'weakFair', type: '(bool, a) => bool' },
  { name: 'strongFair', type: '(bool, a) => bool' },
]

const otherOperators = [
  { name: 'assign', type: '(a, a) => bool' },
  { name: 'ite', type: '(bool, a, a) => a' },
  // Should we do this? https://github.com/informalsystems/tnt/discussions/109
]

function uniformArgsWithResult (argsType: string, resultType: string): Signature {
  return (arity: number) => {
    const args = Array.from(Array(arity).keys()).map(i => argsType)
    return parseAndQuantify(`(${args.join(', ')}) => ${resultType}`)
  }
}

// TODO: check arity conditions, see issue https://github.com/informalsystems/tnt/issues/169
const multipleAritySignatures: [string, Signature][] = [
  ['List', uniformArgsWithResult('a', 'List[a]')],
  ['Set', uniformArgsWithResult('a', 'Set[a]')],
  ['Map', uniformArgsWithResult('(a, b)', 'a -> b')],
  ['and', uniformArgsWithResult('bool', 'bool')],
  ['actionAll', uniformArgsWithResult('bool', 'bool')],
  ['or', uniformArgsWithResult('bool', 'bool')],
  ['actionAny', uniformArgsWithResult('bool', 'bool')],
  ['Tup', (arity: number) => {
    const args = Array.from(Array(arity).keys()).map(i => `t${i}`).join(', ')
    return parseAndQuantify(`(${args}) => (${args})`)
  }],
  ['Rec', (arity: number) => {
    const indexes = Array.from(Array(arity / 2).keys())
    const args = indexes.map(i => `n${i}, t${i}`).join(', ')
    const result = indexes.map(i => `n${i}: t${i}`).join(', ')
    return parseAndQuantify(`(${args}) => { ${result} }`)
  }],
  ['match', (arity: number) => {
    const args = Array.from(Array((arity - 1) / 2).keys()).map(r => 'str, (a) => b')
    return parseAndQuantify(`(a, ${args.join(', ')}) => b`)
  }],
  ['tuples', (arity: number) => {
    const ts = Array.from(Array(arity).keys()).map(i => `t${i}`)
    const args = ts.map(t => `Set[${t}]`)
    const tupleType = `(${ts.join(', ')})`
    return parseAndQuantify(`(${args.join(', ')}) => Set[${tupleType}]`)
  }],
]

const fixedAritySignatures: [string, Signature][] = [
  literals,
  booleanOperators,
  setOperators,
  mapOperators,
  recordOperators,
  tupleOperators,
  listOperators,
  integerOperators,
  temporalOperators,
  otherOperators,
].flat().map(sig => [sig.name, (_: number) => parseAndQuantify(sig.type)])

function parseAndQuantify (typeString: string): TypeScheme {
  const t = parseTypeOrThrow(typeString)
  return {
    type: t,
    variables: typeNames(t),
  }
}
