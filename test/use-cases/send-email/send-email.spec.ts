import { join } from 'node:path'

import { User } from '@/entities'
import { Either, left, right } from '@/shared'
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
  async send (_: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = (await useCase.perform(user)).value as EmailOptions

    expect(response.to).toEqual(`${toName} <${toEmail}>`)
  })

  test('should return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub()
    const useCase = new SendEmail(mailOptions, mailServiceErrorStub)
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = await useCase.perform(user)

    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
