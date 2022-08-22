import * as request from 'supertest'
import * as mock from '../../db/models/user.mock.json'

describe('User Routes', () => {
  it('should return array of users', (done) => {
    request(global.app)
      .get('/api/v1/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done.fail(err)

        let data = res.body
        if (data.length === 3 && data[0].email === mock[0].email) return done()
        else return done.fail()
      })
  })

  //TODO implement the rest of unit tests
})
