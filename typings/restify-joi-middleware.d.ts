declare module 'restify-joi-middleware' {
  import * as restify from 'restify';
  import * as restifyErrors from 'restify-errors';
  import * as Joi from 'joi';

  function RJM(joiOptions?: RJM.JoiOptions, options?: RJM.Options): RJM.JoiMiddleware

  namespace RJM {
    interface JoiMiddleware extends restify.RequestHandler {
      new (options: JoiOptions): restify.RequestHandler
    }

    interface JoiOptions extends Joi.ValidationOptions {
      convert?: boolean
      allowUnknown?: boolean
      abortEarly?: boolean
    }

    interface Options {
      keysToValidate?: Array<string>
      errorTransformer?: (validationInput: any, joiError: Joi.ValidationError) => restifyErrors.BadRequestError
      errorResponder?: (transformedErr: any, req: restify.Request, res: restify.Response, next: restify.Next) => Function
    }

  }

  export = RJM
}
