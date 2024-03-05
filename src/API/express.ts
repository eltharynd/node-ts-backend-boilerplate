import express from 'express'
import fs from 'fs'
import { Server, createServer } from 'http'
import path from 'path'
import { createExpressServer } from 'routing-controllers'
import swaggerUIExpress from 'swagger-ui-express'
import environment from '../environment'
import { MongoInterceptor } from '../mongo'
import Logger from '../util/logger'
import { AuthController } from './auth/auth.controller'
import { DefaultInterceptor } from './interceptors/default.interceptor'
import { HttpErrorHandler } from './middlewares/error.middleware'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { SWAGGER_SPECS } from './swagger'
import { UploadsController } from './uploads/uploads.controller'
import { UsersController } from './users/users.controller'

export const origins = environment.PRODUCTION
  ? [
      `https://${environment.DOMAIN}`,
      `https://${environment.DOMAIN.replace('-backend.apps', '.apps')}`,
    ]
  : [
      'http://localhost:3000',
      `https://${environment.DOMAIN}`,
      `https://${environment.DOMAIN.replace(
        '-backend-staging.apps',
        '-staging.apps'
      )}`,
    ]

export const app: express.Express = createExpressServer({
  cors: {
    origin: origins,
    optionsSuccessStatus: 200,
    credentials: true,
  },
  routePrefix: environment.API_BASE.replace(/\/$/, ''),
  defaultErrorHandler: false,
  middlewares: [LoggerMiddleware, HttpErrorHandler],
  controllers: [AuthController, UploadsController, UsersController],
  interceptors: [DefaultInterceptor, MongoInterceptor],
  validation: { whitelist: true },
  classToPlainTransformOptions: {
    enableCircularCheck: true,
  },
})

app.set('trust proxy', true)

app.use(
  `${environment.API_BASE}docs`,
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(SWAGGER_SPECS, {
    customCss:
      fs
        .readFileSync(path.join(process.cwd(), 'docs/theme-flattop.css'))
        .toString() +
      fs.readFileSync(path.join(process.cwd(), 'docs/custom.css')).toString(),
  })
)

export const server: Server = createServer(app)
export const start = async (portOverride?: number): Promise<Server> => {
  return new Promise<Server>((resolve, reject) => {
    server.listen(portOverride || environment.PORT)
    server.on('error', (error) => {
      Logger.error(error)
      reject(error)
    })
    server.on('listening', () => resolve(server))
  })
}
