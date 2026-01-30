import { basename } from 'path'

import { SourceMap, parseExpressionOrDeclaration } from './parsing/quintParserFrontend'
import { ErrorMessage } from './ErrorMessage'

import { Either, left, right } from '@sweet-monads/either'
import { QuintEx } from './ir/quintIr'
import { QuintError, quintErrorToString } from './quintError'
import { walkExpression } from './ir/IRVisitor'

import { CompiledStage, TypecheckedStage } from './cliCommands'
import { readFileSync } from 'fs'
import { ApalacheConfig } from './apalache'
import { cliErr } from './cliReporting'

export function mkErrorMessage(sourceMap: SourceMap): (_: QuintError) => ErrorMessage {
  return error => {
    const loc = error.reference ? sourceMap.get(error.reference) : undefined
    return {
      explanation: quintErrorToString(error),
      locs: loc ? [loc] : [],
    }
  }
}

export function toExpr(prev: TypecheckedStage, input: string): Either<QuintError, QuintEx> {
  const mainName = guessMainModule(prev)
  const parseResult = parseExpressionOrDeclaration(input, '<input>', prev.idGen, prev.sourceMap)
  if (parseResult.kind !== 'expr') {
    return left({ code: 'QNT501', message: `Expected ${input} to be a valid expression` })
  }

  prev.resolver.switchToModule(mainName)
  walkExpression(prev.resolver, parseResult.expr)
  if (prev.resolver.errors.length > 0) {
    return left(prev.resolver.errors[0])
  }

  return right(parseResult.expr)
}

export function guessMainModule(stage: TypecheckedStage): string {
  if (stage.args.main) {
    // the main module is specified via --main
    return stage.args.main
  }
  if (stage.defaultModuleName.isJust()) {
    // there is only one module in the source file, make it main
    return stage.defaultModuleName.unwrap()
  }
  // guess the name from the filename
  return basename(stage.args.input, '.qnt')
}

/**
 * Process invariants from arguments and return the combined invariant string
 * and individual invariants list.
 *
 * @param args The arguments containing invariant and invariants options.
 * @returns A tuple [invariantString, individualInvariants].
 */
export function getInvariants(args: { invariant?: string; invariants?: string[] }): [string, string[]] {
  let invariantsList: string[] = []

  // Add single invariant if specified and not 'true'
  if (args.invariant && args.invariant !== 'true') {
    invariantsList.push(args.invariant)
  }

  // Add multiple invariants if specified
  if (args.invariants && args.invariants.length > 0) {
    invariantsList = invariantsList.concat(args.invariants)
  }

  // Determine the combined invariant string and individual invariants
  const invariantString = invariantsList.length > 0 ? invariantsList.join(' and ') : 'true'

  return [invariantString, invariantsList]
}

export function addItfHeader(source: string, status: string, traceInJson: any): any {
  return {
    '#meta': {
      format: 'ITF',
      'format-description': 'https://apalache-mc.org/docs/adr/015adr-trace.html',
      source,
      status,
      description: 'Created by Quint on ' + new Date(),
      timestamp: Date.now(),
    },
    ...traceInJson,
  }
}

export function loadApalacheConfig(stage: CompiledStage, apalacheConfig: string | undefined): ApalacheConfig {
  try {
    if (apalacheConfig) {
      return JSON.parse(readFileSync(apalacheConfig, 'utf-8'))
    } else {
      return {}
    }
  } catch (err: any) {
    return cliErr(`failed to read Apalache config: ${err.message}`, { ...stage, errors: [], sourceCode: new Map() })
  }
}

/**
 * Checks if a regex pattern contains constructs that could cause catastrophic
 * backtracking (ReDoS - Regular Expression Denial of Service).
 *
 * This is a heuristic check that catches the most common dangerous patterns:
 * - Nested quantifiers: (a+)+ or (a*)*
 * - Overlapping quantifiers with alternatives: (a|a)+
 * - Multiple adjacent quantifiers: a++, a## (after expansion)
 *
 * @param pattern - The regex pattern to check
 * @returns true if the pattern appears potentially unsafe
 */
function isPotentiallyUnsafeRegex(pattern: string): boolean {
  // Check for nested quantifiers like (a+)+, (a*)+, (a+)*, (a?)+ etc.
  // These can cause exponential backtracking
  const nestedQuantifiers = /\([^)]*[+*][^)]*\)[+*?]|\([^)]*[+*?][^)]*\)\{/

  // Check for repeated capturing groups with quantifiers
  // e.g., (.+)+ or (.*)*
  const repeatedCapture = /\(\.[+*]\)[+*]/

  // Check for overlapping alternatives that could cause exponential matching
  // e.g., (a|a)+ or (\w|\d)+ where \w includes \d
  const overlappingAlternatives = /\([^)]*\|[^)]*\)[+*]/

  // Check for multiple consecutive quantifiers (after potential expansion)
  const consecutiveQuantifiers = /[+*?]{2,}/

  return (
    nestedQuantifiers.test(pattern) ||
    repeatedCapture.test(pattern) ||
    overlappingAlternatives.test(pattern) ||
    consecutiveQuantifiers.test(pattern)
  )
}

/**
 * Does a definition name match the expected test criteria.
 *
 * @param match - an optional regex pattern to match test names against
 * @param name - the name of a definition to match
 * @returns whether the name matches the pattern (if provided),
 *          or name ends with 'Test' (if no pattern provided)
 * @throws Error if the regex pattern is invalid or potentially unsafe (ReDoS risk)
 */
export function isMatchingTest(match: string | undefined, name: string): boolean {
  if (match) {
    // Security check: detect potentially dangerous regex patterns that could cause
    // catastrophic backtracking (ReDoS attacks)
    if (isPotentiallyUnsafeRegex(match)) {
      throw new Error(
        `Potentially unsafe regex pattern detected: "${match}". ` +
          `Patterns with nested quantifiers (e.g., "(a+)+") can cause performance issues. ` +
          `Please simplify your pattern or use a literal string match.`
      )
    }

    try {
      const regex = new RegExp(match)
      return regex.test(name)
    } catch (e) {
      throw new Error(`Invalid regex pattern "${match}": ${e instanceof Error ? e.message : String(e)}`)
    }
  } else {
    return name.endsWith('Test')
  }
}

// Derive the verbosity for simulation and verification routines
export function deriveVerbosity(args: { out: string | undefined; verbosity: number }): number {
  return args.out ? 0 : args.verbosity
}

export const PLACEHOLDERS = {
  test: '{test}',
  seq: '{seq}',
}

/**
 * Expand the output template with the name of the test and the index of the trace.
 *
 * Possible placeholders:
 * - {test} is replaced with the name of the test
 * - {seq} is replaced with the index of the trace
 *
 * If {seq} is not present and `options.autoAppend` is true,
 * the index is appended to the filename, before the extension.
 *
 * @param template the output template
 * @param name the name of the test
 * @param index the index of the trace
 * @param options An object of the form `{ autoAppend: boolean }`
 * @returns the expanded output template
 */
export function expandNamedOutputTemplate(
  template: string,
  name: string,
  index: number,
  options: { autoAppend: boolean }
): string {
  return expandOutputTemplate(template.replaceAll(PLACEHOLDERS.test, name), index, options)
}

/**
 * Expand the output template with the index of the trace.
 *
 * The {seq} placeholder is replaced with the index of the trace.
 *
 * If {seq} is not present and `options.autoAppend` is true,
 * the index is appended to the filename, before the extension.
 *
 * @param template the output template
 * @param index the index of the trace
 * @param options An object of the form `{ autoAppend: boolean }`
 * @returns the expanded output template
 */
export function expandOutputTemplate(template: string, index: number, options: { autoAppend: boolean }): string {
  if (template.includes(PLACEHOLDERS.seq)) {
    return template.replaceAll(PLACEHOLDERS.seq, index.toString())
  }

  if (options.autoAppend) {
    const parts = template.split('.')
    parts[0] += `${index}`
    return parts.join('.')
  }

  return template
}
