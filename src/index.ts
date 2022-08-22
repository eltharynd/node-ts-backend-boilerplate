import { Mongo } from './db/mongo'
import * as fs from 'fs'
import { Express } from './API/express'
import { Socket } from './API/socket'
import environment from './environment'

let startApp = async () => {
  if (!fs.existsSync('.env')) {
    console.error(
      `Couldn't load environment configuration. Make sure you created the appropriate .env file...`
    )
    return process.exit(-1)
  }

  let mongo: Mongo

  let gracefulClose = async () => {
    try {
      console.info('GRACEFULLY QUITTING APPLICATION...')

      //SAFE CLOSE
      if (mongo) await mongo.disconnect()

      console.info('GRACEFULLY CLOSED APPLICATION...')
      process.exit(0)
    } catch (error) {
      console.error('COULD NOT GRACEFULLY CLOSE APPLICATION...')
      console.error(error)
    }
  }
  process.on('SIGINT', gracefulClose)
  process.on('SIGTERM', gracefulClose)

  try {
    console.info('STARTING APPLICATION...')

    console.info('CONNECTING TO DATABASE...')
    mongo = new Mongo()
    await mongo.connect(environment.test)

    console.info('STARTING EXPRESS SERVER...')
    let express: Express = new Express()
    await express.start()

    console.info('STARTING WEBSOCKET SERVER...')
    let socket: Socket = new Socket(express.server)
    await socket.bindEvents()

    console.info('APPLICATION STARTED SUCCESSFULLY...')
  } catch {
    console.error('APPLICATION COULD NOT BE STARTED...')
    gracefulClose()
  }
}
startApp()
