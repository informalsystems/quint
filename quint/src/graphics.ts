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
  Doc, braces, brackets, docJoin, group, line, linebreak,
  nest, parens, richtext, text, textify
} from './prettierimp'

import { QuintEx } from './quintIr'
import { ExecutionFrame } from './runtime/trace'
import { zerog } from './idGenerator'

// convert a Quint expression to a colored string, tuned for REPL
export function chalkQuintEx(ex: QuintEx): Doc {
  // a helper function to produce specific indentation
  const nary = (left: Doc, args: Doc[], right: Doc): Doc => {
    const as = group([
      nest('  ', [linebreak, docJoin([text(','), line()], args)]),
      linebreak
    ])
    return [left, as, right]
  }

  switch (ex.kind) {
    case 'bool':
      return richtext(chalk.yellow, ex.value.toString())

    case 'int':
      return richtext(chalk.yellow, ex.value.toString())

    case 'str':
      return richtext(chalk.green, `"${ex.value}"`)

    case 'app':
      switch (ex.opcode) {
        case 'Set':
          return group([
            richtext(chalk.green, 'Set'),
            nary(text('('), ex.args.map(chalkQuintEx), text(')'))
          ])

        case 'Map': {
          const ps: Doc[] = ex.args.map(tup => {
            if (tup.kind === 'app' &&
                   tup.opcode === 'Tup' && tup.args.length === 2) {
              const [k, v] = tup.args
              return group([
                chalkQuintEx(k), line(), text('->'), group(nest('  ', [line(), chalkQuintEx(v)]))
              ])
            } else {
              return text('<expected-pair>')
            }
          })
          return group([richtext(chalk.green, 'Map'), nary(text('('), ps, text(')'))])
        }

        case 'Tup':
          return nary(text('('), ex.args.map(chalkQuintEx), text(')'))

        case 'List': {
          return nary(text('['), ex.args.map(chalkQuintEx), text(']'))
        }

        case 'Rec': {
          const kvs = []
          for (let i = 0; i < ex.args.length / 2; i++) {
            const key = ex.args[2 * i]
            if (key && key.kind === 'str') {
              const value = chalkQuintEx(ex.args[2 * i + 1])
              kvs.push(group([
                richtext(chalk.green, key.value), text(':'), line(), value
              ]))
            }
          }
          return nary([text('{'), line()], kvs, [line(), text('}')] )
        }

        default:
          // instead of throwing, show it in red
          return richtext(chalk.red, `unsupported operator: ${ex.opcode}(...)`)
      }

    case 'lambda': {
      const params = 
        parens(docJoin([text(','), line()], ex.params.map(p => text(p.name))))

      return braces(group(textify([ params, line(), '=>', line(), '...' ])))
    }

    default:
      return richtext(chalk.red, `unsupported operator: ${ex.kind}`)
  }
}

export function
printExecutionFrameRec(frame: ExecutionFrame, isLast: boolean[]): Doc {
  // convert the arguments and the result to strings
  const args = docJoin(
    [ text(','), line() ],
    frame.args.map(a => chalkQuintEx(a.toQuintEx(zerog)))
  )
  const r =
    frame.result.isNone()
      ? text('none')
      : chalkQuintEx(frame.result.value.toQuintEx(zerog))
  const depth = isLast.length
  // generate the tree ASCII graphics for this frame
  let treeArt = isLast.map((il, i) =>
    (i < depth - 1)
      // continue the ancestor's branch, unless it's the last one
      ? il ? '   ' : '│  '
      // close or close & continue the leaf branch,
      // depending on whether this frame is the last one
      : il ? '└─ ' : '├─ '
  ).join('')
  let doc = group([
    text(treeArt), text(frame.app.opcode),
    group([ parens(args), nest('  ', [line(), text('=>'), line(), r]) ]),
    line(),
  ])
  const n = frame.subframes.length
  // visualize the children
  const children = frame.subframes.map((f, i) =>
    printExecutionFrameRec(f, isLast.concat([i === n - 1]))
  )
  return docJoin(line(), [doc].concat(children))
}

/**
 * Print a trace with chalk.
 */
export function printTrace(states: QuintEx[],
                           frames: ExecutionFrame[]): Doc {
  const colon = richtext(chalk.gray, ':')
  const stateDocs = states.map((state, index) => {
    assert(state.kind === 'app'
           && state.opcode === 'Rec' && state.args.length % 2 === 0)

    let docs: Doc[] = []
    if (index < frames.length) {
      // be lenient to broken input
      docs.push([
        brackets(textify([ 'Frame', line(), index.toString()])),
        group(nest('  ', [line(), printExecutionFrameRec(frames[index], [])])),
        line(),
      ])
    }

    docs.push([text('State'), text(index.toString())])
    const pairs = range(0, Math.trunc(state.args.length / 2))
      .map(i => {
        const key = state.args[2 * i]
        assert(key.kind === 'str')
        const valueText = chalkQuintEx(state.args[2 * i + 1])
        return [group([text(key.value), colon, linebreak, valueText]), line()]
      })
    docs.push([docJoin(line(), pairs), line()])
    docs.push([text('------'), line()])

    return docs.flat(1)
  })

  return docJoin(line(), stateDocs)
}

