
import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { UserRepository } from '@/use-cases/register-user-on-mailing-list/ports'
import { RegisterUserController } from '@/web-controllers'
import { MissingParamError } from '@/web-controllers/errors'
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

  test('should return status code 400 when request contains invalid name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'J',
        email: 'john@doe.com'
      }
    }

    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase = new RegisterUserOnMailingList(repo)
    const controller = new RegisterUserController(useCase)

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

    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase = new RegisterUserOnMailingList(repo)
    const controller = new RegisterUserController(useCase)

    const response = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        email: 'john@doe.com'
      }
    }

    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase = new RegisterUserOnMailingList(repo)
    const controller = new RegisterUserController(useCase)

    const response = await controller.handle(requestWithInvalidName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'John Doe'
      }
    }

    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase = new RegisterUserOnMailingList(repo)
    const controller = new RegisterUserController(useCase)

    const response = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {}
    }

    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase = new RegisterUserOnMailingList(repo)
    const controller = new RegisterUserController(useCase)

    const response = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email.')
  })
})
