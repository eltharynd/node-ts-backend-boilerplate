import bcrypt from 'bcrypt'
import mongoose, { Document, Schema } from 'mongoose'
import {
  DisplayLanguages,
  DisplayThemes,
  Settings,
  User,
} from 'node-ts-backend-boilerplate-interfaces'
import { Sessions } from '../sessions/sessions.model'

const settingsSchema: Schema<Settings> = new Schema(
  {
    selectedTheme: {
      type: String,
      enum: DisplayThemes,
      required: true,
      default: DisplayThemes.system,
    },
    selectedLanguage: {
      type: String,
      enum: DisplayLanguages,
      required: true,
      default: DisplayLanguages.en,
    },
  },
  {
    _id: false,
  }
)
export interface SettingsModel extends Settings, Document {}

const schema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      default: 'John',
    },
    lastName: {
      type: String,
      required: true,
      default: 'Doe',
    },

    admin: {
      type: Boolean,
      default: false,
    },

    settings: {
      type: settingsSchema,
      required: true,
      default: {},
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)
schema.pre('save', async function (next) {
  //@ts-ignore
  if (this.password && !this.password.startsWith('$2b$10$'))
    //@ts-ignore
    this.password = bcrypt.hashSync(this.password, 10)
  next()
})
schema.methods.verifyPassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}
schema.methods.public = function (): User {
  let user = Object.assign(this.toJSON())
  delete user._id
  delete user.password
  if (!user.admin) delete user.admin
  return user
}
const safeDelete = async function (next?) {
  let _id = this._conditions?._id
  if (!_id)
    throw new Error('Not Allowed (Enforcing deletion of users one at a time)')

  await Sessions.deleteMany({ user: _id })
  try {
    if (next) next()
  } catch {}
}
schema.pre('findOneAndDelete', safeDelete)
schema.pre('deleteMany', safeDelete)
schema.pre('deleteOne', safeDelete)

export interface UserModel extends Omit<User, '_id'>, Document {
  settings: SettingsModel

  public: () => Partial<UserModel>
  verifyPassword: (password: string) => boolean
}
export const Users = mongoose.model<UserModel>('users', schema)
