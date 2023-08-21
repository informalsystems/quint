import { describe, it } from 'mocha'
import { assert } from 'chai'
import { buildModuleWithDecls } from '../builders/ir'
import { QuintError, QuintModule } from '../../src'
import { NameCollector } from '../../src/names/collector'
import { walkModule } from '../../src/ir/IRVisitor'
import { DefinitionsByName } from '../../src/names/base'
import { zerog } from '../../src/idGenerator'

describe('NameCollector', () => {
  const baseModule = buildModuleWithDecls(
    ['def a = 1', 'def b = 2', 'def c = 3', 'const c1: int', 'const c2: int', 'type T = int', 'type R'],
    'test_module',
    zerog
  )

  function collect(module: QuintModule): [QuintError[], DefinitionsByName] {
    const collector = new NameCollector()
    walkModule(collector, baseModule)
    walkModule(collector, module)
    return [collector.errors, collector.definitionsByName]
  }

  describe('existing modules', () => {
    it('imports named definitions', () => {
      const quintModule = buildModuleWithDecls(['import test_module.a'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.deepInclude([...definitions.keys()], 'a')
      assert.notDeepInclude([...definitions.keys()], 'b')
    })

    it('imports all definitions', () => {
      const quintModule = buildModuleWithDecls(['import test_module.*'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.includeDeepMembers([...definitions.keys()], ['a', 'b', 'T'])
    })

    it('imports definitions with namespace', () => {
      const quintModule = buildModuleWithDecls(['import test_module'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)

      const def = definitions.get('test_module::a')
      assert.isTrue(def!.hidden)
      assert.deepEqual(def?.kind, 'def')
    })

    it('imports definitions with qualifier', () => {
      const quintModule = buildModuleWithDecls(['import test_module as my_import'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)

      const def = definitions.get('my_import::a')
      assert.isTrue(def!.hidden)
      assert.deepEqual(def?.kind, 'def')
    })

    it('instantiates modules', () => {
      const quintModule = buildModuleWithDecls(
        ['import test_module(c1 = 3, c2 = 4) as test_module_instance'],
        undefined,
        zerog
      )

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.includeDeepMembers([...definitions.keys()], ['test_module_instance::c1', 'test_module_instance::c2'])
      assert.includeDeepMembers([...definitions.keys()], ['test_module_instance::T'])
    })

    it('fails instantiating when a param does not exists', () => {
      const quintModule = buildModuleWithDecls(
        ['import test_module(c1 = 3, c2 = 4, other = 5) as test_module_instance'],
        undefined,
        zerog
      )

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        {
          code: 'QNT406',
          message: "Instantiation error: 'other' not found in 'test_module'",
          reference: 0n,
          data: {},
        },
      ])
    })

    it('fails instantiating when a param is not a constant', () => {
      const quintModule = buildModuleWithDecls(
        ['import test_module(c1 = 3, c2 = 4, a = 5) as test_module_instance'],
        undefined,
        zerog
      )

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        {
          code: 'QNT406',
          message: "Instantiation error: 'a' is not a constant in 'test_module'",
          reference: 0n,
          data: {},
        },
      ])
    })

    it('fails importing itself', () => {
      const quintModule = buildModuleWithDecls(
        ['import wrapper.*', 'import wrapper(c1 = 1) as w', 'export wrapper.*'],
        undefined,
        zerog
      )

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        { code: 'QNT407', message: "Cannot import 'wrapper' inside 'wrapper'", reference: 0n, data: {} },
        { code: 'QNT407', message: "Cannot instantiate 'wrapper' inside 'wrapper'", reference: 0n, data: {} },
        { code: 'QNT407', message: "Cannot export 'wrapper' inside 'wrapper'", reference: 0n, data: {} },
      ])
    })

    it('exports all definitions', () => {
      const quintModule = buildModuleWithDecls(['export test_module.*'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.isNotTrue(definitions.get('a')!.hidden)
      assert.isNotTrue(definitions.get('T')!.hidden)
    })

    it('exports previously imported definitions', () => {
      const quintModule = buildModuleWithDecls(['import test_module.*', 'export test_module.*'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.isNotTrue(definitions.get('a')!.hidden)
      assert.isNotTrue(definitions.get('T')!.hidden)
    })

    it('exports imported definitions that were previously qualified', () => {
      const quintModule = buildModuleWithDecls(['import test_module as T1', 'export T1.*'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.isNotTrue(definitions.get('a')!.hidden)
      assert.isNotTrue(definitions.get('T')!.hidden)
    })

    it('exports specific definitions', () => {
      const quintModule = buildModuleWithDecls(['import test_module.*', 'export test_module.a'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      // a is not hidden anymore
      assert.isNotTrue(definitions.get('a')!.hidden)
      // T is still hidden
      assert.isTrue(definitions.get('T')!.hidden)
    })

    it('exports definitions with qualifier', () => {
      const quintModule = buildModuleWithDecls(
        ['import test_module.*', 'export test_module as my_export'],
        undefined,
        zerog
      )

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.isTrue(definitions.get('a')!.hidden)
      assert.isNotTrue(definitions.get('my_export::a')!.hidden)
    })

    it('exports definitions with namespace', () => {
      const quintModule = buildModuleWithDecls(['import test_module.*', 'export test_module'], undefined, zerog)

      const [errors, definitions] = collect(quintModule)

      assert.isEmpty(errors)
      assert.isTrue(definitions.get('a')!.hidden)
      assert.isNotTrue(definitions.get('test_module::a')!.hidden)
    })

    it('fails exporting unexisting definition', () => {
      const quintModule = buildModuleWithDecls(['import test_module.*', 'export test_module.other'], undefined, zerog)

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        { code: 'QNT404', message: "Name 'test_module::other' not found", reference: 0n, data: {} },
      ])
    })
  })

  describe('conflicts', () => {
    it('reports conflicts with builtin names', () => {
      const quintModule = buildModuleWithDecls(['def size(x) = 10'], undefined, zerog)

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        { code: 'QNT101', message: "Built-in name 'size' is redefined in module 'wrapper'", reference: 0n, data: {} },
      ])
    })

    it('reports conflicts with user defined names', () => {
      // Use the real id generator to have different references for each def
      const quintModule = buildModuleWithDecls(['def a = 10', 'import test_module.*'])

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        {
          code: 'QNT101',
          message: "Conflicting definitions found for name 'a' in module 'wrapper'",
          reference: 2n,
          data: {},
        },
        {
          code: 'QNT101',
          message: "Conflicting definitions found for name 'a' in module 'wrapper'",
          reference: 0n,
          data: {},
        },
      ])
    })

    it('reports conflicts with module names', () => {
      // Setup already defines a module named 'test_module', see `baseDefs`
      const quintModule = buildModuleWithDecls(['def a = 10'], 'test_module')

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        {
          code: 'QNT102',
          message: "Module with name 'test_module' was already defined",
          reference: 3n,
          data: {},
        },
      ])
    })
  })

  describe('unexisting modules', () => {
    it('fails importing', () => {
      const quintModule = buildModuleWithDecls(['import unexisting_module.*'], undefined, zerog)

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        { code: 'QNT405', message: "Module 'unexisting_module' not found", reference: 0n, data: {} },
      ])
    })

    it('fails instantiating', () => {
      const quintModule = buildModuleWithDecls(
        ['import unexisting_module(c1 = c1, c2 = c2) as test_module_instance'],
        undefined,
        zerog
      )

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        { code: 'QNT405', message: "Module 'unexisting_module' not found", reference: 0n, data: {} },
      ])
    })

    it('fails exporting', () => {
      const quintModule = buildModuleWithDecls(['export unexisting_module.*'], undefined, zerog)

      const [errors, _definitions] = collect(quintModule)

      assert.sameDeepMembers(errors, [
        { code: 'QNT405', message: "Module 'unexisting_module' not found", reference: 0n, data: {} },
      ])
    })
  })
})
