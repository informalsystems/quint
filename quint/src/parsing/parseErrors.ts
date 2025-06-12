import { QuintError } from '../quintError'

export function duplicateRecordFieldError(id: bigint, fieldName: string): QuintError {
  return {
    code: 'QNT015',
    message: `Duplicate field name '${fieldName}' in record declaration`,
    reference: id,
    data: {},
  }
}

export function lowercaseTypeError(id: bigint, name: string): QuintError {
  return {
    code: 'QNT007',
    message: `Type names must start with an uppercase letter: ${name}`,
    reference: id,
    data: {},
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

export function undeclaredTypeParamsError(id: bigint, typeVars: string[]): QuintError {
  return {
    code: 'QNT014',
    message: `the type variables ${typeVars.join(', ')} are unbound.
E.g., in

   type T = List[a]

type variable 'a' is unbound. To fix it, write

   type T[a] = List[a]`,
    reference: id,
    data: {},
  }
}
