import { expressionToString } from '../../src/ir/IRprinting'
import { newTraceRecorder } from '../../src/runtime/trace'
import { newIdGenerator } from '../../src/idGenerator'
import { newRng } from '../../src/rng'
import { fileSourceResolver } from '../../src/parsing/sourceResolver'
import { parseExpressionOrDeclaration, QuintError, QuintEx, walkExpression } from '../../src'
import { parse } from '../../src/parsing/quintParserFrontend'
import { Evaluator } from '../../src/runtime/impl/evaluator'
import { builtinLambda } from '../../src/runtime/impl/builtins'
import { Context } from '../../src/runtime/impl/Context'
import { VarStorage } from '../../src/runtime/impl/VarStorage'
import { rv } from '../../src/runtime/impl/runtimeValue'

type Mode = 'eval' | 'trace' | 'builtinField'
type Input = {
  mode: Mode
  expr?: string
  context?: string
  callee?: string
  field?: string
}

type Output =
  | { ok: true; value?: string; traceLen?: number }
  | { ok: false; error: { code: string; message: string } }

const idGen = newIdGenerator()

function prepareEvaluator(input: string, evalContext: string): [Evaluator, QuintEx] {
  const mockLookupPath = fileSourceResolver(new Map()).lookupPath('/', './mock')
  const { resolver, sourceMap } = parse(idGen, '<test>', mockLookupPath, `module contextM { ${evalContext} }`)

  const parseResult = parseExpressionOrDeclaration(input, '<input>', idGen, sourceMap)
  if (parseResult.kind !== 'expr') {
    throw new Error(`Expected an expression, found ${parseResult.kind}`)
  }

  walkExpression(resolver, parseResult.expr)
  if (resolver.errors.length > 0) {
    throw new Error(`Resolver errors: ${resolver.errors.map(e => e.message).join(', ')}`)
  }

  const rng = newRng()
  const evaluator = new Evaluator(resolver.table, newTraceRecorder(0, rng), rng)
  return [evaluator, parseResult.expr]
}

function formatError(err: QuintError): Output {
  return { ok: false, error: { code: err.code, message: err.message } }
}

function evalExpression(expr: string, context: string): Output {
  const [evaluator, parsedExpr] = prepareEvaluator(expr, context)
  const result = evaluator.evaluate(parsedExpr)
  if (result.isLeft()) {
    return formatError(result.value)
  }

  return { ok: true, value: expressionToString(result.value) }
}

function evalTrace(callee: string, context: string): Output {
  const [evaluator, parsedExpr] = prepareEvaluator(callee, context)
  const result = evaluator.evaluate(parsedExpr)
  if (result.isLeft()) {
    return formatError(result.value)
  }

  evaluator.shift()
  const traceLen = evaluator.ctx.trace.get().length
  return { ok: true, traceLen }
}

function evalBuiltinField(field: string): Output {
  const rng = newRng()
  const storage = new VarStorage(false, new Map())
  const ctx = new Context(newTraceRecorder(0, rng), rng.next, storage)
  const record = rv.mkRecord([['a', rv.mkInt(1)]])
  const result = builtinLambda('field')(ctx, [record, rv.mkStr(field)])

  if (result.isLeft()) {
    return formatError(result.value)
  }

  return { ok: true, value: expressionToString(result.value.toQuintEx(idGen)) }
}

function readInput(): Promise<Input> {
  return new Promise(resolve => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', chunk => {
      data += chunk
    })
    process.stdin.on('end', () => {
      const trimmed = data.trim()
      resolve(trimmed.length > 0 ? (JSON.parse(trimmed) as Input) : ({} as Input))
    })
  })
}

async function main() {
  const input = await readInput()
  if (!input.mode) {
    console.error(JSON.stringify({ ok: false, error: { code: 'QNT000', message: 'Missing mode' } }))
    process.exit(1)
  }

  let output: Output
  if (input.mode === 'eval') {
    if (!input.expr) {
      output = { ok: false, error: { code: 'QNT000', message: 'Missing expr' } }
    } else {
      output = evalExpression(input.expr, input.context ?? '')
    }
  } else if (input.mode === 'trace') {
    if (!input.callee || !input.context) {
      output = { ok: false, error: { code: 'QNT000', message: 'Missing callee or context' } }
    } else {
      output = evalTrace(input.callee, input.context)
    }
  } else {
    output = evalBuiltinField(input.field ?? 'b')
  }

  process.stdout.write(JSON.stringify(output))
}

main().catch(err => {
  const message = err instanceof Error ? err.message : String(err)
  process.stdout.write(JSON.stringify({ ok: false, error: { code: 'QNT000', message } }))
  process.exit(1)
})
