
import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/use-cases/ports'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { UserRepository } from '@/use-cases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/use-cases/register-user-on-mailing-list/repository'
import { RegisterUserController } from '@/web-controllers'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest } from '@/web-controllers/ports'

describe('Register user web controller', () => {
  const users: UserData[] = []

  const repo: UserRepository = new InMemoryUserRepository(users)
  const useCase: UseCase = new RegisterUserOnMailingList(repo)
  const controller = new RegisterUserController(useCase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform (request: any): Promise<void> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com'
      }
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })

  test('should return status code 400 when request contains invalid name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'J',
        email: 'john@doe.com'
      }
    }

    const response = await controller.handle(requestWithInvalidName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'invalid_email.com'
      }
    }

    const response = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'john@doe.com'
      }
    }

    const response = await controller.handle(requestWithMissingName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const requestWithMissingEmail: HttpRequest = {
      body: {
        name: 'John Doe'
      }
    }

    const response = await controller.handle(requestWithMissingEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing user name and email', async () => {
    const requestWithMissingNameAndEmail: HttpRequest = {
      body: {}
    }

    const response = await controller.handle(requestWithMissingNameAndEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@doe.com'
      }
    }

    const controller = new RegisterUserController(errorThrowingUseCaseStub)
    const response = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
