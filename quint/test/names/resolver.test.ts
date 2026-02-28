import { describe, it } from 'mocha'
import { assert } from 'chai'

import { NameResolutionResult } from '../../src/names/base'
import { IRVisitor, walkModule } from '../../src/ir/IRVisitor'
import { QuintVar } from '../../src/ir/quintIr'
import { resolveNames } from '../../src/names/resolver'
import { buildModule, buildModuleWithDecls } from '../builders/ir'
import { IdGenerator, newIdGenerator, zerog } from '../../src/idGenerator'

describe('resolveNames', () => {
  const baseDefs = [
    'const TEST_CONSTANT: int',
    'val unscoped_def = val scoped_def = 10 scoped_def ',
    'type MY_TYPE = int',
  ]

  function resolveNamesForExprs(exprs: string[], idGenerator?: IdGenerator): NameResolutionResult {
    const idGen = idGenerator ?? zerog
    const module = buildModule(baseDefs, exprs, undefined, idGen)

    return resolveNames([module])
  }

  function resolveNamesForDefs(defs: string[], idGenerator?: IdGenerator): NameResolutionResult {
    const idGen = idGenerator ?? zerog
    const module = buildModuleWithDecls(baseDefs.concat(defs), undefined, idGen)

    return resolveNames([module])
  }

  describe('operator definitions', () => {
    it('finds top level definitions', () => {
      const result = resolveNamesForExprs(['TEST_CONSTANT.filter(a => unscoped_def > 0)'])

      assert.isEmpty(result.errors)
    })

    it('finds scoped definitions inside of scope', () => {
      const result = resolveNamesForExprs(['TEST_CONSTANT.filter(a => a > 0)'])
      assert.isEmpty(result.errors)
    })

    it('finds unused definitions', () => {
      const module = buildModule(baseDefs, ['1 + TEST_CONSTANT'], undefined, zerog)

      const result = resolveNames([module])

      assert.isEmpty(result.errors)
      assert.sameDeepMembers(
        Array.from(result.unusedDefinitions('wrapper')).map(d => d.name),
        ['unscoped_def', 'MY_TYPE', 'd0']
      )
    })

    it('does not find scoped definitions outside of scope', () => {
      const result = resolveNamesForExprs(['TEST_CONSTANT', 'scoped_def'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Name 'scoped_def' not found", reference: 0n, data: {} },
      ])
    })

    it('find unresolved names inside application', () => {
      const result = resolveNamesForExprs(['head(x)', 'x(true)'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Name 'x' not found", reference: 0n, data: {} },
        { code: 'QNT404', message: "Name 'x' not found", reference: 0n, data: {} },
      ])
    })

    it('find unresolved names inside lambdas', () => {
      const result = resolveNamesForExprs(['Nat.filter(a => x > 1)'])

      assert.deepEqual(result.errors, [{ code: 'QNT404', message: "Name 'x' not found", reference: 0n, data: {} }])
    })

    it('find unresolved names inside lets', () => {
      const result = resolveNamesForExprs(['val a = x { true }', 'val b = true { x }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Name 'x' not found", reference: 0n, data: {} },
        { code: 'QNT404', message: "Name 'x' not found", reference: 0n, data: {} },
      ])
    })

    it('finds a definition itself with depth information', () => {
      const result = resolveNamesForExprs([], newIdGenerator())

      assert.isEmpty(result.errors)

      const def = [...result.table.values()].find(def => def.name === 'unscoped_def' || def.kind === 'def')

      assert.isNotNull(def)
      assert.deepEqual(result.table.get(def!.id)?.depth, 0)
    })
  })

  describe('shadowing', () => {
    it('resolves shadowed names', () => {
      const result = resolveNamesForDefs(
        ['val shadowing = def foo = (shadowing) => shadowing { foo(1) }', 'val a = shadowing'],
        newIdGenerator()
      )

      assert.isEmpty(result.errors)
      assert.isTrue([...result.table.values()].some(def => def.name === 'shadowing' && def.kind === 'def'))
      assert.isTrue([...result.table.values()].some(def => def.name === 'shadowing' && def.kind === 'param'))
    })

    it('collects depth and shadowing information properly', () => {
      const result = resolveNamesForDefs(['val shadowing = val a = 1 { val a = 2 { a } }'], newIdGenerator())

      assert.isEmpty(result.errors)
      assert.isTrue(
        [...result.table.values()].some(def => def.name === 'a' && def.depth === 2),
        'Could not find first a'
      )
      assert.isTrue(
        [...result.table.values()].some(def => def.name === 'a' && def.depth === 3 && def.shadowing === true),
        'Could not find second a'
      )
    })

    // Regression test for issue #1820: nondet binding shadowing state variable
    // caused QNT502 "Variable not set" error because assignment LHS was resolved
    // to the shadowing binding instead of the state variable.
    it('resolves assignment lhs to state var when shadowed by nondet', () => {
      const idGen = newIdGenerator()
      const module = buildModuleWithDecls(
        baseDefs.concat([
          'var bar: int',
          'action init = { nondet bar = Nat.oneOf() bar\' = bar }',
          'action step = bar\' = bar + 1',
        ]),
        undefined,
        idGen
      )

      const result = resolveNames([module])
      assert.isEmpty(result.errors, 'should resolve without errors')

      const varDecl = module.declarations.find(d => d.kind === 'var' && d.name === 'bar') as QuintVar
      assert.isDefined(varDecl, 'var declaration should exist')

      // Collect ALL assignment LHS ids to verify both assignments resolve correctly
      const lhsIds: bigint[] = []
      const visitor: IRVisitor = {
        enterApp(app) {
          if (app.opcode === 'assign' && app.args[0]?.kind === 'name') {
            lhsIds.push(app.args[0].id)
          }
        },
      }
      walkModule(visitor, module)

      // There should be two assignments: bar' = bar (in init) and bar' = bar + 1 (in step)
      assert.equal(lhsIds.length, 2, 'should have two assignments')

      // BOTH assignment LHS should resolve to the state variable, not the nondet binding
      for (const lhsId of lhsIds) {
        const def = result.table.get(lhsId)
        assert.equal(def?.kind, 'var', 'assignment LHS should resolve to var')
        assert.equal(def?.id, varDecl.id, 'assignment LHS should resolve to the state var declaration')
      }
    })

    // Verify that RHS of assignment still resolves to the shadowing binding
    it('resolves assignment rhs to shadowing binding while lhs resolves to state var', () => {
      const idGen = newIdGenerator()
      const module = buildModuleWithDecls(
        baseDefs.concat([
          'var bar: int',
          'action init = { nondet bar = Nat.oneOf() bar\' = bar }',
        ]),
        undefined,
        idGen
      )

      const result = resolveNames([module])
      assert.isEmpty(result.errors)

      // Find the assignment in init action
      let lhsId: bigint | undefined
      let rhsId: bigint | undefined
      const visitor: IRVisitor = {
        enterApp(app) {
          if (app.opcode === 'assign' && app.args[0]?.kind === 'name' && app.args[1]?.kind === 'name') {
            lhsId = app.args[0].id
            rhsId = app.args[1].id
          }
        },
      }
      walkModule(visitor, module)

      assert.isDefined(lhsId, 'should find assignment LHS')
      assert.isDefined(rhsId, 'should find assignment RHS')

      const lhsDef = result.table.get(lhsId!)
      const rhsDef = result.table.get(rhsId!)

      // LHS should resolve to state var
      assert.equal(lhsDef?.kind, 'var', 'LHS should be state var')

      // RHS should resolve to the nondet binding (which shadows the state var)
      // The nondet binding has kind 'def' with qualifier 'nondet'
      assert.notEqual(lhsDef?.id, rhsDef?.id, 'LHS and RHS should resolve to different definitions')
    })
  })

  describe('type aliases', () => {
    it('resolves defined aliases', () => {
      const result = resolveNamesForDefs(['const a: MY_TYPE', 'var b: a -> Set[a]'])

      assert.isEmpty(result.errors)
    })

    it('finds unresolved aliases under typed definitions', () => {
      const result = resolveNamesForDefs([
        'const a: UNKNOWN_TYPE_0',
        'var b: UNKNOWN_TYPE_1',
        'type C[t] = Set[t]',
        'assume d = 1',
      ])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE_0' not found", reference: 0n, data: {} },
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE_1' not found", reference: 0n, data: {} },
      ])
    })

    it('finds unresolved aliases under chained lets', () => {
      const result = resolveNamesForExprs(['val x = 1 { val y: Set[UNKNOWN_TYPE] = 1 { Set(0) } }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE' not found", reference: 0n, data: {} },
      ])
    })

    it('finds unresolved aliases under Set', () => {
      const result = resolveNamesForExprs(['val x: Set[UNKNOWN_TYPE] = 1 { 0 }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE' not found", reference: 0n, data: {} },
      ])
    })

    it('finds unresolved aliases under List', () => {
      const result = resolveNamesForExprs(['val x: List[UNKNOWN_TYPE] = 1 { 0 }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE' not found", reference: 0n, data: {} },
      ])
    })

    it('finds unresolved aliases under functions', () => {
      const result = resolveNamesForExprs(['val x: UNKNOWN_TYPE -> OTHER_UNKNOWN_TYPE = 1 { 0 }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE' not found", reference: 0n, data: {} },
        { code: 'QNT404', message: "Type alias 'OTHER_UNKNOWN_TYPE' not found", reference: 0n, data: {} },
      ])
    })

    it('finds unresolved aliases under operators', () => {
      const result = resolveNamesForExprs(['val f(x): (UNKNOWN_TYPE) => OTHER_UNKNOWN_TYPE = { unscoped_def } { 0 }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE' not found", reference: 0n, data: {} },
        { code: 'QNT404', message: "Type alias 'OTHER_UNKNOWN_TYPE' not found", reference: 0n, data: {} },
      ])
    })

    it('finds unresolved aliases under tuples', () => {
      const result = resolveNamesForExprs(['val x: (UNKNOWN_TYPE, OTHER_UNKNOWN_TYPE) = (1, 2) { 0 }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE' not found", reference: 0n, data: {} },
        { code: 'QNT404', message: "Type alias 'OTHER_UNKNOWN_TYPE' not found", reference: 0n, data: {} },
      ])
    })

    it('finds unresolved aliases under records', () => {
      const result = resolveNamesForExprs(['val x: { a: UNKNOWN_TYPE, b: OTHER_UNKNOWN_TYPE } = { a: 1, b: 2 } { 0 }'])

      assert.deepEqual(result.errors, [
        { code: 'QNT404', message: "Type alias 'UNKNOWN_TYPE' not found", reference: 0n, data: {} },
        { code: 'QNT404', message: "Type alias 'OTHER_UNKNOWN_TYPE' not found", reference: 0n, data: {} },
      ])
    })
  })
})
