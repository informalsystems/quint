#!/usr/bin/env node

/**
 * Command-line interface for tntc.
 *
 * See the description at:
 * https://github.com/informalsystems/tnt/blob/main/doc/tntc.md
 *
 * @author Igor Konnov, Gabriela Moreira, Informal Systems, 2021-2022
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import JSONbig from 'json-bigint'
import lineColumn from 'line-column'
import { resolve } from 'path'
import { cwd } from 'process'

import { formatError } from './errorReporter'
import { ErrorMessage, Loc, compactSourceMap, parsePhase1, parsePhase2 } from './tntParserFrontend'

import yargs from 'yargs/yargs'
import { inferEffects } from './effects/inferrer'
import { checkModes } from './effects/modeChecker'
import { errorTreeToString } from './errorTree'

import { Either, left, right } from '@sweet-monads/either'
import { Arguments } from 'yargs'
import { Effect } from './effects/base'
import { effectToString } from './effects/printing'
import { tntRepl } from './repl'
import { TntModule } from './tntIr'
import { TypeScheme } from './types/base'
import { inferTypes } from './types/inferrer'
import { typeSchemeToString } from './types/printing'
import { LookupTableByModule } from './lookupTable'

export type status = 'loaded' | 'parsed' | 'typechecked'

/** The data from a ProcedureStatus that may be output to --out */
interface OutputStatus {
  status: status,
  warnings: any[], // TODO it doesn't look like this is being used for anything. Should we remove it?
  module?: TntModule,
  types?: Map<bigint, TypeScheme>,
  effects?: Map<bigint, Effect>,
}


interface ProcedureStatus extends OutputStatus {
  args: any,
}

interface LoadedStatus extends ProcedureStatus {
  sourceCode: string
}

interface ParsedStatus extends LoadedStatus {
  module: TntModule,
  sourceMap: Map<bigint, Loc>,
  table: LookupTableByModule,
}

interface TypecheckedStatus extends ParsedStatus {
  types: Map<bigint, TypeScheme>,
  effects: Map<bigint, Effect>,
}

/** Load a file into a string
 *
 * @param args the CLI arguments parsed by yargs */
export function load(args: any): Either<string, LoadedStatus> {
  if (existsSync(args.input)) {
    try {
      const sourceCode = readFileSync(args.input, 'utf8')
      return right({
        args,
        sourceCode,
        status: 'loaded',
        warnings: [],
      })
    } catch (err: unknown) {
      return left(`file ${args.input} could not be opened due to ${err}`)
    }
  } else {
    return left(`file ${args.input} does not exist`)
  }
}


/**
 * Parse a TNT specification.
 *
 * @param loaded the procedure status produced by `load`
 */
export function parse(loaded: LoadedStatus): Either<String, ParsedStatus> {
  const { args, sourceCode } = loaded
  const path = resolve(cwd(), args.input)
  return parsePhase1(sourceCode, path)
    .mapLeft(errs => {
      reportParseError(args, sourceCode, errs)
      return "parsing failed in phase 1"
    })
    .chain(phase1Data => {
      if (args.sourceMap) {
        // Write source map to the specified file
        writeToJson(args.sourceMap, compactSourceMap(phase1Data.sourceMap))
      }
      return parsePhase2(phase1Data)
        .mapLeft(errs => {
          reportParseError(args, sourceCode, errs)
          return "parsing failed in phase 2"
        })
    }).map(phase2Data => {
      // TODO move into helper combinator
      if (args.out) {
        // write the parsed IR to the output file
        writeToJson(args.out, {
          status: 'parsed',
          warnings: [],
          module: phase2Data.module,
        })
      }
      return { ...loaded, ...phase2Data, status: 'parsed' }
    })
}

function reportParseError(argv: any, sourceCode: string, errors: ErrorMessage[]) {
  if (argv.out) {
    // write the errors to the output file
    writeToJson(argv.out, errors)
  } else {
    const finder = lineColumn(sourceCode)
    // write the errors to stderr
    errors.forEach((m) => console.error(formatError(sourceCode, finder, m)))
  }
}


/**
 * Check types and effects of a TNT specification.
 *
 * @param parsed the procedure status produced by `parse`
 */
// TODO Should return Phase2 parsing data + typing data
export function typecheck(parsed: ParsedStatus): Either<String, TypecheckedStatus> {
  const { sourceCode, table, module, sourceMap } = parsed
  const finder = lineColumn(sourceCode)
  const definitionsTable = table
  const [typeErrors, types] = inferTypes(module, definitionsTable)
  types.forEach((value, key) => console.log(`${key}: ${typeSchemeToString(value)}`))

  typeErrors.forEach((value, key) => {
    const loc = sourceMap.get(key)!
    const message: ErrorMessage = {
      explanation: errorTreeToString(value),
      locs: [loc],
    }

    console.error(formatError(sourceCode, finder, message))
  })

  const [errors, effects] = inferEffects(definitionsTable, module)
  effects.forEach((value, key) => console.log(`${key}: ${effectToString(value)}`))

  errors.forEach((value, key) => {
    const loc = sourceMap.get(key)!
    const message: ErrorMessage = {
      explanation: errorTreeToString(value),
      locs: [loc],
    }

    console.error(formatError(sourceCode, finder, message))
  })

  return checkModes(module, effects)
    .map(e => e.forEach((value, key) => console.log(`${key}: ${value}`)))
    .mapLeft(e => {
      e.forEach((value, key) => {
        const loc = sourceMap.get(key)!
        const message: ErrorMessage = {
          explanation: errorTreeToString(value),
          locs: [loc],
        }
        console.error(formatError(sourceCode, finder, message))
      })

      return "typechecking failed"
    })
    .map(_ => { return { ...parsed, types, effects, status: 'typechecked' } })
}

/**
 * Run REPL.
 *
 * @param _argv parameters as provided by yargs
 */
function runRepl(_argv: any) {
  tntRepl(process.stdin, process.stdout)
}

/** Write the OutputStatus of the procedureStatus as JSON, if --out is set */
function withJsonToOutput(procedureStatus: ProcedureStatus): Either<String, OutputStatus> {
  // Separate the arg data from the output status data
  const { args, ...outputData } = procedureStatus
  // TODO test/handle case of writing to non-existent file
  if (args.out) writeToJson(args.out, outputData);
  return right(outputData)
}

/**
 * Write json to a file.
 *
 * @param filename name of the file to write to
 * @param json is an object tree to write
 */
function writeToJson(filename: string, json: any) {
  const path = resolve(cwd(), filename)
  writeFileSync(path, JSONbig.stringify(json))
}

function handleCmd<A>(cmd: (_: Arguments) => Either<String, A>): (_: Arguments) => void {
  return (args) => {
    cmd(args)
      .mapLeft(msg => { console.error(`error: ${msg}`); process.exit(1) })
      .mapRight(_ => process.exit(0))
  }
}

// construct parsing commands with yargs
const parseCmd = {
  command: 'parse <input>',
  desc: 'parse a TNT specification',
  builder: (yargs: any) =>
    yargs
      .option('out', {
        desc: 'output file',
        type: 'string',
      })
      .option('source-map', {
        desc: 'name of the source map',
        type: 'string',
      }),
  handler: handleCmd(
    args =>
      load(args)
        .chain(parse)
        .chain(withJsonToOutput)
  ),
}

// construct typecheck commands with yargs
const typecheckCmd = {
  command: 'typecheck <input>',
  desc: 'check types (TBD) and effects of a TNT specification',
  builder: (yargs: any) =>
    yargs
      .option('out', {
        desc: 'output file',
        type: 'string',
      }),
  handler: handleCmd(
    args =>
      load(args)
        .chain(parse)
        .chain(typecheck)
        .chain(withJsonToOutput)
  ),
}

// construct repl commands with yargs
const replCmd = {
  command: 'repl',
  desc: 'run REPL',
  builder: (yargs: any) =>
    yargs,
  handler: runRepl,
}

// parse the command-line arguments and execute the handlers
yargs(process.argv.slice(2))
  .command(parseCmd)
  .command(typecheckCmd)
  .command(replCmd)
  .demandCommand(1)
  .strict()
  .parse()
