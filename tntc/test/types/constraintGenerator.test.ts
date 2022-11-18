import { describe, it } from 'mocha'
import { assert } from 'chai'
import { Constraint } from '../../src/types/base'
import { ConstraintGeneratorVisitor } from '../../src/types/constraintGenerator'
import { left, right } from '@sweet-monads/either'
import { walkModule } from '../../src/IRVisitor'
import { buildModuleWithDefs } from '../builders/ir'
import { constraintToString } from '../../src/types/printing'
import { ErrorTree } from '../../src/errorTree'
import { LookupTable, LookupTableByModule, newTable } from '../../src/lookupTable'
import { defaultValueDefinitions } from '../../src/definitionsCollector'

describe('ConstraintGeneratorVisitor', () => {
  const table: LookupTable = newTable({
    valueDefinitions: defaultValueDefinitions().concat([
      { kind: 'param', identifier: 'p', reference: 1n },
      { kind: 'var', identifier: 's', reference: 2n },
      { kind: 'param', identifier: 'x', reference: 3n },
      { kind: 'const', identifier: 'N', reference: 4n },
      { kind: 'var', identifier: 'y', reference: 5n },
      { kind: 'param', identifier: 'S', reference: 6n },
      { kind: 'val', identifier: 'm', reference: 7n },
      { kind: 'val', identifier: 't', reference: 8n },
    ]),
  })

  const definitionsTable: LookupTableByModule = new Map<string, LookupTable>([['wrapper', table]])

  it('collects constraints from expressions', () => {
    const tntModule = buildModuleWithDefs([
      'def d(S) = S.map(x => x + 10)',
    ])

    const expectedConstraint =
      '(int, int) => int ~ (t_x_3, int) => t0 /\\ (Set[t1], (t1) => t2) => Set[t2] ~ (t_S_6, (t_x_3) => t0) => t3'

    const solvingFunction = (c: Constraint) => {
      assert.deepEqual(constraintToString(c), expectedConstraint)
      return right([])
    }

    const visitor = new ConstraintGeneratorVisitor(solvingFunction, definitionsTable)
    walkModule(visitor, tntModule)
  })

  it('handles underscore', () => {
    const tntModule = buildModuleWithDefs([
      'def d(S) = S.map(_ => 10)',
    ])

    const expectedConstraint = '(Set[t1], (t1) => t2) => Set[t2] ~ (t_S_6, (t0) => int) => t3'

    const solvingFunction = (c: Constraint) => {
      assert.deepEqual(constraintToString(c), expectedConstraint)
      return right([])
    }

    const visitor = new ConstraintGeneratorVisitor(solvingFunction, definitionsTable)
    walkModule(visitor, tntModule)
  })

  it('collects types from variable and constant definitions', () => {
    const tntModule = buildModuleWithDefs([
      'var s: str',
      'const N: int',
      'def a = s',
      'def b = N',
    ])

    const solvingFunction = (_: Constraint) => right([])

    const visitor = new ConstraintGeneratorVisitor(solvingFunction, definitionsTable)
    walkModule(visitor, tntModule)

    assert.includeDeepMembers([...visitor.types.entries()], [
      [6n, { variables: new Set([]), type: { kind: 'str', id: 1n } }],
      [8n, { variables: new Set([]), type: { kind: 'int', id: 3n } }],
    ])
  })

  it('collects solving errors', () => {
    const tntModule = buildModuleWithDefs([
      'def a = 1 + true',
    ])

    const error: ErrorTree = {
      location: 'Mocked location',
      message: 'Mocked message',
      children: [],
    }

    const errors = new Map<bigint, ErrorTree>([[1n, error]])

    const solvingFunction = (_: Constraint) => left(errors)

    const visitor = new ConstraintGeneratorVisitor(solvingFunction, definitionsTable)
    walkModule(visitor, tntModule)

    assert.sameDeepMembers(Array.from(visitor.errors.entries()), Array.from(errors.entries()))
  })

  it('collects internal errors', () => {
    const tntModule = buildModuleWithDefs([
      'def a = undefinedOperator',
      // Everything after the error is ignored. This behavior should be improved
      // after https://github.com/informalsystems/tnt/issues/177
      'def b(x) = a',
      'def c = b(1)',
      'def d = val m = 1 { a }',

    ])

    const error: ErrorTree = {
      location: 'Generating constraints for undefinedOperator',
      message: 'Signature not found for name: undefinedOperator',
      children: [],
    }

    const errors = new Map<bigint, ErrorTree>([[1n, error]])

    const solvingFunction = (_: Constraint) => right([])
    const visitor = new ConstraintGeneratorVisitor(solvingFunction, definitionsTable)
    walkModule(visitor, tntModule)

    assert.sameDeepMembers(Array.from(visitor.errors.values()), Array.from(errors.values()))
  })
})
