/*
 * A compiler to the runtime environment.
 *
 * Igor Konnov, 2022
 *
 * Copyright (c) Informal Systems 2021. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 */

import { parsePhase1, parsePhase2, ErrorMessage } from '../tntParserFrontend'
import { Computable, uncomputable, ExecError, ExecErrorHandler } from './runtime'
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
`module __Runtime {
   val __exprToCompile =
${text}
}`
  // parse the module text
  const parseRes = parsePhase1(moduleText, '<input>')
  let errors = []
  if (parseRes.kind === 'error') {
    errors = parseRes.messages
  } else {
    const resolutionRes = parsePhase2(parseRes.module, parseRes.sourceMap)
    if (resolutionRes.kind === 'error') {
      errors = resolutionRes.messages
    } else {
      const visitor = new CompilerVisitor()
      walkModule(visitor, parseRes.module)
      return visitor.findByName('__exprToCompile') ?? uncomputable
    }
  }

  // report error messages
  errors.forEach(function (err: ErrorMessage) {
    let loc
    if (err.locs.length > 0) {
      const start = err.locs[0].start
      loc = `${start.line - 2}:${start.col}`
    } else {
      loc = '<unknown>'
    }

    errorHandler({
      msg: err.explanation,
      sourceAndLoc: loc,
    })
  })

  return uncomputable
}
