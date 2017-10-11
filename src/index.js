const express = require('express')
const from = require('require-glob')

/**
 * @param {string} path
 * @returns {express.Router[]}
 */
module.exports = function router (path) {
  path = from.sync([ `${path}/**/*.js`, `!${path}/**/*.spec.js` ])
  const router = express()

  for (const routes of Object.values(path)) {
    for (const path in routes) {
      let route = routes[ path ]

      if (typeof route !== 'function') {
        throw new Error(`${path} not is an valid middleware`)
      }

      if (/^\s*class\s+/.test(route.toString())) {
        const instance = new route() // eslint-disable-line

        if ('didMount' in instance) {
          route = instance.didMount()
        }
      }

      router.use(`/${path}`.toLowerCase(), route)
    }
  }

  return router
}
