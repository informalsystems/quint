import { QuintError } from '../../quint/src/quintError'

export function duplicateRecordFieldError(id: bigint, fieldName: string): QuintError {
  return {
    code: 'QNT015',
    message: `Duplicate field name '${fieldName}' in record declaration`,
    reference: id,
    data: {},
  }
} 