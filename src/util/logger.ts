import chalk from 'chalk'
import environment from '../environment'

export default class Logger {
  static debug(args: any) {
    if (environment.DEBUGGING)
      console.log(
        chalk.green(`[${new Date().toLocaleString()}] [DEBUG] -`),
        typeof args === 'string' ? chalk.greenBright(args) : args
      )
  }
  static log(args: any) {
    console.log(
      chalk.green(`[${new Date().toLocaleString()}] [LOG] -`),
      typeof args === 'string' ? chalk.greenBright(args) : args
    )
  }
  static info(args: any) {
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO] -`),
      typeof args === 'string' ? chalk.blueBright(args) : args
    )
  }
  static warn(args: any) {
    if (args?.stack) {
      let lines: string[] = args.stack.split('\n')
      console.log(
        chalk.yellow(`[${new Date().toLocaleString()}] [ERROR] -`),
        chalk.yellowBright(`${lines.splice(0, 1)[0]}`)
      )
      for (let line of lines) console.log(chalk.yellowBright(line))
    } else {
      console.log(
        chalk.yellow(`[${new Date().toLocaleString()}] [WARN] -`),
        typeof args === 'string' ? chalk.yellowBright(args) : args
      )
    }
  }
  static error(args: any) {
    if (args?.stack) {
      let lines: string[] = args.stack.split('\n')
      console.log(
        chalk.red(`[${new Date().toLocaleString()}] [ERROR] -`),
        chalk.redBright(`${lines.splice(0, 1)[0]}`)
      )
      for (let line of lines) console.log(chalk.redBright(line))
    } else
      console.log(
        chalk.red(`[${new Date().toLocaleString()}] [ERROR] -`),
        typeof args === 'string' ? chalk.redBright(args) : args
      )
  }
}
