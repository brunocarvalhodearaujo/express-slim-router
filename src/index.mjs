import { Router } from './Router'

/**
 * autoload for routes
 *
 * @param {{ cwd?: string|RegExp, verbose: boolean, logger: object, extensions: string[] }} options
 */
export default function (options) {
  return new Router(options)
}
