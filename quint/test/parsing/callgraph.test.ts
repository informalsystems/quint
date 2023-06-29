import { assert, expect } from 'chai'
import { describe } from 'mocha'
import { Set } from 'immutable'

import { newIdGenerator } from '../../src/idGenerator'
import {
  parsePhase1fromText, parsePhase2sourceResolution, parsePhase3importAndNameResolution
} from '../../src/parsing/quintParserFrontend'
import { SourceLookupPath, fileSourceResolver } from '../../src/parsing/sourceResolver'
import { LookupTable, QuintModule, QuintDef } from '../../src'
import { CallGraphVisitor } from '../../src/parsing/callgraph'
import { walkModule } from '../../src/IRVisitor'

describe('compute call graph', () => {
  // an auxilliary parse function
  function parseDefs(defs: string[]): [QuintModule, LookupTable] {
    const idGen = newIdGenerator()
    const fakePath: SourceLookupPath = {
      normalizedPath: 'fake_path',
      toSourceName: () => 'fake_path'
    }

    const code: string = `module main { ${defs.join('\n')} }`

    // we are calling parse phases directly instead of `parse`,
    // as the call graph will be computed at parse phase 4
    const resolver = fileSourceResolver()
    const parseResult = parsePhase1fromText(idGen, code, fakePath.normalizedPath)
      .chain(phase1Data => 
        parsePhase2sourceResolution(idGen, resolver, fakePath, phase1Data)
      )
      .chain(phase2Data => parsePhase3importAndNameResolution(phase2Data))

    if (parseResult.isLeft()) {
      assert.fail('Failed to parse a mock module')
    }
    const { modules, table } = parseResult.unwrap()
    return [modules[0], table]
  }

  function findDef(module: QuintModule, name: string): QuintDef | undefined {
    return module.defs.find(d => d.kind === 'def' && d.name === name)
  }

  describe('operator definitions', () => {
    const defs = [
      'pure def plus(x, y) = x + y',
      'pure def double(x) = plus(x, x)',
      'pure def triple(x) = plus(x, double(x, x))',
    ]

    const [module, table] = parseDefs(defs)
    const visitor = new CallGraphVisitor(table)
    walkModule(visitor, module)
    const graph = visitor.graph
    const plus = findDef(module, "plus")
    assert(plus)
    const double = findDef(module, "double")
    assert(double)
    const triple = findDef(module, "triple")
    assert(triple)
    expect(graph.get(plus.id)).to.equal(undefined)
    expect(graph.get(double.id)).to.equal(Set([plus.id]))
    expect(graph.get(triple.id)).to.equal(Set([plus.id, double.id]))
  })
})
