import { join } from 'node:path'

import { Either, left, Left, Right, right } from '@/shared'
import { MailServiceError } from '@/use-cases/errors'
import { SendEmail } from '@/use-cases/send-email'
import { EmailOptions, EmailService } from '@/use-cases/send-email/ports'

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

class MailServiceErrorStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const response = await useCase.perform({ name: toName, email: toEmail })

    expect(response).toBeInstanceOf(Right)
  })

  test('should not try email with invalid email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const invalidEmail = 'invalid_email'
    const response = await useCase.perform({ name: toName, email: invalidEmail })

    expect(response).toBeInstanceOf(Left)
  })

  test('should return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub()
    const useCase = new SendEmail(mailOptions, mailServiceErrorStub)
    const response = await useCase.perform({ name: toName, email: toEmail })

    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
