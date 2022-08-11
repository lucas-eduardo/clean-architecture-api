import { createTransport } from 'nodemailer'

import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/use-cases/errors'
import { EmailOptions, EmailService } from '@/use-cases/send-email/ports'

export class NodemailerEmailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    try {
      const transporter = createTransport({
        host: options.host,
        port: options.port,
        auth: {
          user: options.username,
          pass: options.password
        }
      })

      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      })

      return right(options)
    } catch (error) {
      return left(new MailServiceError())
    }
  }
}
