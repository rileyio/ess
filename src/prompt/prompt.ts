import * as inquirer from 'inquirer';

export class Prompt {
  public questions: inquirer.Questions = []
  // public stepMap: any = {}

  constructor(questions: inquirer.Questions) {
    this.questions = questions
  }

  protected async exit(timeout?: number) {
    await setTimeout(function () {
      process.exit(0)
    }, timeout || 0);
  }

  protected sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  protected complete(ret: ESS.CLIResponse) {
    if (ret.error) {
      throw new Error(ret.message)
    }

    return ret
  }

}