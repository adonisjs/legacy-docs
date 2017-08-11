'use strict'

const _ = require('lodash')
const { hooks } = require('@adonisjs/ignitor')
const fs = require('fs')
const asciidoctor = require('asciidoctor.js')()

const DEFAULTS = {
  doctype: 'article',
  attributes: ['icons=font', 'skip-front-matter=true', 'sectlinks', 'sectanchors', 'linkattrs', 'toc=macro', 'toclevels=1']
}

hooks.after.providersRegistered(() => {
  const View = use('Adonis/Src/View')
  View.global('humanize', (input) => {
    return _.upperFirst(input.replace(/-(\w)/, (group, word) => {
      return ` ${word.toUpperCase()}`
    }))
  })

  class AsciiDocTag extends View.engine.BaseTag {
    get tagName () {
      return 'adoc'
    }

    get isBlock () {
      return false
    }

    get allowedExpressions () {
      return ['Literal', 'Identifier', 'MemberExpression']
    }

    compile (compiler, lexer, buffer, { body, childs, lineno }) {
      const compiledStatement = this._compileStatement(lexer, body, lineno).toStatement()
      buffer.writeToOutput(`\${this.context.renderAdoc(${compiledStatement})\}`, false)
    }

    run (context) {
      context.macro('renderAdoc', (input) => {
        const fileContents = fs.readFileSync(input, 'utf-8')
        const output = asciidoctor.load(fileContents, DEFAULTS)
        return output.convert()
      })
    }
  }

  View.global('json', (input) => JSON.stringify(input))
  View.engine.tag(new AsciiDocTag())
})
