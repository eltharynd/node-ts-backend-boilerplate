import { Express, Router } from 'express'
import { Authpal } from 'authpal'

import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  requestBodyGuard,
  sendDefaultMessage,
} from '../../messages/defaults'
import { Routes } from '../classes/routes'

import environment from '../../environment'
import { Users } from '../../db/models/users.model'
import { Sessions } from '../../db/models/sessions.model'

import { Mongo } from '../../db/mongo'

export class AuthRoutes extends Routes {
  static authpal: Authpal
  static authGuard

  constructor(prefix, app) {
    AuthRoutes.authpal = new Authpal({
      jwtSecret: environment.jwtSecret,
      usernameField: 'email',

      findUserByUsernameCallback: async (email) => {
        let user = await Users.findOne({ email })
        return user ? { userid: user.id } : null
      },

      findUserByIDCallback: async (userid) => {
        let user = await Users.findOne({ id: Mongo.ObjectId(`${userid}`) })
        return user ? { userid: user.id } : null
      },
      findUserByRefreshToken: async (token) => {
        let session = await Sessions.findOne({
          token,
        })
        if (session.expiration.getTime() <= Date.now()) {
          await session.delete()
          return null
        }
        return session
          ? {
              userid: session.user.toString(),
            }
          : null
      },
      tokenRefreshedCallback: async (jwtPayload, token) => {
        let exists = await Sessions.findOne({
          user: Mongo.ObjectId(`${jwtPayload.userid}`),
          token: token.token,
        })
        if (exists) {
          exists.expiration = token.expiration
          await exists.save()
        } else {
          await Sessions.create({
            user: jwtPayload.userid,
            token: token.token,
            expiration: token.expiration,
          })
        }
      },
      tokenDeletedCallback: async (jwtPayload, token) => {
        let exists = await Sessions.findOne({
          user: Mongo.ObjectId(`${jwtPayload.userid}`),
          token: token.token,
        })
        if (exists) await exists.delete()
      },
      verifyPasswordCallback: async (email, password) => {
        let user = await Users.findOne({ email })
        return user?.verifyPassword(password)
      },
    })

    AuthRoutes.authGuard = AuthRoutes.authpal.authorizationMiddleware

    super(prefix, app)
  }

  defineRoutes(router: Router) {
    router.post(
      '/signup',
      requestBodyGuard(['email', 'password']),
      async (req, res) => {
        Users.create({
          email: req.body.email,
          password: req.body.password,
        })
          .then((user) => {
            sendDefaultMessage(
              res,
              new CREATED(`User created with id ${user._id}`)
            )
          })
          .catch((err) => {
            if (err?.code === 11000)
              return sendDefaultMessage(
                res,
                new CONFLICT('User with this email already exists')
              )
            return sendDefaultMessage(res, new INTERNAL_SERVER_ERROR())
          })
      }
    )

    router.post('/login', AuthRoutes.authpal.loginMiddleWare)

    router.get('/resume', AuthRoutes.authpal.resumeMiddleware)

    router.get('/logout', AuthRoutes.authpal.logoutMiddleware)

    router.get(
      '/me',
      AuthRoutes.authpal.authorizationMiddleware,
      async (req, res) => {
        //@ts-ignore
        let user = (await Users.findOne({ _id: req.user.userid })).clean()
        res.json(user)
      }
    )
  }
}
