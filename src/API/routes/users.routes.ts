import { Mongo } from '../../db/mongo'
import { Users } from '../../db/models/users.model'
import { AuthRoutes } from './auth.routes'
import { Router } from 'express'
import { Routes } from '../classes/routes'
import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  NO_CONTENT,
  requestBodyGuard,
  sendDefaultMessage,
} from '../../messages/defaults'

export class UsersRoutes extends Routes {
  defineRoutes(router: Router) {
    router
      .route('/')
      .get(async (req, res) => {
        let users = await Users.find()
        res.json(users.map((u) => u.clean()))
      })
      .post(requestBodyGuard(['email', 'password']), async (req, res) => {
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
      })

    router
      .route('/:userId')
      .get(async (req, res) => {
        let user = await Users.findById(Mongo.ObjectId(req.params.userId))
        if (!user) return sendDefaultMessage(res, new NOT_FOUND())
        res.json(user.clean())
      })
      .patch(async (req, res) => {
        let user = await Users.findById(Mongo.ObjectId(req.params.userId))
        if (!user) return sendDefaultMessage(res, new NOT_FOUND())

        for (let par of Object.keys(req.body)) user[par] = req.body[par]

        user
          .save()
          .then((user) => {
            res.send('User updated...')
          })
          .catch((err) => {
            if (err?.code === 11000)
              return sendDefaultMessage(
                res,
                new CONFLICT('Another user with this email already exists')
              )
            return sendDefaultMessage(res, new INTERNAL_SERVER_ERROR())
          })
      })
      .delete(async (req, res) => {
        let user = await Users.findById(Mongo.ObjectId(req.params.userId))
        if (!user) return sendDefaultMessage(res, new NO_CONTENT())
        await user.safeDelete()
        res.send('User deleted...')
      })

    router.all(`/authenticated`, AuthRoutes.authGuard, (req, res) => {
      res.send(
        'this route is behind login, checked by the authGuard middleware'
      )
    })
  }
}
