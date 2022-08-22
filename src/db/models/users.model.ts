import { Schema, model, Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { Organizations } from './organizations.model'

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
   * Checks if user is owner/member in one or more organizations before deleting it.
   *
   * @remarks If they own one or more organizations it throws an exception instead of deleting.
   * @remarks If they are members of one or more organizations it removes them from those before deleting.
   *
   * @returns A Promise<Types.ObjectId> with the _id of the deleted user, otherwise an error
   **/
  safeDelete()
}
export interface ICleanedUser {
  email: string
  firstName: string
  lastName: string
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

  firstName: String,
  lastName: String,

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
    let owned = await Organizations.find({ owner: this.id })

    if (owned?.length > 0)
      return reject(
        `User owns ${owned.length} organization${
          owned.length > 1 ? 's' : ''
        }. It can't be deleted at this time...`
      )

    let member = await Organizations.find({ member: this.id })
    for (let m of member) {
      m.members.splice(m.members.indexOf(this.id), 1)
      await m.save()
    }

    this.overridePermissions = true
    await this.remove()

    resolve(this.id)
  })
}
usersSchema.methods.safeDelete = safeDelete

export const Users = model<IUser>('Users', usersSchema)
