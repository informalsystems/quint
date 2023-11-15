#!/usr/bin/env node

// A test script to make sure that our Ohmjs grammar conforms to the Antlr4
// grammar. Since we do not allow the user to parse files via Ohmjs directly,
// we have this script, for debugging purposes.

const fs = require('fs')
const quint = require('../src/generated/quint.ohm-bundle.js')
const filename = process.argv[2]
if (!filename) {
  console.error('Expected an input file as my first argument')
  process.exit(1)
}

const text = fs.readFileSync(filename, 'utf-8')
const m = quint.match(text)
if (m.failed()) {
  console.error(m.message)
  process.exit(2)
} else {
  // nothing to report
  process.exit(0)
}