import environment from '../environment'
import * as express from 'express'
import { createServer, Server } from 'http'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'

import { INTERNAL_SERVER_ERROR, sendDefaultMessage } from '../messages/defaults'

import { UsersRoutes } from './routes/users.routes'
import { AuthRoutes } from './routes/auth.routes'

export class Express {
  app: express.Express
  server: Server

  constructor() {
    this.app = express()
    this.app.use(
      cors({
        origin: environment.production ? `https://${environment.domain}/` : '*',
        optionsSuccessStatus: 200,
      })
    )
    this.app.set('trust proxy', true)
    this.app.use(bodyParser.json())

    this.app.use((err, req, res, next) => {
      if (res.headersSent) return next(err)
      sendDefaultMessage(res, new INTERNAL_SERVER_ERROR(err.message))
      next(err)
    })

    new AuthRoutes('auth', this.app)
    new UsersRoutes('users', this.app)

    //THIS IS WHERE YOUR CUSTOM ROUTE CONTROLLERS GO

    //END

    this.app.get('/', (req, res) => res.status(404).send())
  }

  async start(portOverride?: number): Promise<express.Express> {
    return new Promise((resolve, reject) => {
      this.server = createServer(this.app)
      this.server.listen(portOverride || environment.PORT)
      this.server.on('error', (error) => {
        console.error(error)
        reject(error)
      })
      this.server.on('listening', () => resolve(this.app))
    })
  }
}
