import { NextFunction, Request } from 'express'
import {
  ExpressMiddlewareInterface,
  Middleware,
  Req,
  Res,
} from 'routing-controllers'
import environment from '../../environment'
import Logger from '../../util/logger'

@Middleware({ type: 'before' })
export class LoggerMiddleware implements ExpressMiddlewareInterface {
  async use(@Req() req: Request, @Res() res, next: NextFunction) {
    if (environment.TESTING) return next()

    let startT = Date.now()
    res.on('finish', () => {
      let deltaT = Date.now() - startT

      let text = `${res.statusCode} ${req.headers['authorization'] ? '$' : ''}${
        req.method
      } ${req.url} (${
        req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }), done in ${deltaT}ms`

      if (res.statusCode >= 500) {
        Logger.error(text)
      } else if (res.statusCode >= 400) {
        Logger.warn(text)
      } else Logger.info(text)
    })
    next()
  }
}
