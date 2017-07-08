declare module 'restify-cors-middleware' {
  import * as restify from 'restify';

  function RCM(options: RCM.Options): RCM.corsMiddleware

  namespace RCM {
    interface corsMiddleware {
      actual(): restify.RequestHandler
      preflight(): restify.RequestHandler
    }

    interface Options {
      preflightMaxAge?: number,
      origins?: Array<string>,
      allowHeaders?: Array<string>,
      exposeHeaders?: Array<string>
    }
  }

  export = RCM
}