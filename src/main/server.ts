import 'module-alias/register'
import 'dotenv/config'

(async () => {
  const app = (await import('./config/app')).default

  const port = process.env.PORT || 5000

  app.listen(port, () => {
    console.log(`Server running at ${port}`)
  })
})()
