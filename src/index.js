const express = require('express')
const glob = require('require-glob')

/**
 * @param {string} path path of folder with routers for express.js
 * @returns {express.Router[]}
 */
module.exports = (path) => {
  const packages = glob.sync([ `${path}/**/*.js`, `!${path}/**/*.spec.js` ])
  const router = []

  for (const routes of Object.values(packages)) {
    for (const path of Object.keys(routes)) {
      let route = routes[ path ]

      if (typeof route !== 'function') {
        throw new Error(`${path} not is an valid middleware`)
      }

      if (/^\s*class\s+/.test(route.toString())) {
        const instance = new route() // eslint-disable-line

        if ('didMount' in instance) {
          route = instance.didMount()
        }

        if ('router' in instance) {
          route = instance.router()
        }
      }

      router.push([ `/${path}`.toLowerCase(), route ])
    }
  }

  return router.map(([ path, route ]) => express().use(path, route))
}
