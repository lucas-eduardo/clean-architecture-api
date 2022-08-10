import request from 'supertest'

import app from '@/main/config/app'

describe('Content type middleware', () => {
  test('should return default content type as json', async () => {
    app.get('/test-content-type', (_, res) => {
      res.send('')
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  test('should return xml content type when forced', async () => {
    app.get('/test-content-type-xml', (_, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
