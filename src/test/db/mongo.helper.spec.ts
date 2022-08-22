import { Mongo } from '../../db/mongo'

beforeAll((done) => {
  const mongo = new Mongo()
  mongo
    .connect(true)
    .then(async () => {
      done()
    })
    .catch((e) => {
      done.fail(e)
    })
})
