import { join } from 'node:path'

import { User, UserData } from '@/entities'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/use-cases/errors'
import { RegisterAndSendEmail } from '@/use-cases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/use-cases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/use-cases/send-email'
import { EmailOptions, EmailService } from '@/use-cases/send-email/ports'

describe('Register and send email to user', () => {
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

  class MailServiceMock implements EmailService {
    timesSendWasCalled = 0

    async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
      this.timesSendWasCalled++

      return right(emailOptions)
    }
  }

  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []

    const repo = new InMemoryUserRepository(users)
    const registerUseCase = new RegisterUserOnMailingList(repo)

    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmail(mailOptions, mailServiceMock)

    const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

    const name = 'john doe'
    const email = 'john@doe.com'

    const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as User

    const user = await repo.findUserByEmail(email)

    expect(user.name).toBe(name)
    expect(response.name.value).toBe(name)
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
  })
})
