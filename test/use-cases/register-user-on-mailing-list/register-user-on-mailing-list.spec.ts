import { User, UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { UserRepository } from '@/use-cases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/use-cases/register-user-on-mailing-list/repository'

describe.only('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const name = 'john doe'
    const email = 'john@doe.com'

    const user = User.create({ name, email }).value as User

    const response = await useCase.perform(user)

    const addedUser = await repo.findUserByEmail(email)

    expect(addedUser.name).toBe(name)
    expect(response.name).toBe(name)
  })
})
