import { Express, Router } from 'express'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const pathRoute = join(__dirname, '..', 'routes')

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  readdirSync(pathRoute).map(async (file) => {
    (await import(join(pathRoute, file))).default(router)
  })
}
