import * as request from 'supertest'
import { v4 } from 'uuid'

import { requestBodyGuard } from '../../messages/defaults'

describe('Default Messages', () => {
  let randomRoute

  beforeAll(() => {
    randomRoute = v4()
    global.app.post(
      `/${randomRoute}`,
      requestBodyGuard(['test1', 'test2']),
      (req, res) => {
        res.send('success')
      }
    )
  })

  it('should send an error response with 2 missing values', (done) => {
    request(global.app)
      .post(`/${randomRoute}`)
      .expect(400)
      .end((err, res) => {
        if (err) done.fail(err)
        else if (res.body.missing?.length === 2) done()
        else done.fail()
      })
  })

  it('should send an error response with 1 missing value', (done) => {
    request(global.app)
      .post(`/${randomRoute}`)
      .send({ test1: true })
      .expect(400)
      .end((err, res) => {
        if (err) done.fail(err)
        else if (res.body.missing?.length === 1) done()
        else done.fail()
      })
  })

  it('should succeed', (done) => {
    request(global.app)
      .post(`/${randomRoute}`)
      .send({ test1: true, test2: true })
      .expect(200)
      .end((err, res) => {
        if (err) done.fail(err)
        else done()
      })
  })
})
