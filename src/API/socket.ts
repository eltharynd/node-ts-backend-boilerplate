import * as socketIO from 'socket.io'
import { Server } from 'http'
import { TestHooks } from './hooks/test.hooks'

export class Socket {
  io: socketIO.Server
  private connections: socketIO.Socket[] = []

  constructor(server: Server) {
    this.io = new socketIO.Server(server, {
      path: '/api/socket.io',
      transports: ['websocket', 'polling'],
    })
  }

  async bindEvents() {
    this.io.on('connect', (socket: socketIO.Socket) => {
      this.connections.push(socket)
      //console.debug(`Client connected with id ${socket.id}...`)

      new TestHooks(this.io, socket)

      //THIS IS WHERE YOUR CUSTOM ROUTE CONTROLLERS GO

      //END

      socket.on('disconnect', () => {
        this.connections.splice(this.connections.indexOf(socket), 1)
        //console.debug(`Client with id ${socket.id} disconnected...`)
      })
    })
  }
}
