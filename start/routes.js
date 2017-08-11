'use strict'

const _ = require('lodash')
const Route = use('Route')
const Helpers = use('Helpers')

Route.get('/guides/:permalink', async ({ params, view, request }) => {
  if (process.env.NODE_ENV === 'development') {
    require('clear-require')(Helpers.tmpPath('menu'))
  }
  const menu = require(Helpers.tmpPath('menu'))
  const menuForPermalink = menu.find((item) => item.permalink === params.permalink)
  const menuGroup = _.groupBy(menu, 'category')
  return view.render('docs', { doc: menuForPermalink, menu: menuGroup })
})

Route.on('/').render('home')
