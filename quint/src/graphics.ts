/*
 * A collection of CLI functions that implement color output and pseudo-graphics.
 *
 * Igor Konnov, 2023
 *
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import chalk from 'chalk'
import { strict as assert } from 'assert'
import { range } from 'lodash'
import {
  IDoc, braces, brackets, enclose, group, intersperse,
  line, lineBreak, nest, parens, punctuate, softBreak, softLine
} from 'prettier-printer'

import { QuintEx } from './quintIr'
import { ExecutionFrame } from './runtime/trace'
import { zerog } from './idGenerator'

// convert a Quint expression to a colored string, tuned for REPL
export function chalkQuintEx(ex: QuintEx): IDoc {
  // a helper function to produce specific indentation
  const join = (docPair: [IDoc, IDoc], args: IDoc[]): IDoc => {
    const as = group([
      nest(2, [lineBreak, punctuate([',', line], args)]),
      lineBreak
    ])
    return enclose(docPair, as)
  }

  switch (ex.kind) {
    case 'bool':
      return chalk.yellow(`${ex.value}`)

    case 'int':
      return chalk.yellow(`${ex.value}`)

    case 'str':
      return chalk.green(`"${ex.value}"`)

    case 'app':
      switch (ex.opcode) {
        case 'Set':
          return group([chalk.green('Set'), join(parens, ex.args.map(chalkQuintEx))])

        case 'Map': {
          const ps = ex.args.map(tup => {
            if (tup.kind === 'app' &&
                   tup.opcode === 'Tup' && tup.args.length === 2) {
              const [k, v] = tup.args
              return group([chalkQuintEx(k), ' ->', nest(2, [line, chalkQuintEx(v)])])
            } else {
              return '<expected-pair>'
            }
          })
          return group([chalk.green('Map'), join(parens, ps)])
        }

        case 'Tup':
          return join(parens, ex.args.map(chalkQuintEx))

        case 'List': {
          return join(brackets, ex.args.map(chalkQuintEx))
        }

        case 'Rec': {
          const kvs = []
          for (let i = 0; i < ex.args.length / 2; i++) {
            const key = ex.args[2 * i]
            if (key && key.kind === 'str') {
              const value = chalkQuintEx(ex.args[2 * i + 1])
              kvs.push(group([chalk.green(key.value), ':', line, value]))
            }
          }
          return join([ ['{', softLine], [softLine, '}'] ], kvs)
        }

        default:
          // instead of throwing, show it in red
          return chalk.red(`unsupported operator: ${ex.opcode}(...)`)
      }

    case 'lambda': {
      const params = enclose(parens, punctuate([',', line], ex.params.map(p => p.name)))
      return enclose(braces, group([params, '=>', '...']))
    }

    default:
      return chalk.red(`unsupported operator: ${ex.kind}`)
  }
}

export function
printExecutionFrameRec(frame: ExecutionFrame, isLast: boolean[]): IDoc {
  // convert the arguments and the result to strings
  const args =
    punctuate(',', frame.args.map(a => chalkQuintEx(a.toQuintEx(zerog))))
  const r =
    frame.result.isNone()
      ? 'none'
      : chalkQuintEx(frame.result.value.toQuintEx(zerog))
  const depth = isLast.length
  // generate the tree ASCII graphics for this frame
  let treeArt = isLast.map((il, i) =>
    (i < depth - 1)
      // continue the ancestor's branch, unless it's the last one
      ? (il ? '   ' : '│  ')
      // close or close & continue the leaf branch,
      // depending on whether this frame is the last one
      : (il ? '└─ ' : '├─ ')
  ).join('')
  let doc =
    group([treeArt, frame.app.opcode, group([enclose(parens, args), '=>', r]), line])
  const n = frame.subframes.length
  // visualize the children
  const children = frame.subframes.map((f, i) =>
    printExecutionFrameRec(f, isLast.concat([i === n - 1]))
  )
  return intersperse(line, [doc].concat(children))
}

/**
 * Print a trace with chalk.
 */
export function printTrace(states: QuintEx[],
                           frames: ExecutionFrame[]): IDoc {
  const colon = chalk.gray(':')
  const stateDocs = states.map((state, index) => {
    assert(state.kind === 'app'
           && state.opcode === 'Rec' && state.args.length % 2 === 0)

    let docs: IDoc[] = []
    if (index < frames.length) {
      // be lenient to broken input
      docs.push([
        enclose(brackets, ['Frame', index.toString()]),
        nest(1, [line, printExecutionFrameRec(frames[index], [])]),
        line
      ])
    }

    docs.push(enclose(brackets, ['State', index.toString()]))
    const pairs = range(0, Math.trunc(state.args.length / 2))
      .map(i => {
        const key = state.args[2 * i]
        assert(key.kind === 'str')
        const valueText = chalkQuintEx(state.args[2 * i + 1])
        return [group([key.value, colon, softBreak, valueText]), line]
      })
    docs.push([punctuate(line, pairs), line])
    docs.push(['------', line])

    return docs.flat(1)
  })

  return intersperse(line, stateDocs)
}

