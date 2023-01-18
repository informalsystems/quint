import { describe, it } from 'mocha'
import { assert } from 'chai'
import { Either, left, right } from '@sweet-monads/either'
import { expressionToString } from '../../src/IRprinting'
import { ComputableKind, fail, kindName } from '../../src/runtime/runtime'
import { CompilationContext, compile } from '../../src/runtime/compile'
import { RuntimeValue } from '../../src/runtime/impl/runtimeValue'
import { dedent } from '../textUtils'

// Compile an expression, evaluate it, convert to QuintEx, then to a string,
// compare the result. This is the easiest path to test the results.
function assertResultAsString(input: string, expected: string | undefined) {
  const moduleText = `module __runtime { val __expr = ${input} }`
  const context = compile(moduleText).values
  const value = context.get(kindName('callable', '__expr'))
  if (value === undefined) {
    assert(false, `Missing value for ${input}`)
  } else {
    const result = value
      .eval()
      .map(r => r.toQuintEx())
      .map(expressionToString)
      .map(s => assert(s === expected, `Expected ${expected}, found ${s}`))
    if (result.isNone()) {
      assert(expected === undefined, `Expected ${expected}, found undefined`)
    }
  }
}

// Compile an input and evaluate a callback in the context
function evalInContext<T>(input: string, callable: (ctx: CompilationContext) => Either<string, T>) {
  const moduleText = `module __runtime { ${input} }`
  const context = compile(moduleText)
  return callable(context)
}

// Compile a definition and check that the compiled value is defined.
function assertDef(kind: ComputableKind, name: string, input: string) {
  const callback = (ctx: CompilationContext) => {
    const def = ctx.values.get(kindName(kind, name))
    if (def) {
      return right(true)
    } else {
      return left(`Expected a definition for ${name}, compiled from: ${input}`)
    }
  }
  const res = evalInContext(input, callback)
  res.mapLeft(m => assert.fail(m))
}

function evalVarAfterRun(runName: string, varName: string, input: string) {
  const callback = (ctx: CompilationContext) => {
    const run = ctx.values.get(kindName('callable', runName))
    if (run === undefined) {
      return right(`Run ${runName} not found`)
    } else {
      // evaluate the body of the run
      const runRes = run.eval()
      if (runRes.isNone()) {
        return right(`Value of the run ${runName} is undefined`)
      } else {
        const rval = runRes.value as RuntimeValue
        if (rval.toBool()) {
          // extract the value of the state variable
          const varValue =
            (ctx.values.get(kindName('nextvar', varName)) ?? fail).eval()
          if (varValue.isNone()) {
            return left(`Value of the variable ${varName} is undefined`)
          } else {
            return right(expressionToString(varValue.value.toQuintEx()))
          }
        } else {
          const s = expressionToString(rval.toQuintEx())
          const m =
            `Run ${runName} was expected to evaluate to true, found: ${s}`
          return left(m)
        }
      }
    }
  }

  return evalInContext(input, callback)
}

function assertVarAfterRun(runName: string, varName: string, expected: string, input: string) {
  evalVarAfterRun(runName, varName, input)
    .mapLeft(m => assert.fail(m))
    .mapRight(output =>
      assert(expected === output,
        `Expected ${varName} == ${expected}, found ${output}`))
}

describe('compiling specs to runtime values', () => {
  describe('compile over integers', () => {
    it('computes positive integer literals', () => {
      assertResultAsString('15', '15')
    })

    it('computes negative integer literals', () => {
      assertResultAsString('-15', '-15')
    })

    it('computes addition', () => {
      assertResultAsString('2 + 3', '5')
    })

    it('computes subtraction', () => {
      assertResultAsString('2 - 3', '-1')
    })

    it('computes negation', () => {
      assertResultAsString('-(2 + 3)', '-5')
    })

    it('computes multiplication', () => {
      assertResultAsString('2 * 3', '6')
    })

    it('computes division', () => {
      assertResultAsString('7 / 2', '3')
    })

    it('computes remainder', () => {
      assertResultAsString('7 % 2', '1')
    })

    it('computes power', () => {
      assertResultAsString('3^4', '81')
      assertResultAsString('(-2)^3', '-8')
      assertResultAsString('-2^3', '-8')
      assertResultAsString('(-2)^4', '16')
      assertResultAsString('-2^4', '-16')
      assertResultAsString('0^(-1)', undefined)
      assertResultAsString('0^0', undefined)
    })

    it('computes greater than', () => {
      assertResultAsString('5 > 3', 'true')
      assertResultAsString('5 > 5', 'false')
      assertResultAsString('3 > 5', 'false')
    })

    it('computes less than', () => {
      assertResultAsString('5 < 3', 'false')
      assertResultAsString('5 < 5', 'false')
      assertResultAsString('3 < 5', 'true')
    })

    it('computes greater than or equal', () => {
      assertResultAsString('5 >= 4', 'true')
      assertResultAsString('5 >= 5', 'true')
      assertResultAsString('4 >= 5', 'false')
    })

    it('computes less than or equal', () => {
      assertResultAsString('5 <= 4', 'false')
      assertResultAsString('5 <= 5', 'true')
      assertResultAsString('4 <= 5', 'true')
    })

    it('computes integer equality', () => {
      assertResultAsString('5 == 4', 'false')
      assertResultAsString('4 == 4', 'true')
    })

    it('computes integer inequality', () => {
      assertResultAsString('5 != 4', 'true')
      assertResultAsString('4 != 4', 'false')
    })
  })

  describe('compile over Booleans', () => {
    it('computes Boolean literals', () => {
      assertResultAsString('false', 'false')
      assertResultAsString('true', 'true')
    })

    it('computes not', () => {
      assertResultAsString('not(false)', 'true')
      assertResultAsString('not(true)', 'false')
    })

    it('computes and', () => {
      assertResultAsString('false and false', 'false')
      assertResultAsString('false and true', 'false')
      assertResultAsString('true and false', 'false')
      assertResultAsString('true and true', 'true')
      assertResultAsString('and(true, true, false)', 'false')
      assertResultAsString('and(true, true, true)', 'true')
    })

    it('computes or', () => {
      assertResultAsString('false or false', 'false')
      assertResultAsString('false or true', 'true')
      assertResultAsString('true or false', 'true')
      assertResultAsString('true or true', 'true')
      assertResultAsString('or(false, true, true)', 'true')
      assertResultAsString('or(true, true, false)', 'true')
      assertResultAsString('or(false, false, false)', 'false')
    })

    it('computes implies', () => {
      assertResultAsString('false implies false', 'true')
      assertResultAsString('false implies true', 'true')
      assertResultAsString('true implies false', 'false')
      assertResultAsString('true implies true', 'true')
    })

    it('computes iff', () => {
      assertResultAsString('false iff false', 'true')
      assertResultAsString('false iff true', 'false')
      assertResultAsString('true iff false', 'false')
      assertResultAsString('true iff true', 'true')
    })

    it('computes Boolean equality', () => {
      assertResultAsString('false == false', 'true')
      assertResultAsString('true  == true', 'true')
      assertResultAsString('false == true', 'false')
      assertResultAsString('true  == false', 'false')
    })

    it('computes Boolean inequality', () => {
      assertResultAsString('false != false', 'false')
      assertResultAsString('true  != true', 'false')
      assertResultAsString('false != true', 'true')
      assertResultAsString('true  != false', 'true')
    })
  })

  describe('compile over other operators', () => {
    it('computes Boolean if-then-else', () => {
      assertResultAsString('if (false) false else true', 'true')
      assertResultAsString('if (true) false else true', 'false')
    })

    it('computes integer if-then-else', () => {
      assertResultAsString('if (3 > 5) 1 else 2', '2')
      assertResultAsString('if (5 > 3) 1 else 2', '1')
    })
  })

  describe('compile over definitions', () => {
    it('computes value definitions', () => {
      const input =
        `val x = 3 + 4
         val y = 2 * x
         y - x`
      assertResultAsString(input, '7')
    })

    it('computes multi-arg definitions', () => {
      const input =
        `def mult(x, y) = (x * y)
         mult(2, mult(3, 4))`
      assertResultAsString(input, '24')
    })

    it('uses named def instead of lambda', () => {
      const input =
        `def positive(x) = x > 0
         (-3).to(3).filter(positive)`
      assertResultAsString(input, 'Set(1, 2, 3)')
    })
  })

  describe('compile variables', () => {
    it('variable definitions', () => {
      const input = 'var x: int'
      assertDef('var', 'x', input)
    })
  })

  describe('compile over sets', () => {
    it('computes an interval', () => {
      const input = '2.to(5)'
      assertResultAsString(input, 'Set(2, 3, 4, 5)')
    })

    it('interval cardinality', () => {
      const input = '2.to(5).size()'
      assertResultAsString(input, '4')
    })

    it('interval isFinite', () => {
      const input = '2.to(5).isFinite()'
      assertResultAsString(input, 'true')
    })

    it('computes a flat set', () => {
      const input = 'Set(1, 3 - 1, 3)'
      assertResultAsString(input, 'Set(1, 2, 3)')
    })

    it('flat set cardinality', () => {
      const input = 'Set(1, 4 - 1, 3).size()'
      assertResultAsString(input, '2')
    })

    it('flat set isFinite', () => {
      const input = 'Set(1, 4 - 1, 3).isFinite()'
      assertResultAsString(input, 'true')
    })

    it('computes a flat set without duplicates', () => {
      const input = 'Set(1, 2, 3 - 1, 3, 1)'
      assertResultAsString(input, 'Set(1, 2, 3)')
    })

    it('computes a set of sets', () => {
      const input = 'Set(Set(1, 2), Set(2, 3), Set(1, 3))'
      assertResultAsString(input, 'Set(Set(1, 2), Set(1, 3), Set(2, 3))')
    })

    it('cardinality of a set of sets', () => {
      const input = 'Set(Set(1, 2), Set(2, 3), Set(1, 3)).size()'
      assertResultAsString(input, '3')
    })

    it('computes a set of intervals', () => {
      const input = 'Set(1.to(3), 3.to(4))'
      assertResultAsString(input, 'Set(Set(1, 2, 3), Set(3, 4))')
    })

    it('computes equality over sets', () => {
      assertResultAsString('Set(1, 2) == Set(1, 3 - 1)', 'true')
      assertResultAsString('Set(1, 2) == Set(1, 3 - 3)', 'false')
    })

    it('computes equality over intervals', () => {
      assertResultAsString('1.to(3) == 1.to(4 - 1)', 'true')
      assertResultAsString('1.to(3) == Set(1, 2, 3)', 'true')
      assertResultAsString('Set(1, 2, 3) == 1.to(3)', 'true')
      assertResultAsString('(-3).to(4) == Set(-3, -2, -1, 0, 1, 2, 3, 4)', 'true')
      assertResultAsString('(-2).to(-4) == Set()', 'true')
      assertResultAsString('3.to(-2) == Set()', 'true')
      assertResultAsString('1.to(3) == 1.to(4)', 'false')
      assertResultAsString('(-1).to(3) == 1.to(3)', 'false')
      assertResultAsString('2.to(4) == 1.to(4)', 'false')
      assertResultAsString('(-4).to(-2) == (-2).to(-4)', 'false')
      assertResultAsString('3.to(0) == 4.to(-1)', 'true')
    })

    it('computes inequality over sets', () => {
      assertResultAsString('Set(1, 2) != Set(1, 3 - 1)', 'false')
      assertResultAsString('Set(1, 2) != Set(1, 3 - 3)', 'true')
    })

    it('computes inequality over intervals', () => {
      assertResultAsString('1.to(3) != 1.to(4 - 1)', 'false')
      assertResultAsString('1.to(3) != Set(1, 2, 3)', 'false')
      assertResultAsString('Set(1, 2, 3) != 1.to(3)', 'false')
      assertResultAsString('1.to(3) != 1.to(4)', 'true')
      assertResultAsString('2.to(4) != 1.to(4)', 'true')
    })

    it('computes a set of sets without duplicates', () => {
      const input = 'Set(Set(1, 2), Set(2, 3), Set(1, 3), Set(2 - 1, 2 + 1))'
      assertResultAsString(input, 'Set(Set(1, 2), Set(1, 3), Set(2, 3))')
    })

    it('computes contains', () => {
      assertResultAsString('Set(1, 2, 3).contains(2)', 'true')
      assertResultAsString('Set(1, 2, 3).contains(4)', 'false')
    })

    it('computes in', () => {
      assertResultAsString('2.in(Set(1, 2, 3))', 'true')
      assertResultAsString('4.in(Set(1, 2, 3))', 'false')
    })

    it('computes in an interval', () => {
      assertResultAsString('2.in(1.to(3))', 'true')
      assertResultAsString('4.in(1.to(3))', 'false')
      assertResultAsString('1.to(3).in(Set(1.to(3), 2.to(4)))', 'true')
    })

    it('computes in over nested sets', () => {
      assertResultAsString('Set(1, 2).in(Set(Set(1, 2), Set(2, 3)))', 'true')
      assertResultAsString('Set(1, 3).in(Set(Set(1, 2), Set(2, 3)))', 'false')
    })

    it('computes subseteq', () => {
      assertResultAsString('Set(1, 2).subseteq(Set(1, 2, 3))', 'true')
      assertResultAsString('Set(1, 2, 4).subseteq(Set(1, 2, 3))', 'false')
    })

    it('computes subseteq over intervals', () => {
      assertResultAsString('2.to(4).subseteq(1.to(10))', 'true')
      assertResultAsString('2.to(0).subseteq(3.to(0))', 'true')
      assertResultAsString('Set(2, 3, 4).subseteq(1.to(10))', 'true')
      assertResultAsString('2.to(4).subseteq(1.to(3))', 'false')
      assertResultAsString('2.to(4).subseteq(Set(1, 2, 3))', 'false')
    })

    it('computes union', () => {
      assertResultAsString('Set(1, 2).union(Set(1, 3))', 'Set(1, 2, 3)')
      assertResultAsString('1.to(3).union(2.to(4))', 'Set(1, 2, 3, 4)')
      assertResultAsString('Set(1, 2, 3).union(2.to(4))', 'Set(1, 2, 3, 4)')
      assertResultAsString('1.to(3).union(Set(2, 3, 4))', 'Set(1, 2, 3, 4)')
    })

    it('computes intersect', () => {
      assertResultAsString('Set(1, 2).intersect(Set(1, 3))', 'Set(1)')
      assertResultAsString('1.to(3).intersect(2.to(4))', 'Set(2, 3)')
      assertResultAsString('Set(1, 2, 3).intersect(2.to(4))', 'Set(2, 3)')
      assertResultAsString('1.to(3).intersect(Set(2, 3, 4))', 'Set(2, 3)')
    })

    it('computes exclude', () => {
      assertResultAsString('Set(1, 2, 4).exclude(Set(1, 3))', 'Set(2, 4)')
      assertResultAsString('1.to(3).exclude(2.to(4))', 'Set(1)')
      assertResultAsString('Set(1, 2, 3).exclude(2.to(4))', 'Set(1)')
      assertResultAsString('1.to(3).exclude(Set(2, 3, 4))', 'Set(1)')
    })

    it('computes flatten', () => {
      assertResultAsString(
        'Set(Set(1, 2), Set(2, 3), Set(3, 4)).flatten()',
        'Set(1, 2, 3, 4)'
      )
    })

    it('computes flatten on nested sets', () => {
      assertResultAsString(
        'Set(Set(Set(1, 2), Set(2, 3)), Set(Set(3, 4))).flatten()',
        'Set(Set(1, 2), Set(2, 3), Set(3, 4))'
      )
    })

    it('computes exists', () => {
      assertResultAsString('Set(1, 2, 3).exists(x => true)', 'true')
      assertResultAsString('Set(1, 2, 3).exists(x => false)', 'false')
      assertResultAsString('Set(1, 2, 3).exists(x => x >= 2)', 'true')
      assertResultAsString('Set(1, 2, 3).exists(x => x >= 5)', 'false')
    })

    it('computes exists over intervals', () => {
      assertResultAsString('1.to(3).exists(x => true)', 'true')
      assertResultAsString('1.to(3).exists(x => false)', 'false')
      assertResultAsString('1.to(3).exists(x => x >= 2)', 'true')
      assertResultAsString('1.to(3).exists(x => x >= 5)', 'false')
    })

    it('computes forall', () => {
      assertResultAsString('Set(1, 2, 3).forall(x => true)', 'true')
      assertResultAsString('Set(1, 2, 3).forall(x => false)', 'false')
      assertResultAsString('Set(1, 2, 3).forall(x => x >= 2)', 'false')
      assertResultAsString('Set(1, 2, 3).forall(x => x >= 0)', 'true')
    })

    it('computes forall over nested sets', () => {
      const input =
        'Set(Set(1, 2), Set(2, 3)).forall(s => 2.in(s))'
      assertResultAsString(input, 'true')
    })

    it('computes forall over intervals', () => {
      assertResultAsString('1.to(3).forall(x => true)', 'true')
      assertResultAsString('1.to(3).forall(x => false)', 'false')
      assertResultAsString('1.to(3).forall(x => x >= 2)', 'false')
      assertResultAsString('1.to(3).forall(x => x >= 0)', 'true')
    })

    it('computes map', () => {
      // a bijection
      assertResultAsString('Set(1, 2, 3).map(x => 2 * x)', 'Set(2, 4, 6)')
      // not an injection: 2 and 3 are mapped to 1
      assertResultAsString('Set(1, 2, 3).map(x => x / 2)', 'Set(0, 1)')
    })

    it('computes map over intervals', () => {
      // a bijection
      assertResultAsString('1.to(3).map(x => 2 * x)', 'Set(2, 4, 6)')
      // not an injection: 2 and 3 are mapped to 1
      assertResultAsString('1.to(3).map(x => x / 2)', 'Set(0, 1)')
    })

    it('computes filter', () => {
      assertResultAsString('Set(1, 2, 3, 4).filter(x => false)', 'Set()')
      assertResultAsString('Set(1, 2, 3, 4).filter(x => true)', 'Set(1, 2, 3, 4)')
      assertResultAsString('Set(1, 2, 3, 4).filter(x => x % 2 == 0)', 'Set(2, 4)')
    })

    it('computes filter over intervals', () => {
      assertResultAsString('1.to(4).filter(x => false)', 'Set()')
      assertResultAsString('1.to(4).filter(x => true)', 'Set(1, 2, 3, 4)')
      assertResultAsString('1.to(4).filter(x => x % 2 == 0)', 'Set(2, 4)')
    })

    it('computes filter over sets of intervals', () => {
      assertResultAsString('Set(1.to(4), 2.to(3)).filter(S => S.contains(1))',
        'Set(Set(1, 2, 3, 4))')
      assertResultAsString('Set(1.to(4), 2.to(3)).filter(S => S.contains(0))',
        'Set()')
    })

    it('computes fold', () => {
      // sum
      assertResultAsString('Set(1, 2, 3).fold(10, (v, x) => v + x)', '16')
      assertResultAsString('Set().fold(10, (v, x) => v + x)', '10')
      // flatten
      const input1 = dedent(
        `Set(1.to(3), 4.to(5), 6.to(7))
        |  .fold(Set(0), (a, s) => a.union(s))`
      )
      assertResultAsString(input1, 'Set(0, 1, 2, 3, 4, 5, 6, 7)')
      assertResultAsString('Set().fold(Set(), (a, s) => a.union(s))', 'Set()')
      // product by using a definition
      const input2 = dedent(
        `def prod(x, y) = x * y;
        |2.to(4).fold(1, prod)`
      )
      assertResultAsString(input2, '24')
    })
  })

  describe('compile over powerset', () => {
    it('computes a powerset', () => {
      assertResultAsString(
        '2.to(4).powerset()',
        'Set(Set(), Set(2), Set(3), Set(2, 3), Set(4), Set(2, 4), Set(3, 4), Set(2, 3, 4))'
      )
    })

    it('powerset equality', () => {
      assertResultAsString(
        '2.to(3).powerset() == Set(Set(), Set(2), Set(3), Set(2, 3))',
        'true'
      )
      assertResultAsString(
        '2.to(3).powerset() == Set(2, 3).powerset()',
        'true'
      )
      assertResultAsString(
        '2.to(4).powerset() == Set(2, 3).powerset()',
        'false'
      )
    })

    it('powerset contains', () => {
      assertResultAsString('2.to(3).powerset().contains(Set(2))', 'true')
      assertResultAsString('2.to(3).powerset().contains(Set(2, 4))', 'false')
    })

    it('powerset subseteq', () => {
      assertResultAsString(
        '2.to(4).powerset().subseteq(1.to(5).powerset())',
        'true'
      )
    })

    it('powerset cardinality', () => {
      assertResultAsString('Set().powerset().size()', '1')
      assertResultAsString('2.to(4).powerset().size()', '8')
      assertResultAsString('2.to(5).powerset().size()', '16')
    })
  })

  describe('compile over built-in sets', () => {
    it('computes Bool', () => {
      assertResultAsString('Bool', 'Set(false, true)')
    })

    it('computes Int', () => {
      assertResultAsString('Int', 'Int')
    })

    it('computes Int.contains', () => {
      assertResultAsString('Int.contains(123)', 'true')
      assertResultAsString('Int.contains(0)', 'true')
      assertResultAsString('Int.contains(-123)', 'true')
    })

    it('computes Nat', () => {
      assertResultAsString('Nat', 'Nat')
    })

    it('computes Nat.contains', () => {
      assertResultAsString('Nat.contains(123)', 'true')
      assertResultAsString('Nat.contains(0)', 'true')
      assertResultAsString('Nat.contains(-123)', 'false')
    })

    it('computes isSubset', () => {
      assertResultAsString('Nat.subseteq(Nat)', 'true')
      assertResultAsString('Nat.subseteq(Int)', 'true')
      assertResultAsString('Int.subseteq(Int)', 'true')
      assertResultAsString('Int.subseteq(Nat)', 'false')
    })

    it('equality over Nat and Int', () => {
      assertResultAsString('Nat == Nat', 'true')
      assertResultAsString('Int == Int', 'true')
      assertResultAsString('Nat == Int', 'false')
      assertResultAsString('Int == Nat', 'false')
      assertResultAsString('Int == Set(0, 1)', 'false')
    })
  })

  describe('compile over tuples', () => {
    it('tuple constructors', () => {
      assertResultAsString('Tup(1, 2, 3)', 'Tup(1, 2, 3)')
      assertResultAsString('(1, 2, 3)', 'Tup(1, 2, 3)')
      assertResultAsString('(1, 2, 3,)', 'Tup(1, 2, 3)')
    })

    it('tuple access', () => {
      assertResultAsString('Tup(4, 5, 6)._1', '4')
      assertResultAsString('Tup(4, 5, 6)._2', '5')
      assertResultAsString('Tup(4, 5, 6)._3', '6')
    })

    it('tuple equality', () => {
      assertResultAsString('(4, 5, 6) == (5 - 1, 5, 6)', 'true')
      assertResultAsString('(4, 5, 6) == (5, 5, 6)', 'false')
    })

    it('cross products', () => {
      assertResultAsString('tuples(Set(), Set(), Set())', 'Set()')
      assertResultAsString('tuples(Set(), 2.to(3))', 'Set()')
      assertResultAsString('tuples(2.to(3), Set(), 3.to(5))', 'Set()')
      assertResultAsString('tuples(1.to(2), 2.to(3))',
        'Set(Tup(1, 2), Tup(2, 2), Tup(1, 3), Tup(2, 3))')
      assertResultAsString('tuples(1.to(1), 1.to(1), 1.to(1))',
        'Set(Tup(1, 1, 1))')
      assertResultAsString(
        'tuples(1.to(3), 2.to(4)) == tuples(1.to(3), 2.to(5 - 1))',
        'true'
      )
      assertResultAsString(
        'tuples(1.to(3), 2.to(4)) == tuples(1.to(3), 2.to(5 + 1))',
        'false'
      )
      assertResultAsString(
        'tuples(1.to(3), 2.to(4)).subseteq(tuples(1.to(3), 2.to(5 + 1)))',
        'true'
      )
      assertResultAsString(
        'tuples(1.to(4), 2.to(4)).subseteq(tuples(1.to(3), 2.to(5)))',
        'false'
      )
      assertResultAsString('Set(tuples(1.to(2), 2.to(3)))',
        'Set(Set(Tup(1, 2), Tup(1, 3), Tup(2, 2), Tup(2, 3)))')
    })

    it('cardinality of cross products', () => {
      assertResultAsString('tuples(1.to(4), 2.to(4)).size()', '12')
      assertResultAsString('tuples(Set(), 2.to(4)).size()', '0')
    })
  })

  describe('compile over lists', () => {
    it('list constructors', () => {
      assertResultAsString('[4, 2, 3]', 'List(4, 2, 3)')
      assertResultAsString('[4, 2, 3, ]', 'List(4, 2, 3)')
      assertResultAsString('List(4, 2, 3)', 'List(4, 2, 3)')
    })

    it('list range', () => {
      assertResultAsString('range(3, 7)', 'List(3, 4, 5, 6)')
      assertResultAsString('range(4, 5)', 'List(4)')
      assertResultAsString('range(3, 3)', 'List()')
    })

    it('list equality', () => {
      assertResultAsString('[4, 5, 6] == [5 - 1, 5, 6]', 'true')
      assertResultAsString('[4, 5, 6] == [5, 5, 6]', 'false')
      // lists are not equal to tuples in the typed world
      assertResultAsString('[4, 5, 6] == (4, 5, 6)', 'false')
    })

    it('list access', () => {
      assertResultAsString('[4, 5, 6].nth(0)', '4')
      assertResultAsString('[4, 5, 6].nth(2)', '6')
      assertResultAsString('[4, 5, 6].nth(-1)', undefined)
      assertResultAsString('[4, 5, 6].nth(3)', undefined)
    })

    it('list length', () => {
      assertResultAsString('[4, 5, 6].length()', '3')
      assertResultAsString('[].length()', '0')
    })

    it('list indices', () => {
      assertResultAsString('[4, 5, 6].indices()', 'Set(0, 1, 2)')
      assertResultAsString('[].indices()', 'Set()')
    })

    it('list append', () => {
      assertResultAsString('[4, 2, 3].append(5)', 'List(4, 2, 3, 5)')
      assertResultAsString('[].append(3)', 'List(3)')
    })

    it('list concat', () => {
      assertResultAsString('[4, 2, 3].concat([5, 6])', 'List(4, 2, 3, 5, 6)')
      assertResultAsString('[].concat([3, 4])', 'List(3, 4)')
      assertResultAsString('[3, 4].concat([])', 'List(3, 4)')
      assertResultAsString('[].concat([])', 'List()')
    })

    it('list head', () => {
      assertResultAsString('[4, 5, 6].head()', '4')
      assertResultAsString('[].head()', undefined)
    })

    it('list tail', () => {
      assertResultAsString('[4, 5, 6].tail()', 'List(5, 6)')
      assertResultAsString('[4].tail()', 'List()')
      assertResultAsString('[].tail()', undefined)
    })

    it('list slice', () => {
      assertResultAsString('[4, 5, 6, 7].slice(1, 3)', 'List(5, 6)')
      assertResultAsString('[4, 5, 6, 7].slice(0, 4)', 'List(4, 5, 6, 7)')
      assertResultAsString('[4, 5, 6, 7].slice(1, 7)', undefined)
      assertResultAsString('[4, 5, 6, 7].slice(-1, 3)', undefined)
      assertResultAsString('[1, 2].slice(1, 2)', 'List(2)')
      assertResultAsString('[1, 2].slice(1, 1)', 'List()')
      assertResultAsString('[1, 2].slice(2, 2)', undefined)
      assertResultAsString('[1, 2].slice(2, 1)', undefined)
      assertResultAsString('[].slice(0, 0)', undefined)
      assertResultAsString('[].slice(1, 0)', undefined)
      assertResultAsString('[].slice(1, 1)', undefined)
      assertResultAsString('[].slice(0, -1)', undefined)
    })

    it('list replaceAt', () => {
      assertResultAsString('[4, 5, 6].replaceAt(0, 10)', 'List(10, 5, 6)')
      assertResultAsString('[4, 5, 6].replaceAt(2, 10)', 'List(4, 5, 10)')
      assertResultAsString('[4, 5, 6].replaceAt(4, 10)', undefined)
      assertResultAsString('[4, 5, 6].replaceAt(-1, 10)', undefined)
    })

    it('list foldl', () => {
      assertResultAsString('[].foldl(3, (i, e) => i + e)', '3')
      assertResultAsString('[4, 5, 6, 7].foldl(1, (i, e) => i + e)', '23')
      assertResultAsString('[4, 5, 6, 7].foldl([], (l, e) => l.append(e))',
        'List(4, 5, 6, 7)')
    })

    it('list foldr', () => {
      assertResultAsString('[].foldr(3, (i, e) => i + e)', '3')
      assertResultAsString('[4, 5, 6, 7].foldr(1, (i, e) => i + e)', '23')
      assertResultAsString('[4, 5, 6, 7].foldr([], (l, e) => l.append(e))',
        'List(7, 6, 5, 4)')
    })

    it('list select', () => {
      assertResultAsString('[].select(e => e % 2 == 0)', 'List()')
      assertResultAsString('[4, 5, 6].select(e => e % 2 == 0)', 'List(4, 6)')
    })
  })

  describe('compile over records', () => {
    it('record constructors', () => {
      assertResultAsString('Rec("a", 2, "b", true)', 'Rec("a", 2, "b", true)')
      assertResultAsString('{ a: 2, b: true }', 'Rec("a", 2, "b", true)')
      assertResultAsString('{ a: 2, b: true, }', 'Rec("a", 2, "b", true)')
    })

    it('record equality', () => {
      assertResultAsString('{ a: 2 + 3, b: true } == { a: 5, b: true }', 'true')
      assertResultAsString('{ a: 2 + 3, b: true } == { a: 1, b: false }', 'false')
    })

    it('record field access', () => {
      assertResultAsString('{ a: 2, b: true }.a', '2')
      assertResultAsString('{ a: 2, b: true }.b', 'true')
    })

    it('record field names', () => {
      assertResultAsString('{ a: 2, b: true }.fieldNames()', 'Set("a", "b")')
    })

    it('record field update', () => {
      assertResultAsString('{ a: 2, b: true }.with("a", 3)', 'Rec("a", 3, "b", true)')
      // The following query should not be possible, due to the type checker.
      // Just in case, we check that the simulator returns 'undefined'.
      assertResultAsString('{ a: 2, b: true }.with("c", 3)', undefined)
    })
  })

  describe('compile over maps', () => {
    it('mapBy constructor', () => {
      assertResultAsString('3.to(5).mapBy(i => 2 * i)',
        'Map(Tup(3, 6), Tup(4, 8), Tup(5, 10))')
      assertResultAsString('Set(2.to(4)).mapBy(s => s.size())',
        'Map(Tup(Set(2, 3, 4), 3))')
    })

    it('setToMap constructor', () => {
      assertResultAsString('setToMap(Set((3, 6), (4, 10 - 2), (5, 10)))',
        'Map(Tup(3, 6), Tup(4, 8), Tup(5, 10))')
    })

    it('mapOf constructor', () => {
      assertResultAsString('Map(3 -> 6, 4 -> 10 - 2, 5 -> 10)',
        'Map(Tup(3, 6), Tup(4, 8), Tup(5, 10))')
    })

    it('map get', () => {
      assertResultAsString('3.to(5).mapBy(i => 2 * i).get(4)', '8')
      assertResultAsString(
        'Set(2.to(4)).mapBy(s => s.size()).get(Set(2, 3, 4))',
        '3'
      )
    })

    it('map update', () => {
      assertResultAsString(
        '3.to(5).mapBy(i => 2 * i).set(4, 20)',
        'Map(Tup(3, 6), Tup(4, 20), Tup(5, 10))'
      )
      assertResultAsString(
        '3.to(5).mapBy(i => 2 * i).set(7, 20)',
        undefined
      )
    })

    it('map setBy', () => {
      assertResultAsString(
        '3.to(5).mapBy(i => 2 * i).setBy(4, old => old + 1)',
        'Map(Tup(3, 6), Tup(4, 9), Tup(5, 10))'
      )
      assertResultAsString(
        '3.to(5).mapBy(i => 2 * i).setBy(7, old => old + 1)',
        undefined
      )
    })

    it('map put', () => {
      assertResultAsString(
        '3.to(5).mapBy(i => 2 * i).put(10, 11)',
        'Map(Tup(10, 11), Tup(3, 6), Tup(4, 8), Tup(5, 10))'
      )
    })

    it('map keys', () => {
      assertResultAsString(
        'Set(3, 5, 7).mapBy(i => 2 * i).keys()',
        'Set(3, 5, 7)'
      )
    })

    it('map equality', () => {
      assertResultAsString(
        '3.to(5).mapBy(i => 2 * i) == 3.to(5).mapBy(i => 3 * i - i)',
        'true'
      )
      assertResultAsString(
        '3.to(5).mapBy(i => 2 * i) == 3.to(6).mapBy(i => 2 * i)',
        'false'
      )
    })

    it('map setOfMaps', () => {
      assertResultAsString(
        '2.to(3).setOfMaps(5.to(6))',
        'Set(Map(Tup(2, 5), Tup(3, 5)), Map(Tup(2, 6), Tup(3, 5)), Map(Tup(2, 5), Tup(3, 6)), Map(Tup(2, 6), Tup(3, 6)))'
      )
      assertResultAsString(
        `2.to(3).setOfMaps(5.to(6)) ==
          Set(Map(2 -> 5, 3 -> 5),
              Map(2 -> 6, 3 -> 5),
              Map(2 -> 5, 3 -> 6),
              Map(2 -> 6, 3 -> 6))`,
        'true'
      )
      assertResultAsString(
        'Set(2).setOfMaps(5.to(6))',
        'Set(Map(Tup(2, 5)), Map(Tup(2, 6)))'
      )
      assertResultAsString(
        '2.to(3).setOfMaps(Set(5))',
        'Set(Map(Tup(2, 5), Tup(3, 5)))'
      )
      assertResultAsString(
        '2.to(4).setOfMaps(5.to(8)).size()',
        '64'
      )
      assertResultAsString(
        '2.to(4).setOfMaps(5.to(7)).subseteq(2.to(4).setOfMaps(4.to(8)))',
        'true'
      )
      assertResultAsString(
        '2.to(4).setOfMaps(5.to(10)).subseteq(2.to(4).setOfMaps(4.to(8)))',
        'false'
      )
      assertResultAsString(
        '2.to(3).setOfMaps(5.to(6)).contains(Map(2 -> 5, 3 -> 5))',
        'true'
      )
      assertResultAsString(
        '2.to(3).setOfMaps(5.to(6)) == 2.to(4 - 1).setOfMaps(5.to(7 - 1))',
        'true'
      )
    })
  })

  describe('compile runs', () => {
    it('then', () => {
      const input = dedent(
        `var n: int
        |run run1 = (n' = 1).then(n' = n + 2).then(n' = n * 4)
        `)

      assertVarAfterRun('run1', 'n', '12', input)
    })

    it('repeated', () => {
      const input = dedent(
        `var n: int
        |run run1 = (n' = 1).then((n' = n + 1).repeated(3))
        `)

      assertVarAfterRun('run1', 'n', '4', input)
    })

    it('assert', () => {
      const input = dedent(
        `var n: int
        |run run1 = (n' = 1).then(assert(n < 3).repeated(3))
        `)

      evalVarAfterRun('run1', 'n', input)
        .mapLeft(m => assert.fail(`Expected an error, found: ${m}`))
    })
  })
})
