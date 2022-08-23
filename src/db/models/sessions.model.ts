import { Schema, model, Types } from 'mongoose'

export interface ISession {
  user: Types.ObjectId
  token: string
  expiration: Date
  created: Date
}
const sessionSchema: Schema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
    required: true,
  },
})
export const Sessions = model<ISession>('Sessions', sessionSchema)
