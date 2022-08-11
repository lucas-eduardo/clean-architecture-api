import { join } from 'node:path'
import { createTransport } from 'nodemailer'

import { NodemailerEmailService } from '@/external/mail-services'
import { MailServiceError } from '@/use-cases/errors'
import { EmailOptions } from '@/use-cases/send-email/ports'

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

jest.mock('nodemailer')

const createTransportMock = createTransport as jest.Mock

const sendMailMock = jest.fn().mockReturnValueOnce('ok')

createTransportMock.mockReturnValue({ sendMail: sendMailMock })

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    createTransportMock.mockClear()
  })

  test('should return ok if email is sent', async () => {
    const nodemailerService = new NodemailerEmailService()

    const result = await nodemailerService.send(mailOptions)

    expect(result.value).toEqual(mailOptions)
  })

  test('should return error if email is not sent', async () => {
    const nodemailerService = new NodemailerEmailService()

    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await nodemailerService.send(mailOptions)

    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})
