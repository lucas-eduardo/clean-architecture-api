import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left } from '@/shared'
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

  async perform (userData: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, EmailOptions>> {
    const userOrError = User.create(userData)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user = userOrError.value

    const greetings = `E aí <b>${user.name}</b>, beleza?`

    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: `${user.name} <${user.email}>`,
      html: `${greetings}<br><br>${this.emailOptions.html}`
    }

    return this.emailService.send(emailInfo)
  }
}
