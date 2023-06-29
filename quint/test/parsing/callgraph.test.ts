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

  function findDef(module: QuintModule, name: string): QuintDef {
    const d = module.defs.find(d =>
      (d.kind === 'def' || d.kind === 'const' || d.kind === 'var') && d.name === name
    )
    assert(d, `Definition ${name} not found`)
    return d
  }

  describe('operator definitions', () => {
    const defs = [
      'var N: int',
      'var w: int',
      'pure def plus(x, y) = x + y',
      'pure def double(x) = plus(x, x)',
      'pure def triple(x) = plus(x, double(x, x))',
      'val getW = w + N',
    ]

    const [module, table] = parseDefs(defs)
    const visitor = new CallGraphVisitor(table)
    walkModule(visitor, module)
    const graph = visitor.graph
    const plus = findDef(module, "plus")
    const double = findDef(module, "double")
    const triple = findDef(module, "triple")
    const w = findDef(module, "w")
    const N = findDef(module, "N")
    const getW = findDef(module, "getW")
    expect(graph.get(plus.id)?.size).to.equal(2)
    expect(graph.get(double.id)?.toArray()).to.include.members([plus.id])
    expect(graph.get(triple.id)?.toArray()).to.include.members([plus.id, double.id])
    expect(graph.get(getW.id)?.toArray()).to.include.members([w.id, N.id])
  })
})
