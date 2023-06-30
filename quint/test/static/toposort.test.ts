import { describe, it } from 'mocha'
import { assert, expect } from 'chai'
import { fail } from 'assert'
import { Map, Set } from 'immutable'

import { toposort } from '../../src/static/toposort'

describe('topological sort', () => {
  it('sorts empty', () => {
    toposort(Map<number, Set<number>>(), [])
      .mapRight(s => assert(s.length === 0))
      .mapLeft(s => fail(`Expected an array, found: ${s}` ))
  })

  it('sorts a fork', () => {
    // 1 uses 3 and 2
    const edges: [number, Set<number>][] = [ [ 1, Set([2, 3]) ] ]
    toposort(Map(edges), [ 1, 3, 2 ])
      .mapRight(s => expect(s).to.eql([ 3, 2, 1 ]))
      .mapLeft(s => fail(`Expected an array, found: ${s}` ))
  })

  it('sorts two layers', () => {
    // 1 uses 3 and 2
    // 2 uses 4
    // 3 uses 5
    // 4 uses 5
    const edges: [number, Set<number>][] = [
      [ 1, Set([ 2, 3 ]) ],
      [ 2, Set([ 4 ]) ],
      [ 3, Set([ 5 ]) ],
      [ 4, Set([ 5 ]) ]
    ]
    toposort(Map(edges), [ 3, 2, 5, 4, 1 ])
      .mapRight(s => expect(s).to.eql([ 5, 3, 4, 2, 1 ]))
      .mapLeft(s => fail(`Expected an array, found: ${s}` ))
  })
})