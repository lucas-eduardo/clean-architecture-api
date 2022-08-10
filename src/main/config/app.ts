import express from 'express'

import setupMiddleware from './setup-middleware'
import setupRoutes from './setup-routes'

const app = express()

setupMiddleware(app)
setupRoutes(app)

export default app
