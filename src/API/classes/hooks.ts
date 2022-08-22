import { Server, Socket } from 'socket.io'

export abstract class Hooks {
  constructor(io: Server, socket: Socket) {
    this.bindHooks(io, socket)
  }

  abstract bindHooks(io: Server, socket: Socket)
}
