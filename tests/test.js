/* globals describe, before, it */
const hasha = require('hasha');
const should = require('should')
const v4 = require('uuid/v4');
const scrypt = require('scrypt')
// ESS Modules & Classes
const DotEnv = require('../app/dotenv')
const ApplicationDB = require('../app/db/application')
const AuthDB = require('../app/db/auth')

describe('electron-stats-server (ESS) tests', () => {
  // Start ESS server
  // require('../app/app')
  var appDB
  var appuuid = v4()
  var appid = undefined
  var appInfo = {}
  var authPrivateKey = undefined

  /*-----------------------------*
   * Class: DotEnv
   *-----------------------------*/
  describe('.env ( Class:DotEnv )', () => {
    const denv = new DotEnv.default()

    it('dotEnv: string - .env File Path', () => { denv.dotEnv });
    it('dotEnvBak: string - .env.bak File Path', () => { denv.dotEnvBak });
    it('dotEnvTemplate: string - .envTemplate Path', () => { denv.dotEnvTemplate });

    it('doesFileExist(): boolean', () => {
      should(denv.doesFileExist(denv.dotEnv)).be.Boolean()
    });
    it('generateDotEnv(): void', () => {
      let envExists = denv.doesFileExist(denv.dotEnv)
      // Just test that function exists
      should(denv.generateDotEnv).be.Function()
    });
    it('updateFile(): void', () => {
      // Just test that function exists
      should(denv.updateFile).be.Function()
    });
    it('readFile(): string', () => {
      // Just test that function exists
      should(denv.readFile).be.Function()
    });
    it('writeFile(): void', () => {
      // Just test that function exists
      should(denv.writeFile).be.Function()
    });
  });

  /*-----------------------------*
   * Class: ApplicationDB
   *-----------------------------*/
  describe('db => Application ( Class:ApplicationDB )', () => {
    const appDB = new ApplicationDB.default()

    it('async add() => Add Application to DB', async () => {
      appid = await appDB.add('Test App', appuuid)
      should(appid).be.a.Number()
    });
    it('async get() => Get added Application from DB', async () => {
      appInfo = await appDB.get(appuuid, 1)
      should(appInfo).be.an.Object()
    });
  });

  /*-----------------------------*
   * Class: AuthDB
   *-----------------------------*/
  describe('db => Authentication ( Class:AuthDB )', () => {
    const authDB = new AuthDB.default()

    it('async add() => Add application authentication key', async () => {
      authPrivateKey = hasha(v4())
      let salted = await scrypt.kdf(new Buffer(authPrivateKey), { N: 1, r: 1, p: 1 })

      // Generate new and associate
      return await authDB.add(
        appid,
        salted.toString('base64'),
        365
      )
    });
    it('async validate() => Validate newly added auth record', async () => {
      let valid = await authDB.validate(appuuid, authPrivateKey)
      should(valid).be.True()
    });
  });
});