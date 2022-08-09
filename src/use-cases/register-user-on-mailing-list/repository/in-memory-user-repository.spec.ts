import { UserData } from '../user-data'
import { InMemoryUserRepository } from './in-memory-user-repository'

describe('In memoru User repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)

    const user = await userRepo.findUserByEmail('john@doe.com')

    expect(user).toBeNull()
  })

  test('should return user if it is found in the repository', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)

    const name = 'john doe'
    const email = 'john@doe.com'

    await userRepo.add({ name, email })

    const user = await userRepo.findUserByEmail('john@doe.com')

    expect(user.name).toBe(name)
  })
})
