import { QuintError } from '../quintError'

export function lowercaseTypeError(id: bigint, name: string, prefix: string[]): QuintError {
  const original = [...prefix, name].join('::')
  const newName = name[0].toUpperCase() + name.slice(1)
  const replacement = [...prefix, newName].join('::')

  return {
    code: 'QNT007',
    message: 'type names must start with an uppercase letter',
    reference: id,
    data: {
      fix: {
        kind: 'replace',
        original: `type ${original}`,
        replacement: `type ${replacement}`,
      },
    },
  }
}

export function tooManySpreadsError(id: bigint): QuintError {
  return {
    code: 'QNT012',
    message: '... may be used once in { ...record, <fields> }',
    reference: id,
    data: {},
  }
}

export function undeclaredTypeParamsError(id: bigint, unboundTypeVariables: string[]): QuintError {
  return {
    code: 'QNT014',
    message: `the type variables ${unboundTypeVariables.join(', ')} are unbound.
E.g., in

   type T = List[a]

type variable 'a' is unbound. To fix it, write

   type T[a] = List[a]`,
    reference: id,
    data: {},
  }
}

export function duplicateRecordFieldError(id: bigint, fieldName: string): QuintError {
  return {
    code: 'QNT015',
    message: `Duplicate field name '${fieldName}' in record declaration`,
    reference: id,
    data: {},
  }
}
