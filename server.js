'use strict'

const path = require('path')
const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(path.join(__dirname, './'))
  .fireHttpServer()
  .catch(console.error)
