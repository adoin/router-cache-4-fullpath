'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue-smart-router.prod.cjs')
} else {
  module.exports = require('./dist/vue-smart-router.cjs')
}
