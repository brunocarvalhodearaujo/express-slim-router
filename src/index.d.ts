export declare class Router {
  constructor(params: { cwd: string, verbose?: boolean, logger?: object, extensions?: string[] })
  when(dirname: string): this
  into(object: any): this
}

export default function (params: { cwd: string, verbose?: boolean, logger?: object, extensions?: string[] }): Router
