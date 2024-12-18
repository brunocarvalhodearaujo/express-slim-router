/**
 * Copyright (c) 2020-present, Bruno Carvalho de Araujo.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Console } from 'console'
import { Express, Router as ExpressRouter, Request, Response, NextFunction } from 'express'

export type Options = {
  cwd: string | RegExp,
  verbose?: boolean,
  logger?: Console,
  extensions?: string[],
  withNamespace?: boolean
}

interface Router {
  when (path: string): Router,
  withExtraArgument (...extraArgument: any): Router,
  into (app: Express | ExpressRouter): Router
}

export interface Route {
  index (): ExpressRouter | Express
}

export interface HttpFunction<P = any, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs> {
  (request: Request<P, ResBody, ReqBody, ReqQuery>, response: Response<ResBody>, next: NextFunction): void | Promise<void>;
}

declare function middleware (options?: Options): Router

export default middleware
