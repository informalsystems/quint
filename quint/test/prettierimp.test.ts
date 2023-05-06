import { describe, it } from 'mocha'
import { expect } from 'chai'
import { format, group, line, nest, text } from '../src/prettierimp'

describe('prettierimp', () => {
  it('page 2 tests', () => {
    const doc = [
      text('[begin'), line('\n', ' '),
      group([
        text('[stmt;'), line('\n', ' '),
        text('stmt;'), line('\n', ' '),
        text('stmt;]'),
      ]),
      line('\n', ' '),
      text('end]'),
    ]

    const result1 = format(60, doc)
    expect(result1).to.equal('[begin [stmt; stmt; stmt;] end]')

    const result2 = format(30, doc)
    const expected2 =
`[begin
[stmt; stmt; stmt;]
end]`
    expect(result2).to.equal(expected2)

    const result3 = format(10, doc)
    const expected3 =
`[begin
[stmt;
stmt;
stmt;]
end]`
    expect(result3).to.equal(expected3)
  })

  it('page 3 tests', () => {
    const doc = [
      text('[begin'),
      nest('   ',
        [
          line('\n', ' '),
          group([
            text('[stmt;'),
            line('\n', ' '),
            text('stmt;'),
            line('\n', ' '),
            text('stmt;]'),
          ]),
        ]
      ),
      line('\n', ' '),
      text('end]'),
    ]

    const result1 = format(50, doc)
    expect(result1).to.equal('[begin [stmt; stmt; stmt;] end]')

    const result2 = format(30, doc)
    const expected2 =
`[begin
   [stmt; stmt; stmt;]
end]`
     expect(result2).to.equal(expected2)

    const result3 = format(10, doc)
    const expected3 =
`[begin
   [stmt;
   stmt;
   stmt;]
end]`
     expect(result3).to.equal(expected3)
  })
})
