import express from 'express'

import setupMiddleware from './setup-middleware'

const app = express()

setupMiddleware(app)

export default app
