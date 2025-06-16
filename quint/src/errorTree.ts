/* ----------------------------------------------------------------------------------
 * Copyright 2022 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * A structure to track errors across nested function calls in a tree, along
 * with helpful build functions
 *
 * @author Gabriela Moreira
 *
 * @module
 */

/*
 * A tree of errors tracking the trace from the full given effect(s) to the part
 * where the error occurred
 */
export interface ErrorTree {
  location: string
  message: string
  children: ErrorTree[]
}

/*
 * Details for type application errors to provide clearer error messages
 */
export interface TypeApplicationErrorDetails {
  /* The name of the operator with a type application mismatch */
  operatorName?: string
  /* The expected type for the argument */
  expectedType?: string
  /* The actual type provided for the argument */
  actualType?: string
  /* The full operator signature */
  operatorSignature?: string
  /* The argument position (1-based) */
  argumentPosition?: number
}

/*
 * A simple disjunction over error representations to make it easier to chain
 * different operations and handle errors all at once (see buildErrorTree()).
 *
 * Strings can be errors since they can represent an error message that,
 * combined with a location in buildErrorTree() and an empty array of children,
 * can be transformed into an ErrorTree.
 */
export type Error = ErrorTree | ErrorTree[] | string

/*
 * Builds a node in the error tree with one or more errors as children
 *
 * @param location a description of where these errors occurred
 * @param errors one or more ErrorTree instances
 * @param typeAppDetails optional type application error details
 *
 * @returns an error tree with the given location and errors, avoiding duplication
 */
export function buildErrorTree(location: string, errors: Error): ErrorTree {
  if (typeof errors === 'string') {
    return buildErrorLeaf(location, errors)
  } else if (!Array.isArray(errors) && location === errors.location) {
    // Avoid redundant locations
    return errors
  }

  return { 
    location, 
    children: Array.isArray(errors) ? errors : [errors],
    message: ''
  }
}

/*
 * Builds a leaf with given attributes
 *
 * @param location the description of where the error occurred
 * @param message the description of the error
 * @param typeAppDetails optional type application error details
 *
 * @returns an ErrorTree with given attributes and no children
 */
export function buildErrorLeaf(location: string, message: string): ErrorTree {
  return {
    location,
    message,
    children: []
  }
}

export function buildErrorNode(location: string, message: string, children: ErrorTree[]): ErrorTree {
  return {
    location,
    message,
    children
  }
}

/**
 * Builds a leaf for type application mismatch errors with detailed information
 * 
 * @param location the description of where the error occurred
 * @param operatorName the name of the operator
 * @param operatorSignature the full type signature of the operator
 * @param expectedType the expected type
 * @param actualType the actual type
 * @param argumentPosition the position of the argument in the operator's parameter list (optional)
 * 
 * @returns an ErrorTree with type application mismatch information
 */
export function buildTypeApplicationMismatchLeaf(
  location: string,
  operatorName: string,
  operatorSignature: string,
  expectedType: string,
  actualType: string,
  argumentPosition?: number
): ErrorTree {
  const positionStr = argumentPosition ? ` as its ${argumentPosition}${getOrdinalSuffix(argumentPosition)} argument` : ''
  const message = `Operator \`${operatorName}\` expected \`${expectedType}\`${positionStr}, but the provided argument is a \`${actualType}\`.\n  Expected: ${expectedType}\n  Got: ${actualType}\nType signature for \`${operatorName}\` is ${operatorSignature}`
  return buildErrorLeaf(location, message)
}

/**
 * Formats the string representation of an error tree
 *
 * @param e the ErrorTree to be formatted
 *
 * @returns a multiline string with the pretty printed error tree
 */
export function errorTreeToString(e: ErrorTree): string {
  const childrenErrors = e.children.map(errorTreeToString)
  let out = childrenErrors.join('and\n')
  out += e.message ? e.message + '\n' : ''
  out += e.location + '\n'
  return out
}

/**
 * Helper function to get ordinal representation of a number
 */
function getOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Helper function to get ordinal suffix of a number
 */
function getOrdinalSuffix(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}
