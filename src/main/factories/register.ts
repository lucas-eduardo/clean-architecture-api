
import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { RegisterAndSendEmailController } from '@/web-controllers'

export const makeRegisterUserController = (): RegisterAndSendEmailController => {
  const mongoDbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)
  const registerUserController = new RegisterAndSendEmailController(registerUserOnMailingListUseCase)

  return registerUserController
}
