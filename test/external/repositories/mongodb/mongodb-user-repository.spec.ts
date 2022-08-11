import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'

describe('Mongodb User repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()

    const user = {
      name: 'John Doe',
      email: 'john@doe.com'
    }

    await userRepository.add(user)

    expect(await userRepository.exists(user)).toBeTruthy()
  })

  test('find all users should return all added users', async () => {
    const userRepository = new MongodbUserRepository()

    await userRepository.add({
      name: 'John Doe',
      email: 'john@doe.com'
    })

    await userRepository.add({
      name: 'John2 Doe',
      email: 'john2@doe.com'
    })

    const users = await userRepository.findAllUsers()

    expect(users.length).toEqual(2)
    expect(users[0].name).toEqual('John Doe')
    expect(users[1].email).toEqual('john2@doe.com')
  })
})
