import { Server, Socket } from 'socket.io'
import Logger from '../util/logger'
import { authpal } from './auth/auth.controller'
import { origins, server } from './express'
import { UserModel, Users } from './users/users.model'

class Context {
  io: any
}
const context: Context = new Context()
export default context

export const startSocket = async () => {
  context.io = new Server(server, {
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

//TODO make client reconnect when server restarts
const setupListeners = () => {
  context.io.on('connect', async (socket: AuthenticatedSocket) => {
    Logger.debug(`Socket ${socket.id} connected...`)

    await authenticate(socket)

    //TODO still need?
    /*     if (socket.use)
      socket.use(async (event, next) => {
        authenticate(socket)
        next()
      }) */

    TestHooks(context.io, socket)

    socket.on('disconnect', () => {
      Logger.debug(`Socket ${socket.id} disconnected...`)
    })
  })
}

const authenticate = async (socket: AuthenticatedSocket) => {
  if (socket.handshake?.auth?.token) {
    let jwtPayload = await authpal.verifyAuthToken(
      socket.handshake?.auth?.token
    )
    if (jwtPayload?.userid) {
      if (!socket.rooms.has(jwtPayload.userid)) {
        Logger.debug(`Socket ${socket.id} joining '${jwtPayload.userid}'...`)
        socket.join(`${jwtPayload.userid}`)
      }
      if (!socket.auth || socket.auth?._id.toString() !== jwtPayload.userid) {
        let user = await Users.findById(jwtPayload.userid)
        if (user) socket.auth = user
      }
    } else {
      Logger.debug(`Socket ${socket.id} unauthenticated...`)
      let rooms = Array.from(socket.rooms).filter((room) =>
        /^[a-f\d]{24}$/i.test(room)
      )
      if (rooms?.length > 0) {
        for (let room of rooms) socket.leave(room)
      }
    }
  }
}

export class AuthenticatedSocket extends Socket {
  auth?: UserModel
}

export const guardRoute = async (
  socket: AuthenticatedSocket
): Promise<void> => {
  if (!socket.auth) {
    Logger.debug(`Socket ${socket.id} rejected because is not authorized`)
    socket.emit('error', 'Unauthorized')
    throw new Error(`FORBIDDEN`)
  }
}

const globalAsyncErrorCatcher =
  ({ handleError = Promise.reject.bind(Promise) } = {}) =>
  (socket, next) => {
    const on = socket.on.bind(socket)
    socket.on = (event, handler, ...args) => {
      const newHandler = (...handlerArgs) => {
        const result = handler(...handlerArgs)?.catch?.((err) => {
          Logger.error(err)
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

//TODO remove?
const TestHooks = (io: Server, socket: AuthenticatedSocket) => {
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
