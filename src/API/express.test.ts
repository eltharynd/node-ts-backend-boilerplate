import { test } from '@jest/globals'
import request from 'supertest'
import { app } from './express'

describe('Express', () => {
  test('Should be initialized', async () => {
    await request(app).get('/').expect(404)
  })
})
