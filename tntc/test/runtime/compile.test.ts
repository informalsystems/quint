import { describe, it } from 'mocha'
import { assert } from 'chai'
import { Maybe } from '@sweet-monads/maybe'
import { compileExpr } from '../../src/runtime/compile'

function assertDefined<T>(m: Maybe<T>) {
  assert(m.isJust(), 'undefined value')
}

describe('compiling specs to runtime values', () => {
  describe('compileExpr', () => {
    it('computes positive integer literals', () => {
      assertDefined(
        compileExpr('15')
          .eval()
          .map(v => assert(v === 15n))
      )
    })

    it('computes negative integer literals', () => {
      assertDefined(
        compileExpr('-15')
          .eval()
          .map(v => assert(v === -15n))
      )
    })

    it('computes Boolean literals', () => {
      assertDefined(
        compileExpr('false')
          .eval()
          .map(v => assert(v === false))
      )
      assertDefined(
        compileExpr('true')
          .eval()
          .map(v => assert(v === true))
      )
    })

    it('computes addition', () => {
      assertDefined(
        compileExpr('2 + 3')
          .eval()
          .map(v => assert(v === 5n))
      )
    })

    it('computes subtraction', () => {
      assertDefined(
        compileExpr('2 - 3')
          .eval()
          .map(v => assert(v === -1n))
      )
    })

    it('computes negation', () => {
      assertDefined(
        compileExpr('-(2 + 3)')
          .eval()
          .map(v => assert(v === -5n))
      )
    })

    it('computes multiplication', () => {
      assertDefined(
        compileExpr('2 * 3')
          .eval()
          .map(v => assert(v === 6n))
      )
    })

    it('computes division', () => {
      assertDefined(
        compileExpr('7 / 2')
          .eval()
          .map(v => assert(v === 3n))
      )
    })

    it('computes remainder', () => {
      assertDefined(
        compileExpr('7 % 2')
          .eval()
          .map(v => assert(v === 1n))
      )
    })

    it('computes power', () => {
      assertDefined(
        compileExpr('3^4')
          .eval()
          .map(v => assert(v === 81n))
      )
    })

    it('computes greater than', () => {
      assertDefined(
        compileExpr('5 > 3')
          .eval()
          .map(v => assert(v === true))
      )
      assertDefined(
        compileExpr('5 > 5')
          .eval()
          .map(v => assert(v === false))
      )
      assertDefined(
        compileExpr('3 > 5')
          .eval()
          .map(v => assert(v === false))
      )
    })

    it('computes less than', () => {
      assertDefined(
        compileExpr('5 < 3')
          .eval()
          .map(v => assert(v === false))
      )
      assertDefined(
        compileExpr('5 < 5')
          .eval()
          .map(v => assert(v === false))
      )
      assertDefined(
        compileExpr('3 < 5')
          .eval()
          .map(v => assert(v === true))
      )
    })

    it('computes greater than or equal', () => {
      assertDefined(
        compileExpr('5 >= 4')
          .eval()
          .map(v => assert(v === true))
      )
      assertDefined(
        compileExpr('5 >= 5')
          .eval()
          .map(v => assert(v === true))
      )
      assertDefined(
        compileExpr('4 >= 5')
          .eval()
          .map(v => assert(v === false))
      )
    })

    it('computes less than or equal', () => {
      assertDefined(
        compileExpr('5 <= 4')
          .eval()
          .map(v => assert(v === false))
      )
      assertDefined(
        compileExpr('5 <= 5')
          .eval()
          .map(v => assert(v === true))
      )
      assertDefined(
        compileExpr('4 <= 5')
          .eval()
          .map(v => assert(v === true))
      )
    })
  })
})
