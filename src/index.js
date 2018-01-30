import fs from 'fs'
import path from 'path'
import console from 'console'

/**
 * script autoload
 *
 * @typedef {{ cwd?: string|RegExp, verbose: boolean, logger: object, extensions: string[] }} Options
 */
export class Router {
  /**
   * @param {Options} options
   */
  constructor (options) {
    this.options = {
      cwd: process.cwd(),
      verbose: false,
      logger: console,
      extensions: [ 'js', 'mjs' ],
      ...options
    }
    /**
     * @type {string[]}
     */
    this.files = [ ]
  }

  /**
   * Log handler.
   *
   * @param {string|string[]} message
   * @param {string} [type]
   */
  log (message, type = 'info') {
    if (this.options.verbose) {
      message = typeof message === 'string'
        ? message
        : message.join(' ')

      this.options.logger[ type ](message)
    }

    return this
  }

  /**
   * @param {string} dirname
   * @returns {this}
   */
  when (dirname) {
    const location = path.join(this.options.cwd, dirname)

    if (!fs.existsSync(location)) {
      this.log(`Entity not found ${location}`, 'error')
      return this
    }

    if (!fs.statSync(location).isDirectory()) {
      this.log(`${location} not is an folder`, 'error')
      return this
    }

    for (const filename of fs.readdirSync(location)) {
      const [ extension ] = /[^.]+$/.exec(filename)

      if (!this.options.extensions.includes(extension)) {
        this.log(`Ignoring extension: ${extension}`)
        continue
      }

      if (filename.charAt(0) === '.') {
        this.log(`Ignoring hidden entity: ${filename}`)
        continue
      }

      this.files.push(path.join(location, filename))
    }

    return this
  }

  /**
   * Get relative to location.
   *
   * @param {string} location
   * @returns {string[]}
   */
  getRelativeTo (location) {
    return '.' + location.split(this.options.cwd).pop()
  }

  /**
   * @param {string} name
   */
  getKeyName (name) {
    return path.basename(name, path.extname(name))
  }

  /**
   * Into method
   *
   * @param {string} uri
   * @param {{ use: (uri: string, ...callback: function) => this }} object
   * @returns {this}
   */
  into (object) {
    for (const file of this.files) {
      const parts = this.getRelativeTo(file)
        .split(path.sep)
        .slice(1)

      try {
        var mod = Object.values(require(file))
      } catch (error) {
        throw new Error(`Failed to require ${file} because: ${error.message}`)
      }

      for (const i of mod) {
        if (typeof i !== 'function') {
          throw new Error('module requires an function')
        }

        if (/^\s*class\s+/.test(i.toString())) {
          const instance = new (mod[ mod.indexOf(i) ])() // eslint-disable-line

          if ('didMount' in instance) {
            mod[ mod.indexOf(i) ] = instance.didMount.apply(instance)
          }
        }

        this.log(`loaded: ${parts[ parts.length - 1 ]}`)

        const uri = '/'.concat(this.getKeyName(parts.pop()).toLowerCase())

        object.use(uri, mod)
      }
    }

    return this
  }
}

/**
 * @param {Options} options
 */
export default function (options = {}) {
  return new Router(options)
}
