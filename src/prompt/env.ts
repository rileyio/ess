import * as inquirer from 'inquirer';
import { Prompt } from './prompt';
import DotEnv from '../dotenv';

export class Env extends Prompt {
  constructor() {
    super([])
  }

  private async verifyOverWrite(): Promise<boolean> {
    return await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: '.env already existed, Overwrite?',
        default: false
      }
    ]).then(answer => { return answer.confirm })
  }

  /**
   * setup - New Install
   */
  public async setup(): Promise<ESS.ClIDotEnvSetupResponse> {
    let answers = await inquirer.prompt([
      {
        name: 'DB_TYPE',
        type: 'list',
        message: 'Database type',
        choices: [
          'mysql',
          'sqlite'
        ],
      },
      {
        name: 'DB_HOST',
        type: 'input',
        message: 'Host/IP',
        default: '127.0.0.1'
      },
      {
        name: 'DB_PORT',
        type: 'input',
        message: 'Port',
        default: 3306
      },
      {
        name: 'DB_NAME',
        type: 'input',
        message: 'Database name',
        default: 'ess'
      },
      {
        name: 'DB_USER',
        type: 'input',
        message: 'Database user'
      },
      {
        name: 'DB_PASS',
        type: 'password',
        message: `Database user's password`
      }
    ])
    let dotenv = new DotEnv()

    // Check if .env already exists
    let doesExist = dotenv.doesFileExist()
    // Generate file if not
    if (!doesExist) { dotenv.generateDotEnv() }
    // If .env already existed, verify to prevent any overwriting
    if (doesExist) {
      let overwrite = await this.verifyOverWrite()
      if (!overwrite) return {
        message: `.env successfully generated!`,
        env_file: answers, env_file_overwrite: overwrite
      }
    }
    // For each answer update .env perform file write/update
    dotenv.updateFile(dotenv.dotEnv, <Object[]>answers, doesExist)

    return {
      message: `.env updated!`,
      env_file: answers, env_file_overwrite: true
    }
  }

  /**
   * useDotBak - Uses .bak as new .env file
   */
  public useDotBak() {
    let dotenv = new DotEnv()
    let bak = dotenv.readFile(dotenv.dotEnvBak)
    // Write .env from .bak
    dotenv.writeFile(dotenv.dotEnv, bak)

    return {
      message: `.env updated from .env.bak!`,
      env_file: {}, env_file_overwrite: false
    }
  }
}