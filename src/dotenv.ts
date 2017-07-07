import * as fs from 'fs';
import * as path from 'path';

export default class DotEnv {
  public dotEnv: string
  public dotEnvBak: string
  public dotEnvTemplate: string

  constructor() {
    this.dotEnv = path.join(__dirname, '../', '.env')
    this.dotEnvBak = path.join(__dirname, '../', '.env.bak')
    this.dotEnvTemplate = path.join(__dirname, '../', '.envTemplate')
  }

  public doesFileExist(override?: string): boolean {
    try {
      fs.statSync(override || this.dotEnv)
      return true
    } catch (error) {
      return false
    }
  }

  public readFile(file: string): string {
    try {
      return fs.readFileSync(file).toString()
    } catch (error) {
      throw error
    }
  }

  public writeFile(file: string, data: any) {
    return fs.writeFileSync(file, data)
  }

  public generateDotEnv() {
    return this.writeFile(this.dotEnv, this.readFile(this.dotEnvTemplate))
  }

  public updateFile(file: string, data: Object[], updateMode: boolean) {
    var fileContents = this.readFile(file)

    // Loop through updates array & perform replaces
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var value = data[key];
        var regex = new RegExp('^(' + key + '=)(.*)$', 'gm')
        // Update mode (Value's already set)
        fileContents = fileContents.replace(regex, `$1${value}`)
      }
    }

    return this.writeFile(file, fileContents)
  }
}