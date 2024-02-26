import { beforeAll, test } from '@jest/globals'
import { Users } from './api/users/users.model'
import { Mongo } from './mongo'

describe('MongoDB', () => {
  beforeAll(async () => {
    await mongo.connect()
  })

  test('Should connect', async () => {
    expect(mongo).toBeDefined()
    expect(mongo?.isConnected()).toBeTruthy()
  })
})

export const mongo: Mongo = new Mongo()

export const mockUsers = [
  {
    _id: '62fca0f3e9e1c4a7b2f14ec0',
    email: 'laurent@email.com',
    firstName: 'Laurent',
    lastName: 'Schwitter',
    password: 'asupersecretpassword',
    admin: true,
  },
  {
    _id: '62fca0f3e9e1c4a7b2f14ec1',
    email: 'joel@email.com',
    firstName: 'Joel',
    lastName: 'Schwitter',
    password: 'asupersecretpassword',
  },
  {
    _id: '62fca0f3e9e1c4a7b2f14ec2',
    email: 'daniel@email.com',
    firstName: 'Daniel',
    lastName: 'Schwitter',
    password: 'asupersecretpassword',
  },
]
export const populateUsers = async () => {
  if ((await Users.find()).length > 0) return
  for (let user of mockUsers) {
    await Users.create(user)
  }
}
