import 'module-alias/register'
import 'dotenv/config'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'

(async () => {
  try {
    await MongoHelper.connect(process.env.MONGO_URL)

    const app = (await import('./config/app')).default

    const port = process.env.PORT || 5000

    app.listen(port, () => {
      console.log('Server running at ' + port)
    })
  } catch (error) {
    console.error(error)
  }
})()
