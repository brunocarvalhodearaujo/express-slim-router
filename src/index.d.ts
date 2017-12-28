export declare class Router {
  constructor(params: { cwd: string, verbose?: boolean, logger?: object, extensions?: string[] })
  when(dirname: string): this
  into(handler: (uri: string, ...callback: function) => void): this
}

export default function (params: { cwd: string, verbose?: boolean, logger?: object, extensions?: string[] }): Router
