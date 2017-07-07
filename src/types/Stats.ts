import Type from './Type';
import * as Joi from 'joi';


export default new Type({
  app: {
    version: Joi.string().required(),
    electron: Joi.string().required(),
    arch: Joi.string().required(),
  },
  cpu: {
    cores: Joi.number().required(),
    model: Joi.string().required(),
    speed: Joi.number().required()
  },
  os: {
    release: Joi.string().required(),
    platform: Joi.string().required(),
    memory: Joi.number().required()
  }
})