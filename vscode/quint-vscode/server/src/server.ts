/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2021. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */
import {
  CodeAction,
  CodeActionKind,
  CodeActionParams,
  DefinitionParams,
  HandlerResult,
  Hover,
  HoverParams,
  InitializeParams,
  InitializeResult,
  Location,
  MarkupContent,
  MarkupKind,
  ProposedFeatures,
  SignatureHelp,
  SignatureHelpParams,
  TextDocumentSyncKind,
  TextDocuments,
  createConnection
} from 'vscode-languageserver/node'

import {
  DocumentUri,
  TextDocument
} from 'vscode-languageserver-textdocument'

import { AnalyzisOutput, DocumentationEntry, Loc, ParserPhase2, QuintAnalyzer, QuintError, QuintErrorData, builtinDocs, effectSchemeToString, newIdGenerator, parsePhase1, parsePhase2, produceDocs, typeSchemeToString } from '@informalsystems/quint'
import { assembleDiagnostic, diagnosticsFromErrors, findBestMatchingResult, findName, locToRange } from './reporting'

// Create one generator of unique identifiers
const idGenerator = newIdGenerator()

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all)

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

// Store auxiliary information by document
const parsedDataByDocument: Map<DocumentUri, ParserPhase2> = new Map<DocumentUri, ParserPhase2>()
const analysisOutputByDocument: Map<DocumentUri, AnalyzisOutput> = new Map<DocumentUri, AnalyzisOutput>()
// Documentation entries by name, by module, by document
const docsByDocument: Map<DocumentUri, Map<string, Map<string, DocumentationEntry>>> =
  new Map<DocumentUri, Map<string, Map<string, DocumentationEntry>>>()

const ds = builtinDocs(idGenerator)
const loadedBuiltInDocs = ds.isRight() ? ds.value : undefined

connection.onInitialize((_params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      hoverProvider: true,
      signatureHelpProvider: {
        triggerCharacters: ['('],
      },
      definitionProvider: true,
      codeActionProvider: true,
    },
  }
  return result
})

// Only keep information for open documents
documents.onDidClose(e => {
  parsedDataByDocument.delete(e.document.uri)
  docsByDocument.delete(e.document.uri)
  analysisOutputByDocument.delete(e.document.uri)
})

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
  console.log('File content changed, checking types and effects again')

  parseDocument(change.document).then((result) => {
    parsedDataByDocument.set(change.document.uri, result)
    docsByDocument.set(change.document.uri, new Map(result.modules.map(m => [m.name, produceDocs(m)])))

    const analyzer = new QuintAnalyzer(result.table)
    result.modules.forEach(module => analyzer.analyze(module))
    const [errors, analysisOutput] = analyzer.getResult()

    analysisOutputByDocument.set(change.document.uri, analysisOutput)

    const diagnostics = diagnosticsFromErrors(errors, result.sourceMap)
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics })
  }).catch(diagnostics => {
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics })
  })
})

connection.onHover((params: HoverParams): Hover | undefined => {
  function inferredDataHover(): string[] {
    const parsedData = parsedDataByDocument.get(params.textDocument.uri)
    const analysisOutput = analysisOutputByDocument.get(params.textDocument.uri)
    if (!parsedData || !analysisOutput) {
      return []
    }

    const typeResult = findBestMatchingResult(
      parsedData.sourceMap, [...analysisOutput.types.entries()], params.position
    )
    const effectResult = findBestMatchingResult(
      parsedData.sourceMap, [...analysisOutput.effects.entries()], params.position
    )

    // There are cases where we have types but not effects, but not the other way around
    // Therefore, we only check for typeResult here and handle missing effects later
    // As if there are no types, there are no effects either
    if (!typeResult) {
      return []
    }

    const [loc, type] = typeResult

    const document = documents.get(params.textDocument.uri)!
    const text = document.getText(locToRange(loc))

    let hoverText = ["```qnt", text, "```", '']

    hoverText.push(`**type**: \`${typeSchemeToString(type)}\`\n`)

    if (effectResult) {
      const [, effect] = effectResult
      hoverText.push(`**effect**: \`${effectSchemeToString(effect)}\`\n`)
    }

    return hoverText
  }

  function documentationHover(): string[] {
    const parsedData = parsedDataByDocument.get(params.textDocument.uri)
    if (!parsedData) {
      return []
    }

    const { modules, sourceMap } = parsedData
    const results: [Loc, bigint][] = [...sourceMap.entries()].map(([id, loc]) => [loc, id])
    const [module, name, _id] = findName(modules, results, params.position) ?? [undefined, undefined, undefined]
    if (!name) {
      return []
    }

    const signature = docsByDocument.get(params.textDocument.uri)?.get(module.name)?.get(name)
      ?? loadedBuiltInDocs?.get(name)!
    if (!signature) {
      return []
    }

    let hoverText = ["```qnt", signature.label, "```", '']
    if (signature.documentation) {
      hoverText.push(signature.documentation)
    }
    return hoverText
  }

  const hoverText = [inferredDataHover(), documentationHover()]
    .filter(s => s.length > 0)
    .map(s => s.join('\n'))
    .join('\n-----\n')

  if (hoverText === '') {
    return undefined
  }

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: hoverText,
    },
  }
})

connection.onSignatureHelp((params: SignatureHelpParams): HandlerResult<SignatureHelp, void> => {
  const emptySignatures = { signatures: [], activeSignature: 0, activeParameter: 0 }

  const parsedData = parsedDataByDocument.get(params.textDocument.uri)
  if (!parsedData) {
    return emptySignatures
  }

  // Find name under cursor
  const { modules, sourceMap } = parsedData
  const results: [Loc, bigint][] = [...sourceMap.entries()].map(([id, loc]) => [loc, id])
  const [module, name, _scope] = findName(modules, results, params.position) ?? [undefined, undefined, undefined]
  if (!name) {
    return emptySignatures
  }

  const signature = docsByDocument.get(params.textDocument.uri)?.get(module.name)?.get(name)
    ?? loadedBuiltInDocs?.get(name)!
  const signatureWithMarkupKind = signature?.documentation
    ? { ...signature, documentation: { kind: 'markdown', value: signature.documentation } as MarkupContent }
    : signature

  return {
    signatures: [signatureWithMarkupKind],
    activeSignature: 0,
    activeParameter: 0,
  }
})

connection.onDefinition((params: DefinitionParams): HandlerResult<Location[], void> => {
  const parsedData = parsedDataByDocument.get(params.textDocument.uri)
  if (!parsedData) {
    return []
  }

  // Find name under cursor
  const { modules, sourceMap, table } = parsedData
  const results: [Loc, bigint][] = [...sourceMap.entries()].map(([id, loc]) => [loc, id])
  const [_module, name, id] = findName(modules, results, params.position) ?? [undefined, undefined, undefined]
  if (!name) {
    return []
  }

  // Find definition of name
  const def = table.get(id)
  if (!def || !def.reference) {
    return []
  }

  const loc = sourceMap.get(def.reference)
  if (!loc) {
    return []
  }

  const range = locToRange(loc)

  // Definitions start with a qualifier
  // This finds where the definition name actually starts
  // and corrects the range
  const text = documents.get(params.textDocument.uri)!.getText(range)
  const unqualifiedName = name.split('::').pop()!
  const start = text.search(new RegExp(unqualifiedName))
  return [{
    uri: params.textDocument.uri,
    range: { ...range, start: { ...range.start, character: range.start.character + start } },
  }]
})

connection.onCodeAction((params: CodeActionParams): HandlerResult<CodeAction[], void> => {
  return params.context.diagnostics.reduce((actions, diagnostic) => {
    const data = diagnostic.data as QuintErrorData
    const fix = data.fix

    switch (fix?.kind) {
      case 'replace': {
        const document = documents.get(params.textDocument.uri)!
        // For now, we try to apply the fix only for the first line in the range
        // which should be the most common case
        const lineNum = params.range.start.line
        const line = document.getText({
          start: { line: lineNum, character: 0 },
          end: { line: lineNum + 1, character: 0 },
        })

        const matchResult = line.match(new RegExp(fix.original))
        if (!matchResult) {
          return actions
        }

        const editRange = {
          ...diagnostic.range,
          end: {
            line: diagnostic.range.start.line,
            character: diagnostic.range.start.character + matchResult![0].length,
          },
        }

        const action: CodeAction = {
          title: `Replace ${fix.original} with ${fix.replacement}`,
          kind: CodeActionKind.QuickFix,
          isPreferred: true,
          diagnostics: [diagnostic],
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: editRange,
                newText: fix.replacement,
              }],
            },
          },
        }

        actions.push(action)
      }
    }

    return actions
  }, [] as CodeAction[])
})

async function parseDocument(textDocument: TextDocument): Promise<ParserPhase2> {
  const text = textDocument.getText()

  const result = parsePhase1(idGenerator, text, textDocument.uri)
    .chain(phase1Data => parsePhase2(phase1Data))
    .mapLeft(messages => messages.flatMap(msg => {
      // TODO: Parse errors should be QuintErrors
      const error: QuintError = { code: 'QNT000', message: msg.explanation, data: {} }
      return msg.locs.map(loc => assembleDiagnostic(error, loc))
    }))

  if (result.isRight()) {
    return new Promise((resolve, _reject) => resolve(result.value))
  } else {
    return new Promise((_resolve, reject) => reject(result.value))
  }
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection)

// Listen on the connection
connection.listen()
