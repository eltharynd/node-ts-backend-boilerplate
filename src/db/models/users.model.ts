import { Schema, model, Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { Sessions } from './sessions.model'

export interface IUser {
  _id: Types.ObjectId

  email: string
  password: string

  firstName: string
  lastName: string

  created?: Date

  verifyPassword(password: string): boolean
  clean(): ICleanedUser

  /**
   * Checks if user is a user is safe to delete before doing so.
   *
   * @returns A Promise<Types.ObjectId> with the _id of the deleted user, otherwise an error
   **/
  safeDelete()
}
export interface ICleanedUser {
  email: string
  created: Date
}
const usersSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  created: {
    type: Date,
    default: Date.now(),
    required: true,
  },
})

usersSchema.pre('save', async function (next) {
  if (this.password && !this.password.startsWith('$2b$10$'))
    this.password = bcrypt.hashSync(this.password, 10)
  next()
})
usersSchema.methods.verifyPassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

usersSchema.methods.clean = function () {
  let user = Object.assign(this.toJSON())
  delete user.__v
  delete user._id
  delete user.password
  return user
}

const forbidMethods = () => {
  throw new Error(
    'Not Allowed (Enforcing single user deletion to redirect through checks)'
  )
}
usersSchema.methods.delete = forbidMethods
usersSchema.methods.deleteOne = forbidMethods
usersSchema.pre('findByIdAndDelete', forbidMethods)
usersSchema.pre('findOneAndDelete', forbidMethods)
usersSchema.pre('deleteMany', forbidMethods)
usersSchema.pre('remove', function (done) {
  let u = this
  if (u.overridePermissions) return done()
  forbidMethods()
})

const safeDelete = async function (): Promise<Types.ObjectId> {
  return new Promise(async (resolve, reject) => {
    //do your checks here
    let forbidden = true
    if (forbidden) return reject(`Can't delete user`)
    else {
      //update all relevant models
      let sessions = await Sessions.find({ user: this._id })
      for (let s of sessions) {
        await s.delete()
      }
    }

    this.overridePermissions = true
    await this.remove()

    resolve(this.id)
  })
}
usersSchema.methods.safeDelete = safeDelete

export const Users = model<IUser>('Users', usersSchema)
