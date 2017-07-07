import * as inquirer from 'inquirer';
import * as utils from '../utils';
import { Prompt } from './prompt';
import { Env } from './env';
import { DBMgr } from './dbmgr';
import DotEnv from '../dotenv';

export class Index extends Prompt {
  protected Env: Env
  protected dotEnv: DotEnv
  protected dbMgr: DBMgr

  constructor() {
    super([])

    this.Env = new Env()
    this.dotEnv = new DotEnv()
    this.dbMgr = new DBMgr()
  }

  private buildOptions() {
    let defaultOpts: Array<string> = [];

    // Add option for .env exists
    if (this.dotEnv.doesFileExist()) {
      defaultOpts.push(
        'Test database connection',
        'Manage Application Database'
      )
    }
    else {
      defaultOpts.push(
        'Setup .env (new install)'
      )
    }
    // Add option for a .bak existing
    if (this.dotEnv.doesFileExist(this.dotEnv.dotEnvBak)) {
      defaultOpts.push('Load .env settings from .bak')
    }

    // Add exit option
    defaultOpts.push('Exit')

    this.questions = [
      {
        type: 'list',
        name: 'index',
        message: 'What would you like to do?',
        choices: defaultOpts
      }
    ]
  }

  protected async next(prev: inquirer.Answers) {
    console.log('prev:', prev)

    switch (prev.index) {
      case 'Setup .env (new install)':
        console.log('Setup .env (new install)')
        return this.complete(await this.Env.setup())

      case 'Load .env settings from .bak':
        console.log('Loading .env settings from .bak..')
        return this.complete(this.Env.useDotBak())

      case 'Test database connection':
        return this.complete(await utils.testDBConnection())

      case 'Manage Application Database':
        return this.complete(await this.dbMgr.menu())

      case 'Exit':
        this.exit(2000)
        console.log(`\nGood Bye! ^_^\n`)
        await this.sleep(2001)

      default:
        break;
    }
  }

  /**
   * start
   */
  public async start() {
    // If .env detected then add additonal options
    this.buildOptions()

    let answers = await inquirer.prompt(this.questions)
    let n = await this.next(answers)
      .then(ret => {
        console.log(`\n${ret.message}\n\n`)
      })
      .catch(err => {
        console.log(`\n${err}\n\n`)
      })

    await this.sleep(2000)
    await this.start()
  }
}