import { describe, it } from 'mocha'
import { assert } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import JSONbig from 'json-bigint'
import {
  compactSourceMap,
  parsePhase1fromText,
  parsePhase2sourceResolution,
  parsePhase3importAndNameResolution,
  parsePhase4toposort,
} from '../../src/parsing/quintParserFrontend'
import { lf } from 'eol'
import { right } from '@sweet-monads/either'
import { newIdGenerator } from '../../src/idGenerator'
import { collectIds } from '../util'
import { fileSourceResolver, stringSourceResolver } from '../../src/parsing/sourceResolver'
import { mkErrorMessage } from '../../src/cliCommands'
import { QuintError } from '../../src'

// read a Quint file from the test data directory
function readQuint(name: string): string {
  const p = resolve(__dirname, '../../testFixture', name + '.qnt')
  const content = readFileSync(p).toString('utf8')
  return lf(content)
}

// read the expected JSON outcome from the test data directory
function readJson(name: string): any {
  const p = resolve(__dirname, '../../testFixture', name + '.json')
  return JSONbig.parse(readFileSync(p).toString('utf8'))
}

// parse the text and return all parse errors (of phase 1)
function parseErrorsFrom(sourceName: string, code: string): QuintError[] {
  const gen = newIdGenerator()
  return parsePhase1fromText(gen, code, sourceName)
    .mapLeft(err => err.errors)
    .mapRight(_ => [] as QuintError[])
    .value
}

// read the Quint file and the expected JSON, parse and compare the results
function parseAndCompare(artifact: string): void {
  // read the expected result as JSON
  const expected = readJson(artifact)
  // We're not interested in testing the contens of the table here
  delete expected.table
  let outputToCompare

  // read the input from the data directory and parse it
  const gen = newIdGenerator()
  const basepath = resolve(__dirname, '../../testFixture')
  const resolver = fileSourceResolver((path: string) => {
    // replace the absolute path with a generic mocked path,
    // so the same fixtures work accross different setups
    return path.replace(basepath, 'mocked_path/testFixture')
  })
  const mainPath = resolver.lookupPath(basepath, `${artifact}.qnt`)
  const phase2Result = parsePhase1fromText(gen, readQuint(artifact), mainPath.toSourceName()).chain(res =>
    parsePhase2sourceResolution(gen, resolver, mainPath, res)
  )

  if (phase2Result.isLeft()) {
    // An error occurred at phase 2, check if it is the expected result
    phase2Result.mapLeft(
      err =>
        (outputToCompare = {
          stage: 'parsing',
          errors: err.errors.map(mkErrorMessage(err.sourceMap)),
          warnings: [],
        })
    )
  } else if (phase2Result.isRight()) {
    const { modules: modules2, sourceMap } = phase2Result.value
    const expectedIds = modules2.flatMap(m => collectIds(m)).sort()
    // Phase 1-2 succededed, check that the source map is correct
    assert.sameDeepMembers([...sourceMap.keys()].sort(), expectedIds, 'expected source map to contain all ids')

    const expectedSourceMap = readJson(`${artifact}.map`)
    const sourceMapResult = JSONbig.parse(JSONbig.stringify(compactSourceMap(sourceMap)))

    assert.deepEqual(sourceMapResult, expectedSourceMap, 'expected source maps to be equal')

    const phase4Result = parsePhase3importAndNameResolution(phase2Result.value).chain(phase3Data =>
      parsePhase4toposort(phase3Data)
    )

    if (phase4Result.isLeft()) {
      // An error occurred at phases 3-4, check if it is the expected result
      phase4Result.mapLeft(
        err =>
          (outputToCompare = {
            stage: 'parsing',
            errors: err.errors.map(mkErrorMessage(sourceMap)),
            warnings: [],
          })
      )
    } else {
      // All phases succeeded, check that the module is correclty output
      const modules4 = phase4Result.value.modules
      outputToCompare = { stage: 'parsing', warnings: [], modules: modules4 }
    }
  }

  // run it through stringify-parse to obtain the same json (due to bigints)
  const reparsedResult = JSONbig.parse(JSONbig.stringify(outputToCompare))
  // compare the JSON trees
  assert.deepEqual(reparsedResult, expected, 'expected --out data to be equal')
}

describe('parsing', () => {
  it('parses empty module', () => {
    const result = parsePhase1fromText(
      newIdGenerator(),
      readQuint('_0001emptyModule'),
      'mocked_path/testFixture/_0001emptyModule.qnt'
    )
    const module = { id: 1n, name: 'empty', declarations: [] }
    assert.deepEqual(
      result.map(r => r.modules[0]),
      right(module)
    )
  })

  it('parses SuperSpec', () => {
    const result = parsePhase1fromText(
      newIdGenerator(),
      readQuint('SuperSpec'),
      'mocked_path/testFixture/SuperSpec.qnt'
    )
    assert(result.isRight())
  })

  it('parses SuperSpec correctly', () => {
    parseAndCompare('SuperSpec')
  })

  it('parses out of order definitions', () => {
    parseAndCompare('_0099unorderedDefs')
  })

  it('parses sum types', () => {
    parseAndCompare('_1043sumTypeDecl')
  })

  it('parses match expressions', () => {
    parseAndCompare('_1044matchExpression')
  })
})

// instead of testing how errors are produced in json,
// we test the error messages only
describe('syntax errors', () => {
  it('unbalanced module definition', () => {
    const code = 'module empty {'
    const errors = parseErrorsFrom('module-unbalanced', code)
    assert.equal(errors.length, 1)
    // TODO: in case of unbalanced parentheses we could say something more useful
    assert.equal(errors[0].message, `unexpected end of file`)
    assert.equal(errors[0].code, 'QNT002')
  })

  it('something unexpected in a module definition', () => {
    const code = 'module empty { something }'
    const errors = parseErrorsFrom('module-unexpected', code)
    assert.equal(errors.length, 1)
    assert.equal(errors[0].message,
      `expected one of definition, const, var, import/export, assume`)
    assert.equal(errors[0].code, 'QNT000')
  })

  it('error in a constant definition', () => {
    const code = 'module err { const broken }'
    const errors = parseErrorsFrom('const broken', code)
    assert.equal(errors.length, 1)
    assert.equal(errors[0].message, 'expected a constant definition')
    assert.equal(errors[0].code, 'QNT015')
  })

  it('error on unexpected symbol after expression', () => {
    // syntax error on: p !! name
    const code = 'module unexpectedExpr { def access(p) = p !! name }'
    const errors = parseErrorsFrom('unexpectedExpr', code)
    assert.isAtLeast(errors.length, 1)
    assert.equal(errors[0].message, `unexpected character: '!'`)
    assert.equal(errors[0].code, 'QNT001')
  })

  it('error on unexpected token', () => {
    // # is an unexpected token
    const code = 'module unexpectedToken { def access(p) = { p # name } }'
    const errors = parseErrorsFrom('unexpectedToken', code)
    assert.isAtLeast(errors.length, 1)
    assert.equal(errors[0].message, `unexpected character: '#'`)
    assert.equal(errors[0].code, 'QNT001')
  })

  it('error on unexpected token "="', () => {
    // "=" is unexpected
    const code = 'module unexpectedEq { val errorHere = x = 1 }'
    const errors = parseErrorsFrom('unexpectedEq', code)
    assert.equal(errors.length, 1)
    assert.equal(errors[0].message, `unexpected '=', did you mean '=='?`)
    assert.equal(errors[0].code, 'QNT006')
  })

  it('error on hanging operator name', () => {
    // the keyword cardinality is hanging
    const code = 'module hangingCardinality { def one(S) = { S cardinality } }'
    const errors = parseErrorsFrom('hangingCardinality', code)
    assert.isAtLeast(errors.length, 1)
    assert.equal(errors[0].message, `expected one of definition, const, var, import/export, assume`)
    assert.equal(errors[0].code, 'QNT000')
  })

  it('error on double spread', () => {
    const code = `module spreadError {
  val rec = { a: 1, b: true }
  val errorRec = { ...rec, ...rec }
  }`
    const errors = parseErrorsFrom('spreadError', code)
    assert.equal(errors.length, 1)
    assert.equal(errors[0].message, '... may be used once in { ...record, <fields> }')
    assert.equal(errors[0].code, 'QNT012')
  })

  it('error on single quotes in import', () => {
    // we should use double quotes
    const code = `module singleQuotes {  import I.* from './_1025importeeWithError' }`
    const errors = parseErrorsFrom('singleQuotes', code)
    assert.isAtLeast(errors.length, 1)
    assert.equal(errors[0].message, `[QNT000] mismatched input ''' expecting STRING`)
    assert.equal(errors[0].code, 'QNT000')
  })
})

// Test the JSON error output.  Most of the tests here should migrate to the
// above test suite called 'syntax errors' or other test suites for the later
// phases.  It is sufficient to have a few tests that compare JSON. For the
// rest, we are interested in checking the error messages, not the JSON files.
describe('parse errors', () => {
  it('error in module unit', () => {
    parseAndCompare('_1002emptyWithError')
  })

  it('error on unresolved name', () => {
    parseAndCompare('_1010undefinedName')
  })

  it('error on unresolved scoped name', () => {
    parseAndCompare('_1011nameOutOfScope')
  })

  it('error on unresolved type alias', () => {
    parseAndCompare('_1012unknownType')
  })

  it('error on unresolved type alias inside let', () => {
    parseAndCompare('_1013unknownTypeLetIn')
  })

  it('error on conflicting names', () => {
    parseAndCompare('_1014conflictingNames')
  })

  it('parses single import from ', () => {
    parseAndCompare('_1021importee1')
  })

  it('parses import from transtively', () => {
    parseAndCompare('_1020importFrom')
  })

  it('errors on incorrect import', () => {
    parseAndCompare('_1023importFromUnresolved')
  })

  it('errors on cyclic imports', () => {
    parseAndCompare('_1026importCycleA')
  })

  it('a module with a constant', () => {
    parseAndCompare('_1030const')
  })

  it('an instance', () => {
    parseAndCompare('_1031instance')
  })

  it('docstrings', () => {
    parseAndCompare('_1032docstrings')
  })

  // The test below needs a fix, see:
  //
  // https://github.com/informalsystems/quint/issues/378
  //it('error on top-level nondet', () => {
  //  parseAndCompare('_1015noToplevelNondet')
  //})

  it('error on overriding values that are not constants', () => {
    parseAndCompare('_1016nonConstOverride')
  })

  it('error on cyclic definitions', () => {
    parseAndCompare('_0100cyclicDefs')
  })

  it('error on accidental recursion', () => {
    parseAndCompare('_0101noRecursion')
  })

  it('errors on invalid record fields', () => {
    parseAndCompare('_1042qualifiersInRecordsFieldsError')
  })
})
