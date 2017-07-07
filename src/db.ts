import * as knex from 'knex';
import * as mysql from 'mysql2';

export default class Database {
  protected db: knex
  protected knexFile: any

  constructor() {
    // Require to hide any allowJS errors
    this.knexFile = require('../knexfile.js');
    this.db = knex(this.knexFile)
  }

  public async testConnection() {
    await this.db.raw('select 1+1 as result')
  }
}