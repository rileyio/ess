import * as restify from 'restify';

export default class Controller {
  protected server: restify.Server

  constructor(_server: restify.Server) {
    this.server = _server
  }
}