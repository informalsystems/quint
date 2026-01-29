import { QuintType, typeNames } from '../ir/quintTypes'
import { TypeScheme } from './base'

function setsEqual<T>(left: Set<T>, right: Set<T>): boolean {
  if (left.size !== right.size) {
    return false
  }
  for (const v of left) {
    if (!right.has(v)) {
      return false
    }
  }
  return true
}

function normalizeScheme(scheme: TypeScheme): TypeScheme {
  const names = typeNames(scheme.type as QuintType)
  if (setsEqual(scheme.typeVariables, names.typeVariables) && setsEqual(scheme.rowVariables, names.rowVariables)) {
    return scheme
  }
  return { ...scheme, typeVariables: names.typeVariables, rowVariables: names.rowVariables }
}

export function normalizeTypeSchemes(types: Map<bigint, TypeScheme>): Map<bigint, TypeScheme> {
  return new Map([...types.entries()].map(([id, scheme]) => [id, normalizeScheme(scheme)]))
}
