/* ----------------------------------------------------------------------------------
 * Copyright 2022 Informal Systems
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for license information.
 * --------------------------------------------------------------------------------- */

import assert, { fail } from 'assert'
import { ConcreteRow, QuintType, Row } from './quintTypes'

/**
 * Core utilities for manipulating the Quint IR
 *
 * @author Shon Feder
 *
 * @module
 */

export function foldRow<T>(f: (acc: T, x: Row) => T, init: T, r: Row): T {
  switch (r.kind) {
    case 'var':
    case 'empty':
      return f(init, r)

    case 'row':
      const otherAcc = foldRow(f, init, r.other)
      return f(otherAcc, r)
  }
}

export function mapRow(f: (x: Row) => Row, row: Row): Row {
  const map = (r: Row) => {
    switch (r.kind) {
      case 'var':
      case 'empty':
        return f(r)

      case 'row':
        const other = foldRow(f, r.other, r.other)
        return f({ ...r, other })
    }
  }

  return foldRow(map, row, row)
}

export function rowTypes(row: Row): QuintType[] {
  const f = (acc: QuintType[], r: Row) => acc.concat(r.kind === 'row' ? r.fields.map(f => f.fieldType) : [])
  return foldRow(f, [], row)
}

// TODO
// This is a "right fold" thru the IR tree, meaning we do a left-biased, breadth-first traversal
// This will visit the nodes in the same order as the parser takes when it constructs them.
export function foldType<T>(f: (acc: T, x: QuintType) => T, init: T, q: QuintType): T {
  switch (q.kind) {
    case 'bool':
    case 'int':
    case 'str':
    case 'const':
    case 'var': {
      return f(init, q)
    }

    case 'set':
    case 'list': {
      const elemAcc = foldType(f, init, q.elem)
      return f(elemAcc, q)
    }

    case 'fun': {
      const argAcc = foldType(f, init, q.arg)
      const resAcc = foldType(f, argAcc, q.res)
      return f(resAcc, q)
    }

    case 'oper': {
      const argsAcc = q.args.reduce((acc, arg) => foldType(f, acc, arg), init)
      const resAcc = foldType(f, argsAcc, q.res)
      return f(resAcc, q)
    }

    case 'tup':
    case 'rec':
    case 'sum': {
      const rowAcc = rowTypes(q.fields).reduce((acc, arg) => foldType(f, acc, arg), init)
      return f(rowAcc, q)
    }

    case 'abs':
    case 'app':
      fail('abs and app are not yet finalized or fully supported')
  }
}

const mapConcreteRowTypes = (f: (_: QuintType) => QuintType, r: ConcreteRow): ConcreteRow => ({
  ...r,
  fields: r.fields.map(field => ({ ...field, fieldType: mapType(f, field.fieldType) })),
})

export function mapType(f: (_: QuintType) => QuintType, q: QuintType): QuintType {
  switch (q.kind) {
    case 'bool':
    case 'int':
    case 'str':
    case 'const':
    case 'var': {
      return f(q)
    }

    case 'set':
    case 'list': {
      return f({ ...q, elem: mapType(f, q.elem) })
    }

    case 'fun': {
      return f({ ...q, arg: mapType(f, q.arg), res: mapType(f, q.res) })
    }

    case 'oper': {
      return f({ ...q, args: q.args.map(a => mapType(f, a)), res: mapType(f, q.res) })
    }

    case 'tup':
    case 'rec': {
      const fields = q.fields.kind === 'row' ? mapConcreteRowTypes(f, q.fields) : q.fields
      return f({ ...q, fields })
    }

    case 'sum': {
      // We know that this map can only take concrete rows to concrete rows,
      // so we cheat the types here.
      return f({ ...q, fields: mapConcreteRowTypes(f, q.fields) })
    }

    case 'abs':
    case 'app':
      fail('abs and app are not yet finalized or fully supported')
  }
}
