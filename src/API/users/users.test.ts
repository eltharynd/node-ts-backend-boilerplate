import { test } from '@jest/globals'
import supertest from 'supertest'
import environment from '../../environment'
import { mongo, populateUsers } from '../../mongo.test'
import { getUserHeaders } from '../auth/auth.test'
import { app } from '../express'

describe('Users API Routes', () => {
  let userHeaders
  beforeAll(async () => {
    await mongo.connect()
    await populateUsers()
    userHeaders = await getUserHeaders()
  })

  test('Should forbid getting users', async () => {
    await supertest(app).get(`${environment.API_BASE}users`).expect(403)
  })

  test('Should forbid getting users to user', async () => {
    await supertest(app)
      .get(`${environment.API_BASE}users`)
      .set(userHeaders[1])
      .expect(403)
  })

  test('Should allow getting users to admin', async () => {
    let { body } = await supertest(app)
      .get(`${environment.API_BASE}users`)
      .set(userHeaders[0])
      .expect(200)

    expect(Array.isArray(body)).toBeTruthy()
    expect(body.length).toBeGreaterThanOrEqual(3)
  })

  //TODO finish writing unit tests for other routes
})
