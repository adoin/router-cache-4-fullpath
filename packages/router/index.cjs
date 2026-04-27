'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue-x-router.prod.cjs')
} else {
  module.exports = require('./dist/vue-x-router.cjs')
}
