/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2022. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Provide the representation of (possibly path-qualified) identifiers
 *
 * @author Shon Feder
 *
 * @module
 */

/**  Representaion of a (possibly path-qualified) identifier */
export class Identifier {
  // Internal representation of the full path of an identifier
  private parts: readonly string[]

  /** Construct a new Identifier
   *
   * E.g.,
   *
   * - `new Identifier('a', 'b', 'c').toString()` is `a::b::c`
   * - `new Identifier('a::b::c').toString()` is `a::b::c`
   * - in general `new Identifier(x).toString()` should always be `x`
   *
   * @param ...path the parts of a path of a nested identifier *or* a single
   * string-like representation of the path, with the path parts sepratued by
   * `::` */
  constructor (...path: readonly string[]) {
    if (path.length === 1 && path[0].includes('::')) {
      this.parts = path[0].split('::')
    } else {
      this.parts = path
    }
  }

  /** Representation of an Identifier as a string
   *
   * E.g., `new Identifier(a, b, c).toString() === "a::b::c"`
   *
   * @returns string */
  toString () {
    return this.parts.join('::')
  }

  ofString (s: string) {
    return
  }

  /** True when `this` identifier is structurally equal to the `other`
   *
   * @param other The other identifier to compare with */
  equals (other: Identifier): Boolean {
    return this.parts.length === other.parts.length && this.parts.every((e, i) => e === other.parts[i])
  }

  /** True when the identifier is just the wildcard `_`  */
  isWildCard (): Boolean {
    return this.parts.length === 1 && this.parts[0] === '_'
  }

  toChildOf (parent: string): Identifier {
    return new Identifier(...[parent].concat(this.parts))
  }
}
