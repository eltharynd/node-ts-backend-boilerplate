import { NextFunction } from 'express'
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
  Req,
  Res,
} from 'routing-controllers'
import Logger from '../../util/logger'
import { INTERNAL_SERVER_ERROR } from '../interceptors/default.interceptor'

@Middleware({ type: 'after' })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, @Req() req, @Res() res, next: NextFunction) {
    if (res.headersSent) return next(error)

    if (error instanceof HttpError) {
      res.status(error.httpCode).json(error)
    } else {
      let _error = new INTERNAL_SERVER_ERROR(error)
      res.on('finish', () => {
        Logger.error(_error)
      })
      res.status(_error.httpCode).json(_error)
    }
  }
}
