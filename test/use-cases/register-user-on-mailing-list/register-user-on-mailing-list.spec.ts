import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { UserRepository } from '@/use-cases/register-user-on-mailing-list/ports'

import { InMemoryUserRepository } from './repository/in-memory-user-repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const name = 'john doe'
    const email = 'john@doe.com'

    const response = await useCase.registerUserOnMailingList({ name, email })

    const user = await repo.findUserByEmail(email)

    expect(user.name).toBe(name)
    expect(response.value.name).toBe(name)
  })

  test('should not add user with invalid email to mailing list', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const name = 'john doe'
    const invalidEmail = 'invalid_email'

    const response = (await useCase.registerUserOnMailingList({ name, email: invalidEmail })).value as Error

    const user = await repo.findUserByEmail(invalidEmail)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add user with invalid name to mailing list', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const invalidName = ''
    const email = 'john@doe.com'

    const response = (await useCase.registerUserOnMailingList({ name: invalidName, email })).value as Error

    const user = await repo.findUserByEmail(email)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })
})
