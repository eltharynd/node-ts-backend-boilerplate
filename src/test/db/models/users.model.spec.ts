import { Users } from '../../../db/models/users.model'

describe('Users', async () => {
  it('should be populated', async () => {
    let users = await Users.find()
    expect(users.length).toBeGreaterThanOrEqual(3)
  })

  it('should encrypt and verify password', async () => {
    let user = await Users.findOne()
    expect(user.verifyPassword('asupersecretpassword')).toBeTrue()
    expect(user.verifyPassword('awrongpassword')).toBeFalse()
  })

  it('should clean themselves', async () => {
    let user = (await Users.findOne()).clean()
    expect(user).toBeDefined()
    //@ts-ignore
    expect(user.password).toBeUndefined()
  })
})
