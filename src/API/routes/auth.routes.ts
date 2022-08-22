import { Express, Router } from 'express'
import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  requestBodyGuard,
  sendDefaultMessage,
  UNAUTHORIZED,
} from '../../messages/defaults'
import { Routes } from '../classes/routes'

import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import * as JWT from 'jsonwebtoken'
import environment from '../../environment'
import { Users } from '../../db/models/users.model'
import capitalize = require('capitalize')

export class AuthRoutes extends Routes {
  constructor(prefix, app) {
    passport.use(
      'login',
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
        },
        async (email, password, done) => {
          try {
            let user = await Users.findOne({ email })
            if (!user) return done(null, false, { message: 'User not found' })

            if (!(await user.verifyPassword(password)))
              return done(null, false, { message: 'Wrong password' })

            return done(null, user, { message: 'Logged in Successfully' })
          } catch (e) {
            done(e)
          }
        }
      )
    )

    passport.use(
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: environment.jwtSecret,
        },
        (jwt_payload, done) => {
          Users.findOne({ id: jwt_payload.sub }, (err, user) => {
            if (err) return done(err, false)
            if (user) return done(null, user)
            return done(null, false)
          })
        }
      )
    )

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

    router.post('/login', async (req, res, next) => {
      passport.authenticate('login', async (err, user, info) => {
        if (err) return next(err)

        if (!user) return sendDefaultMessage(res, new UNAUTHORIZED())
        if (err || !user) return next(new Error('An error occurred'))

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error)

          let body = { _id: user._id }
          let token = JWT.sign({ user: body }, environment.jwtSecret)
          res.json(Object.assign(user.clean(), { token }))
        })
      })(req, res, next)
    })

    router.post('/resume', requestBodyGuard(['token']), async (req, res) => {
      try {
        let payload: any = await JWT.decode(req.body.token)
        let user = await Users.findById(payload.user._id)
        if (user) return res.send(user.clean())
        sendDefaultMessage(
          res,
          new UNAUTHORIZED('The authentication token could not be verified...')
        )
      } catch (e) {
        sendDefaultMessage(
          res,
          new UNAUTHORIZED('The authentication token could not be verified...')
        )
      }
    })

    router.get('/secure', AuthRoutes.authGuard, (req, res, next) => {
      res.json({
        message: 'You made it to the secure route',
        user: req.user,
      })
    })
  }

  static authGuard = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      req.user = user
      if (user) next()
      else sendDefaultMessage(res, new UNAUTHORIZED(capitalize(info.message)))
    })(req, res, next)
  }
}
