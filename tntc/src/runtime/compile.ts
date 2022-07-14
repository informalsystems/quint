/*
 * A compiler to the runtime environment.
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2021. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { none } from '@sweet-monads/maybe'
import { parsePhase1, ErrorMessage } from '../tntParserFrontend'
import { Computable, ExecError, ExecErrorHandler } from './runtime'
import { CompilerVisitor } from './impl/compilerImpl'
import { walkModule } from '../IRVisitor'

/**
 * The default error handler, which simply prints the error on the console.
 */
const consoleHandler = function (err: ExecError) {
  console.error(`${err.sourceAndLoc}: ${err.msg}`)
}

/**
 * Parse a string that contains a TNT expression and compile it to an executable
 * object. This is a user-facing function. In case of an error, the error
 * messages are passed to an error handler and the function returns undefined.
 */
export function
compileExpr (text: String, errorHandler: ExecErrorHandler = consoleHandler): Computable {
  // embed expression text into a module definition
  const moduleText =
`module Runtime {
   val fun =
${text}
}`
  // parse the module text
  const parseResult = parsePhase1(moduleText, '<input>')
  if (parseResult.kind === 'error') {
    parseResult.messages.forEach(function (err: ErrorMessage) {
      const loc =
        (err.locs.length > 0)
          ? `${err.locs[0].start.line - 2}:${err.locs[0].start.col}`
          : '<unknown>'

      errorHandler({
        msg: err.explanation,
        sourceAndLoc: loc,
      })
    })

    // return none
    return {
      // the default implementation that returns undefined
      get: function () {
        return none<any>()
      },
    }
  } else {
    // TODO: call name resolution later

    const visitor = new CompilerVisitor()
    walkModule(visitor, parseResult.module)
    return visitor.topExpr()
  }
}
