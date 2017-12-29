import fs from 'fs'
import path from 'path'
import console from 'console'

/**
 * script autoload
 */
class Router {
  /**
   * @param {{ cwd?: string|RegExp, verbose: boolean, logger: object, extensions: string[] }} options
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
    this.files = []
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
  async into (object) {
    for (const script of this.files) {
      const parts = this.getRelativeTo(script)
        .split(path.sep)
        .slice(1)

      try {
        let mod = await import(script)
          .then(T => Object.values(T).shift())

        if (typeof mod === 'function') {
          if (/^\s*class\s+/.test(mod.toString())) {
            const instance = new mod() // eslint-disable-line

            if ('didMount' in instance) {
              mod = instance.didMount.apply(instance)
            }
          }

          this.log(`loaded: ${parts[ parts.length - 1 ]}`)
          // inject handler
          object.use('/' + this.getKeyName(parts.pop()).toLowerCase(), mod)
        }
      } catch (error) {
        throw new Error(`Failed to require: ${script}, because: ${error.message}`)
      }
    }

    return this
  }
}

export default (options = {}) => new Router(options)
