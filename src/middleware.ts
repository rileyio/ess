import * as restify from 'restify';
import AuthDB from './db/auth';

export function authenticate(authDB: AuthDB) {
  return async (req: restify.Request, res: restify.Response, next: restify.Next) => {
    // Client header (detect if being sent from ESS Client)
    let authReq = new AuthenticationRequest(req, authDB)
    let valid = await authReq.validate(authReq.authenticationKey, authReq.applicationId)

    console.log(`
    client: ${authReq.client}
    clientIsES: ${authReq.clientIsES}
    clientId: ${authReq.clientId}
    submitRequest: ${authReq.submitRequest}
    hasAuthenticationKey: ${authReq.hasAuthenticationKey}
    authenticationKey: ${authReq.authenticationKey.length}
    valid:`, valid)

    // INValid, halt auth of request
    if (!valid) return next(new restify.NotAuthorizedError())

    // Ensure machine ID passed
    if (!authReq.clientId) return next(new restify.NotAuthorizedError())

    // Valid, move on
    return next()
  }
}

class AuthenticationRequest {
  protected AuthDB: AuthDB
  // Client headers
  public readonly client: string
  public readonly clientIsES: boolean
  public readonly clientId: string
  // Route
  public readonly submitRequest: boolean
  // App
  public readonly hasAppId: boolean
  public readonly applicationId: string
  // Auth
  public readonly hasAuthenticationKey: boolean
  public readonly authenticationKey: string
  public readonly validAuthentication: string

  constructor(req: restify.Request, AuthDB: AuthDB) {
    this.AuthDB = AuthDB
    this.client = req.header('User-Agent')
    this.clientIsES = (this.client === 'es-client')
    this.submitRequest = (req.path() === '/submit')
    // App
    this.hasAppId = (req.header('ESS-App') !== undefined)
    this.applicationId = req.header('ESS-App')
    // Auth
    this.hasAuthenticationKey = (req.header('ESS-Auth') !== undefined)
    this.authenticationKey = req.header('ESS-Auth')
    this.clientId = req.header('ESS-Client-ID')
    // this.validAuthentication = this.validateAuthenticationKey(this.authenticationKey, this.applicationId)
    // this.validateAuthenticationKey(this.authenticationKey, this.applicationId)
    //   .then(console.log)
    //   .then(console.error)
  }

  public validate(key: string, appuuid: string) {
    return this.AuthDB.validate(appuuid, key)
  }
}