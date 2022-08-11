import { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeRegisterSendEmailController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/register', adaptRoute(makeRegisterSendEmailController()))
}
