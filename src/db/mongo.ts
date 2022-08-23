import { MongoMemoryServer } from 'mongodb-memory-server'
import * as Mongoose from 'mongoose'
import environment from '../environment'
import { Users } from './models/users.model'

export class Mongo {
  private database: Mongoose.Connection

  async connect(test?: boolean): Promise<boolean> {
    if (this.database) return true

    return new Promise<boolean>(async (resolve, reject) => {
      if (!test && environment.mongoConnectionString) {
        //Connects to the real DB
        Mongoose.connect(environment.mongoConnectionString)
      } else {
        //Creates an in-memory temporary DB for testing
        let mongod = await MongoMemoryServer.create()
        Mongoose.connect(mongod.getUri())
      }

      this.database = Mongoose.connection
      this.database.on('error', console.error.bind(console, 'connection error'))
      this.database.once('open', async () => {
        if (test || !environment.mongoConnectionString) {
          await Mongo.populateMockData()
        }
        resolve(true)
      })
    })
  }

  async disconnect() {
    if (!this.database) return true
    return new Promise<boolean>(async (resolve, reject) => {
      Mongoose.disconnect()
        .then(() => resolve(true))
        .catch((err) => {
          console.error(err)
          reject(false)
        })
    })
  }

  static ObjectId(id: string): Mongoose.Types.ObjectId
  static ObjectId(id: Mongoose.Types.ObjectId): Mongoose.Types.ObjectId
  static ObjectId(
    id: string | Mongoose.Types.ObjectId
  ): Mongoose.Types.ObjectId {
    if (typeof id === 'string')
      if (id.length === 24) return new Mongoose.Types.ObjectId(id)
      else return null
    else return id
  }

  private static async populateMockData() {
    let users = require('../test/db/models/user.mock.json')
    for (let user of users) {
      let u = await Users.create(user)
      await u.save()
    }
  }
}
