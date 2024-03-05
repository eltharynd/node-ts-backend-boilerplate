import { NextFunction, Request, Response } from 'express'
import {
  ExpressMiddlewareInterface,
  Middleware,
  Req,
  Res,
} from 'routing-controllers'
import { authpal } from '../auth/auth.controller'
import {
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} from '../interceptors/default.interceptor'
import { UserModel, Users } from '../users/users.model'

declare global {
  namespace Express {
    interface Request {
      auth?: UserModel
    }
  }
}

@Middleware({ type: 'before' })
export class AuthGuard implements ExpressMiddlewareInterface {
  async use(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    authpal.authorizationMiddleware(
      req,
      res,
      async function () {
        let auth = await Users.findById(req.user.userid)
        if (auth) req.auth = auth

        return next()
      },
      async function (httpCode: number) {
        switch (httpCode) {
          case 403:
            next(new FORBIDDEN())
            break
          case 401:
          default:
            next(new UNAUTHORIZED())
        }
      }
    )
  }
}

@Middleware({ type: 'before' })
export class OwnerOrAdminGuard implements ExpressMiddlewareInterface {
  async use(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    authpal.authorizationMiddleware(
      req,
      res,
      async function () {
        if (!req.user.userid || !req.params.userId)
          throw new Error(
            'Calling OwnerOrAdminGuard but something is missing...'
          )
        let auth = await Users.findById(req.user.userid)
        if (auth) req.auth = auth

        let user = await Users.findById(req.params.userId)

        if (req.user.userid !== user?._id?.toString()) {
          if (!auth?.admin) {
            return next(new FORBIDDEN())
          }
          if (!user) {
            return next(new NOT_FOUND())
          }
        }

        return next()
      },
      async function (httpCode: number) {
        switch (httpCode) {
          case 403:
            next(new FORBIDDEN())
            break
          case 401:
          default:
            next(new UNAUTHORIZED())
        }
      }
    )
  }
}

@Middleware({ type: 'before' })
export class AdminGuard implements ExpressMiddlewareInterface {
  async use(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    authpal.authorizationMiddleware(
      req,
      res,
      async function () {
        let auth = await Users.findById(req.user.userid)
        if (auth) req.auth = auth

        if (auth.admin) {
          return next()
        } else
          return next(
            new FORBIDDEN(`This resource is reserved for System Administrators`)
          )
      },
      async function (httpCode: number) {
        switch (httpCode) {
          case 403:
            next(new FORBIDDEN())
            break
          case 401:
          default:
            next(new UNAUTHORIZED())
        }
      }
    )
  }
}
