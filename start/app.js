'use strict'

const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider'
]

const commands = [
  'App/Commands/CompileDoc'
]

module.exports = { providers, aceProviders: [], commands, aliases: {} }
