import * as inquirer from 'inquirer';
import * as utils from '../utils';
import * as hasha from 'hasha';
import { Prompt } from './prompt';
import StatsDB from '../db/stats';
import ApplicationDB from '../db/application';
import AuthDB from '../db/auth';

const v4 = require('uuid/v4');
const scrypt = require('scrypt')

export class DBMgr extends Prompt {
  protected StatsDB: StatsDB = new StatsDB()
  protected ApplicationDB: ApplicationDB = new ApplicationDB()
  protected AuthDB: AuthDB = new AuthDB()

  constructor() {
    super([
      {
        name: 'dbmgr',
        type: 'list',
        message: 'Database type',
        choices: [
          'Generate auth key',
          'Register Application in db',
          'Unregister Application in db',
          'Show db stats',
          'Exit db manager'
        ],
      }
    ])
  }

  protected async dbStats(): Promise<ESS.CLIResponse> {
    return await this.StatsDB.getStats()
  }

  protected async regApplication(): Promise<ESS.CLIResponse> {
    let answers = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Application name'
      }
    ])
    let app = { name: answers.name, uuid: v4() }
    await this.ApplicationDB.add(app.name, app.uuid)

    return {
      message: `Application added to DB:
      app Name: ${app.name}
      app UUID: ${app.uuid}
    `}
  }

  protected async addAuthKey(): Promise<ESS.CLIResponse> {
    let applications = await this.ApplicationDB.getAll(0, 10)
    let answer = await inquirer.prompt([
      {
        name: 'name',
        type: 'list',
        message: 'Application to generate auth key for',
        choices: applications.map(app => { return app.name })
      },
      {
        name: 'expire',
        type: 'input',
        message: 'Number of days to expire (from now)',
        default: 365
      }
    ])
    let application = applications.find(app => { return app.name === answer.name })
    let clearText = hasha(v4())
    let salted = await scrypt.kdf(new Buffer(clearText), { N: 1, r: 1, p: 1 })
    
    // Generate new and associate
    await this.AuthDB.add(
      application.appid, 
      salted.toString('base64'),
      answer.expire
    )

    return {
      message: `New auth key generated!
      Key: ${clearText}

      !! Note: This will not be visible again or retrievable!
      `
    }
  }

  /**
   * registerApplication
   */
  public async menu() {
    let answers = await inquirer.prompt(this.questions)
    switch (answers.dbmgr) {
      case 'Generate auth key':
        return await this.addAuthKey()
      case 'Show db stats':
        return await this.dbStats()
      case 'Register Application in db':
        return await this.regApplication()
      case 'Exit db manager':
        return <ESS.CLIResponse>{ message: 'Exiting db manager..' }
    }
  }
}