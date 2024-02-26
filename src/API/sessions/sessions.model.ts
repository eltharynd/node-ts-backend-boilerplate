import mongoose, { Document, Schema, Types } from 'mongoose'

interface Session {
  user: Types.ObjectId
  token: string
  expiration: Date
}

export interface SessionModel extends Session, Document {}
const schema: Schema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'users',
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
  },
  {
    timestamps: true,
  }
)

export const Sessions = mongoose.model<Session>('sessions', schema)
