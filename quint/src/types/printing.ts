import { rowToString, typeToString } from '../IRprinting'
import { newTable } from '../lookupTable'
import { Constraint, TypeScheme } from './base'
import { Substitutions, applySubstitution, compose } from './substitutions'

/**
 * Formats the string representation of a constraint
 *
 * @param c the Constraint to be formatted
 *
 * @returns a string with the formatted constraint
 */
export function constraintToString(c: Constraint): string {
  switch (c.kind) {
    case 'eq': return `${typeToString(c.types[0])} ~ ${typeToString(c.types[1])}`
    case 'conjunction': return c.constraints.map(constraintToString).join(' /\\ ')
    case 'empty': return 'true'
  }
}

/**
 * Formats the string representation of a type scheme
 *
 * @param t the type scheme to be formatted
 *
 * @returns a string with the formatted type scheme
 */
export function typeSchemeToString(t: TypeScheme): string {
  const typeNames = Array.from(t.typeVariables)
  const rowNames = Array.from(t.rowVariables)
  const vars: string[] = []

  const typeSubs: Substitutions = typeNames.map((name, i) => {
    vars.push(`t${i}`)
    return { kind: 'type', name, value: { kind: 'var', name: `t${i}` } }
  })
  
  const rowSubs: Substitutions = rowNames.map((name, i) => {
    vars.push(`r${i}`)
    return { kind: 'row', name: name, value: { kind: 'var', name: `r${i}` } }
  })

  const subs = compose(newTable({}), typeSubs, rowSubs)
  const type = applySubstitution(newTable({}), subs, t.type)

  const varsString = vars.length > 0 ? `∀ ${vars.join(', ')} . ` : ''
  return `${varsString}${typeToString(type)}`
}

/**
 * Formats the string representation of substitutions
 *
 * @param subs the Substitution to be formatted
 *
 * @returns a string with the pretty printed substitution
 */
export function substitutionsToString(subs: Substitutions): string {
  const subsString = subs.map(s => {
    if (s.kind === 'type') {
      return `${s.name} |-> ${typeToString(s.value)}`
    } else {
      return `${s.name} |-> ${rowToString(s.value)}`
    }
  })

  return `[ ${subsString.join(', ')} ]`
}
