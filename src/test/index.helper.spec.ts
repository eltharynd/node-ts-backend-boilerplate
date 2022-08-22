import { createServer } from 'http'
import { Express } from '../API/express'
import { Socket } from '../API/socket'

beforeAll((done) => {
  try {
    const express = new Express()
    global.app = express.app

    const httpServer = createServer()
    httpServer.listen(() => {
      global.socket = new Socket(httpServer)
      global.socket.bindEvents()
      //@ts-ignore
      global.socketPort = httpServer.address().port
      setTimeout(() => {
        done()
      }, 500)
    })
  } catch (e) {
    done.fail(e)
  }
})
