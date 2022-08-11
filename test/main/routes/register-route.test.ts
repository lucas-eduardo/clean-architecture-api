import request from 'supertest'

import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import app from '@/main/config/app'

describe('Register route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('should return an account on sucess', async () => {
    app.post('/test-cors', (req, res) => {
      res.send()
    })

    await request(app)
      .post('/api/register')
      .send({
        name: 'John Doe',
        email: 'john@doe.com'
      })
      .expect(201)
  })
})
