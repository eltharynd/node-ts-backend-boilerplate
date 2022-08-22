import * as request from 'supertest'

describe('Express server', () => {
  it('should be initialized...', () => {
    expect(global.app).toBeDefined()
  })

  it('should return 404', (done) => {
    request(global.app)
      .get('/')
      .expect(404)
      .end((err, res) => {
        if (err) done.fail(err)
        else done()
      })
  })
})
