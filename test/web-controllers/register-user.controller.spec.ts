
import { join } from 'node:path'

import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/use-cases/errors'
import { UseCase } from '@/use-cases/ports'
import { RegisterAndSendEmail } from '@/use-cases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/use-cases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/use-cases/send-email'
import { EmailOptions, EmailService } from '@/use-cases/send-email/ports'
import { RegisterAndSendEmailController } from '@/web-controllers'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest } from '@/web-controllers/ports'

const attachmentFilePath = join(process.cwd(), 'resourcers', 'text.txt')
const fromName = 'John Doe'
const fromEmail = 'john@doe.com'
const toName = 'John2 Doe2'
const toEmail = 'john2@doe.com'
const subject = 'Test e-mail'
const emailBody = 'Hello world attachment test'
const emailBodyHtml = '<b>Hello world attachment test</b>'
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: `${fromName} ${fromEmail}`,
  to: `${toName} <${toEmail}>`,
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachment
}

class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

describe('Register user web controller', () => {
  const users: UserData[] = []

  const repo = new InMemoryUserRepository(users)
  const registerUseCase = new RegisterUserOnMailingList(repo)

  const mailServiceStub = new MailServiceStub()
  const sendEmailUseCase = new SendEmail(mailOptions, mailServiceStub)

  const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
  const controller = new RegisterAndSendEmailController(registerAndSendEmailUseCase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform (_: any): Promise<void> {
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

    const controller = new RegisterAndSendEmailController(errorThrowingUseCaseStub)
    const response = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
