import socketIO, { Server, Socket } from 'socket.io'
import Logger from '../util/logger'
import { authpal } from './auth/auth.controller'
import { origins, server } from './express'

class Context {
  io: any
}
const context: Context = new Context()
export default context

export const connections = []
export const startSocket = async () => {
  context.io = new socketIO.Server(server, {
    path: '/api/socket.io',
    transports: ['websocket', 'polling'],
    cors: {
      origin: origins,
      optionsSuccessStatus: 200,
      credentials: true,
    },
  })
  context.io.use(globalAsyncErrorCatcher())
  setupListeners()
}

const setupListeners = () => {
  context.io.on('connect', async (socket: socketIO.Socket) => {
    connections.push(socket)
    Logger.debug(`Client connected with id ${socket.id}...`)

    putInUserRoom(socket)

    //TODO still need?
    if (socket.use)
      socket.use(async (event, next) => {
        putInUserRoom(socket)
        next()
      })

    TestHooks(context.io, socket)

    socket.on('disconnect', () => {
      if (socketIO) connections.splice(connections.indexOf(socket), 1)
      Logger.debug(`Client with id ${socket.id} disconnected...`)
    })
  })
}

const putInUserRoom = async (socket: socketIO.Socket) => {
  if (socket.handshake?.auth?.token) {
    let jwtPayload = await authpal.verifyAuthToken(
      socket.handshake?.auth?.token
    )
    if (jwtPayload?.userid) socket.join(`${jwtPayload.userid}`)
    else {
      let rooms = Array.from(socket.rooms).filter((room) =>
        /^[a-f\d]{24}$/i.test(room)
      )
      if (rooms?.length > 0) {
        for (let room of rooms) socket.leave(room)
      }
    }
  }
}

const globalAsyncErrorCatcher =
  ({ handleError = Promise.reject.bind(Promise) } = {}) =>
  (socket, next) => {
    const on = socket.on.bind(socket)
    socket.on = (event, handler, ...args) => {
      const newHandler = (...handlerArgs) => {
        const result = handler(...handlerArgs)?.catch?.((err) => {
          socket.emit('error', err)
        })

        if (typeof result?.then === 'function') {
          const cb = handlerArgs.at(-1)
          if (typeof cb === 'function') {
            result.then(cb.bind(null, null), cb)
          }
        }
      }

      on(event, newHandler, ...args)
    }

    next()
  }

const TestHooks = (io: Server, socket: Socket) => {
  socket.on('test', (data) => {
    socket.emit('test', { message: 'A message to the asking socket...' })

    socket.broadcast.emit('test', {
      message: 'A message to all other sockets...',
    })
    io.emit('test', { message: 'A message to all sockets...' })

    socket.join('A room')
    io.to('A room').emit('test', { message: 'A message within "A room"' })
    socket.leave('A room')
  })
}
