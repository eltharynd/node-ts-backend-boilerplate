import { beforeAll, describe, test } from '@jest/globals'
import supertest from 'supertest'
import environment from '../../environment'
import { mockUsers, mongo, populateUsers } from '../../mongo.test'
import { app } from '../express'

export const getUserHeaders = async () => {
  let users: { Authorization: string }[] = []
  for (let u of mockUsers) {
    let { email, password } = u
    let { body } = await supertest(app)
      .post(`${environment.API_BASE}auth/login`)
      .send({ email, password })
    users.push({ Authorization: `Bearer ${body.accessToken}` })
  }
  return users
}

describe(`Auth API Routes`, () => {
  let userHeaders
  beforeAll(async () => {
    await mongo.connect()
    await populateUsers()
    userHeaders = await getUserHeaders()
  })

  test('Should prevent login with false credentials', async () => {
    let { email } = mockUsers[0]
    await supertest(app)
      .post(`${environment.API_BASE}auth/login`)
      .send({ email, password: 'thisisnotmypassword' })
      .expect(401)
  })

  test('Should login a user', async () => {
    let { email, password } = mockUsers[0]
    let { body } = await supertest(app)
      .post(`${environment.API_BASE}auth/login`)
      .send({ email, password })
      .expect(200)

    expect(body).toHaveProperty('accessToken')
    expect(body.accessToken).toBeTruthy()
  })

  test('Should forbid access to /me', async () => {
    await supertest(app).get(`${environment.API_BASE}auth/me`).expect(403)
  })

  test('Should grant access to /me', async () => {
    let { body } = await supertest(app)
      .get(`${environment.API_BASE}auth/me`)
      .set(userHeaders[0])
      .expect(200)

    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('_id')
    expect(body.email).toBe(mockUsers[0].email)
    expect(body._id).toBe(mockUsers[0]._id)
  })
})
