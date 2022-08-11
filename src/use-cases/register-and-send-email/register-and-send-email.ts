import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/use-cases/ports'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { SendEmail } from '@/use-cases/send-email'

import { MailServiceError } from '../errors'

export class RegisterAndSendEmail implements UseCase {
  private registerUserOnMailingList: RegisterUserOnMailingList
  private sendEmail: SendEmail

  constructor (registerUserOnMailingList: RegisterUserOnMailingList, sendEmail: SendEmail) {
    this.registerUserOnMailingList = registerUserOnMailingList
    this.sendEmail = sendEmail
  }

  async perform (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>> {
    const userOrError = User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user = userOrError.value

    await this.registerUserOnMailingList.perform(user)

    const result = await this.sendEmail.perform(user)

    if (result.isLeft()) {
      return left(result.value)
    }

    return right({ name: user.name.value, email: user.email.value })
  }
}
