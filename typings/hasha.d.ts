declare module 'hasha' {
  function Hasha(input: Array<Buffer> | Array<string> | Buffer | string, options?: Hasha.Options): string

  namespace Hasha {
    function fromFile(file: string, options?: Hasha.Options): Promise<string>
    function fromFileSync(file: string, options?: Hasha.Options): string
    function fromStream(file: string, options?: Hasha.Options): Promise<string>
    function stream(file: string, options?: Hasha.Options): Buffer

    interface Options {
      encoding?: string,
      algorithm?: string
    }
  }

  export = Hasha
}