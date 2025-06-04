import { QuintError } from '../quintError'

export function duplicateRecordFieldError(id: bigint, fieldName: string): QuintError {
  return {
    code: 'QNT015',
    message: `Duplicate field name '${fieldName}' in record declaration`,
    reference: id,
    data: {},
  }
}

export function lowercaseTypeError(id: bigint, name: string, _parts: string[]): QuintError {
  return {
    code: 'QNT007',
    message: `Type name '${name}' must start with an uppercase letter`,
    reference: id,
    data: {},
  }
}

export function tooManySpreadsError(id: bigint): QuintError {
  return {
    code: 'QNT012',
    message: '\'...\' may be used once in \'{ ...record, <fields> }\'',
    reference: id,
    data: {},
  }
}

export function undeclaredTypeParamsError(id: bigint, params: string[]): QuintError {
  return {
    code: 'QNT014',
    message: `Type variables ${params.join(', ')} in a type declaration are not declared as parameters`,
    reference: id,
    data: {},
  }
} 