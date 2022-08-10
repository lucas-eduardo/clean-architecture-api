
import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { UserRepository } from '@/use-cases/register-user-on-mailing-list/ports'
import { RegisterUserController } from '@/web-controllers'
import { HttpRequest } from '@/web-controllers/ports'

import { InMemoryUserRepository } from '../use-cases/register-user-on-mailing-list/repository'

describe('Register user web controller', () => {
  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com'
      }
    }

    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase = new RegisterUserOnMailingList(repo)
    const controller = new RegisterUserController(useCase)

    const response = await controller.handle(request)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })
})
