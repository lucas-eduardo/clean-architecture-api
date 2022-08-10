import { InMemoryUserRepository } from 'test/use-cases/register-user-on-mailing-list/repository'

import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { RegisterUserController } from '@/web-controllers'

export const makeRegisterUserController = (): RegisterUserController => {
  const inMemoryUserRepository = new InMemoryUserRepository([])
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(inMemoryUserRepository)
  const registerUserController = new RegisterUserController(registerUserOnMailingListUseCase)

  return registerUserController
}
