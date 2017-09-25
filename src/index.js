const express = require('express')
const dir = require('require-dir')
const is = require('is')

/**
 * @param {string} path path of folder with routers for express.js
 * @returns {express.Router}
 */
module.exports = (path, recursive = false) => {
  /**
   * @type {{ [ key: number ]: Function }}
   */
  const routes = dir(path, { recursive })

  /**
   * @type {express.Router}
   */
  const middleware = express()

  // load routes into express instance
  for (const namespace of Object.keys(routes)) {
    /**
    * @type {string}
    */
    const path = `/${namespace}`.toLowerCase()

    /**
     * @type {Function}
     */
    let route = routes[ namespace ].default

    // check if middleware is valid
    if (!is.function(route)) {
      throw new Error(`${namespace} not is an valid middleware`)
    }

    if (/^\s*class\s+/.test(route.toString())) {
      const instance = new route()

      if ('didMount' in instance) {
        route = instance.didMount()
      }

      if ('router' in instance) {
        route = instance.router()
      }
    }

    // put middleware in express
    middleware.use(path, route)
  }

  // returns all routes loaded
  return middleware
}
