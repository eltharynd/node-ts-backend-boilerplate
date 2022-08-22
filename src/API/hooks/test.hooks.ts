import { Server, Socket } from 'socket.io'
import { Hooks } from '../classes/hooks'

export class TestHooks extends Hooks {
  bindHooks(io: Server, socket: Socket) {
    socket.on('test', (data) => {
      socket.emit('A message to the asking socket...')
      socket.broadcast.emit('message', {
        message: 'A message to all other sockets...',
      })
      io.emit('test', { message: 'A message to all sockets...' })

      socket.join('A room')
      io.to('A room').emit('test', { message: 'A message within "A room"' })
      socket.leave('A room')
    })
  }
}
