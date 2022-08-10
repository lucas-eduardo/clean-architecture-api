import { UserData } from '@/entities'
import { InMemoryUserRepository } from '@/use-cases/register-user-on-mailing-list/repository'

describe('In memoru User repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const sut = new InMemoryUserRepository(users)

    const user = await sut.findUserByEmail('john@doe.com')

    expect(user).toBeNull()
  })

  test('should return user if it is found in the repository', async () => {
    const users: UserData[] = []
    const sut = new InMemoryUserRepository(users)

    const name = 'john doe'
    const email = 'john@doe.com'

    await sut.add({ name, email })

    const user = await sut.findUserByEmail('john@doe.com')

    expect(user.name).toBe(name)
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [
      { name: 'john doe', email: 'john@doe.com' },
      { name: 'john doe 2', email: 'john2@doe.com' }
    ]
    const sut = new InMemoryUserRepository(users)

    const returnedUsers = await sut.findAllUsers()

    expect(returnedUsers.length).toBe(users.length)
  })
})
