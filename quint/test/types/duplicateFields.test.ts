import { describe, it } from 'mocha'
import { assert } from 'chai'
import { parse } from '../../src/parsing/quintParserFrontend'
import { newIdGenerator } from '../../src/idGenerator'

describe('Duplicate field detection', () => {
  it('should detect duplicate fields in record declarations', () => {
    const text = `module test {
      val rec = { foo: 1, foo: 2 }
    }`

    const idGen = newIdGenerator()
    const fake_path = { normalizedPath: 'fake_path', toSourceName: () => 'fake_path' }
    const parseResult = parse(idGen, 'fake_location', fake_path, text)

    assert.isNotEmpty(parseResult.errors)
    const errorMessages = parseResult.errors.map(err => err.message)
    assert.include(errorMessages.join('\n'), 'Duplicate field name')
  })

  it('should allow non-duplicate fields in record declarations', () => {
    const text = `module test {
      val rec = { foo: 1, bar: 2 }
    }`

    const idGen = newIdGenerator()
    const fake_path = { normalizedPath: 'fake_path', toSourceName: () => 'fake_path' }
    const parseResult = parse(idGen, 'fake_location', fake_path, text)

    assert.isEmpty(parseResult.errors)
  })
})
