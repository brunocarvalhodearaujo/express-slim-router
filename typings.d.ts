interface Router {
  load(dirname: string): this
  into(object: any): this
}

export declare function router (options: { cwd: string, verbose?: boolean, logger?: object, extensions?: string[] }): Router
