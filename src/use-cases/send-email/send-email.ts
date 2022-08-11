import { User } from '@/entities'
import { Either } from '@/shared'
import { MailServiceError } from '@/use-cases/errors'
import { UseCase } from '@/use-cases/ports'
import { EmailOptions, EmailService } from '@/use-cases/send-email/ports'

export class SendEmail implements UseCase {
  private readonly emailOptions: EmailOptions
  private readonly emailService: EmailService

  constructor (emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions
    this.emailService = emailService
  }

  async perform (user: User): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = `E aí <b>${user.name.value}</b>, beleza?`

    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: `${user.name.value} <${user.email.value}>`,
      html: `${greetings}<br><br>${this.emailOptions.html}`
    }

    return this.emailService.send(emailInfo)
  }
}
