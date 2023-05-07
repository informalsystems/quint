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
import {
  Doc, braces, brackets, docJoin, format, group, line, linebreak,
  nest, parens, richtext, text, textify
} from './prettierimp'

import { QuintEx } from './quintIr'
import { ExecutionFrame } from './runtime/trace'
import { zerog } from './idGenerator'

/**
 * An abstraction of a Console of bounded text width.
 */
export interface Window {
  width: number,
  out: (s: string) => void
}

// convert a Quint expression to a colored string, tuned for REPL
export function chalkQuintEx(ex: QuintEx): Doc {
  // a helper function to produce specific indentation
  const nary = (left: Doc, args: Doc[], right: Doc, padding: Doc = linebreak): Doc => {
    const as = group([
      nest('  ', [ padding, docJoin([ text(','), line() ], args) ]),
      padding
    ])
    return group([left, as, right])
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
                chalkQuintEx(k),
                richtext(chalk.gray, ' ->'),
                nest('  ', [line(), chalkQuintEx(v)])
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
                text(key.value),
                richtext(chalk.gray, ':'),
                nest('  ', [line(), value]),
              ]))
            }
          }
          return nary(text('{'), kvs, text('}'), line())
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

/**
 * Print an execution frame and its children recursively.
 * Since this function is printing a tree, we need precise text alignment.
 * Hence, we only use Doc to format the expressions, but not the entire tree.
 * 
 * @param window the window to print in
 * @param frame the frame to print
 * @param isLast the array that encods whether some of the frame's parents
 *               are the last ones among their siblings (think of a tree)
 */
export function
printExecutionFrameRec(window: Window,
    frame: ExecutionFrame, isLast: boolean[]): void {
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
  window.out(treeArt)

  // format the call with its arguments and place it right after the tree art
  const argsDoc =
    group(textify(['(', nest('  ', [linebreak, group(args)]), linebreak, ')']))
  const callDoc = group(
    nest(''.padStart(treeArt.length, ' '), [
      text(frame.app.opcode),
      group([ argsDoc, nest('  ', group([text(' =>'), line(), r])) ]),
    ]))

  window.out(format(window.width, treeArt.length, callDoc))
  window.out('\n')
  const n = frame.subframes.length
  // visualize the children
  frame.subframes.forEach((f, i) =>
    printExecutionFrameRec(window, f, isLast.concat([i === n - 1]))
  )
}

/**
 * Print a trace with chalk.
 */
export function printTrace(window: Window, states: QuintEx[],
                           frames: ExecutionFrame[]): void {
  const b = chalk.bold

  states.forEach((state, index) => {
    assert(state.kind === 'app'
           && state.opcode === 'Rec' && state.args.length % 2 === 0)

    if (index < frames.length) {
      // be lenient to broken input
      window.out(`[${b('Frame ' + index)}]\n`)
      printExecutionFrameRec(window, frames[index], [])
      window.out('\n')
    }

    const stateDoc: Doc = [
      group([brackets(richtext(b, `State ${index}`)), line()]),
      chalkQuintEx(state)
    ]
    window.out(format(window.width, 0, stateDoc))
    window.out('\n\n')
  })
}