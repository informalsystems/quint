// Unit tests for CLI procedures
import { describe, it } from 'mocha'
import { assert } from 'chai'
import { parse, stage, typecheck } from '../src/cliCommands'

const exModule = `
module exModule {
  const C: int
  val s: Set[int] = Set(1, 2)
}
`

const loaded  = {
  args: {},
  path: "mocked/path",
  sourceCode: exModule,
  stage: ('loading' as stage),
  warnings: [],
}

describe('the parse CLI routine', () =>
  it('succeeds with "parsed" status', async () => {
    parse(loaded).then(l => l.map(s => assert.equal(s.stage, 'parsing')))
  })
)

describe('the typecheck CLI routine', async () =>
  it('succeeds with "typechecked" status', () => {
    parse(loaded)
      .then((l) => l.asyncChain(typecheck))
      .then(t => t.map(s => assert.equal(s.stage, 'typechecking')))
  })
)
