const express = require('express')
const dir = require('require-dir')
const is = require('is')

/**
 * @param {string} path path of folder with routers for express.js
 * @returns {express.Router}
 */
module.exports = function (path) {
  /**
   * @type {{ [ key: number ]: Function }}
   */
  const routes = dir(path, { recursive: true })
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
    const route = routes[ namespace ].default
    // check if middleware is valid
    if (!is.function(route)) {
      throw new Error(`${namespace} not is an valid middleware`)
    }
    /**
     * @type {Function}
     */
    const handler = /^\s*class\s+/.test(route.toString()) ? new route().router() : route()
    // put middleware in express
    middleware.use(path, handler)
  }
  // returns all routes loaded
  return middleware
}
