import request from 'supertest'

import app from '@/main/config/app'

describe('CORS middleware', () => {
  test('should enable CORS', async () => {
    app.post('/test-cors', (req, res) => {
      res.send()
    })

    await request(app)
      .post('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
