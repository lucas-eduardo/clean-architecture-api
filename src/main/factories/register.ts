
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { RegisterUserController } from '@/web-controllers'

import { InMemoryUserRepository } from '../../../test/use-cases/register-user-on-mailing-list/repository/in-memory-user-repository'

export const makeRegisterUserController = (): RegisterUserController => {
  const inMemoryUserRepository = new InMemoryUserRepository([])
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(inMemoryUserRepository)
  const registerUserController = new RegisterUserController(registerUserOnMailingListUseCase)

  return registerUserController
}
