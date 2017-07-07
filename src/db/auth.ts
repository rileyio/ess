import Database from '../db';
const scrypt = require('scrypt')

export default class AuthDB extends Database {
  constructor() {
    super()
  }

  /**
   * 
   * 
   * @param {number} appid
   * @param {string} key random & hashed (hash stored)
   * @param {number} expires in number of days
   * @memberof AuthDB
   */
  public async add(appid: number, key: string, expires: number) {
    console.log(arguments)
    let expiryDate = new Date(new Date().setDate(new Date().getDate() + expires))
    await this.db
      .table(`auth`)
      .insert({ appid: appid, key: key, expires: expiryDate })
  }

  public async validate(appuuid: string, key: string): Promise<boolean> {
    let appAuths = await this.db
      .join(`applications`, `auth.appid`, `applications.appid`)
      .table(`auth`)
      .select('*')
      .where('applications.uuid', '=', appuuid)
      .andWhere('auth.enabled', '=', true)

      console.log(appAuths.length)
      console.log(appAuths)

    // If there are no results, return false to valid
    if (appAuths.length === 0) return false

    // Verify key against salted hash
    if (appAuths.length > 1) return this.validateMultiple(appAuths, key)
    // Verify key against salted hash (single)
    if (appAuths.length === 1) return this.validateSingle(appAuths, key)
  }

  private validateMultiple(array: Array<any>, key: string): boolean {
    console.log(`Auth->Validate found multiple [${array.length}], checking each`)

    for (var index = 0; index < array.length; index++) {
      var app = array[index];
      if (this.validateSingle(app, key, index)) return true
    }

    // Fallback, none valid, fail
    return false
  }

  private validateSingle(appAuth: any, key: string, index?: number): boolean {
    let valid = scrypt.verifyKdfSync(
      new Buffer(appAuth.key, 'base64'), new Buffer(key))

    console.log(`Auth->Validating (${index || 0}) === ${valid}`)
    return valid
  }
}