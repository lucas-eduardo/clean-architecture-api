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

  async perform (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, User>> {
    const userOrError = User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const userData = {
      name: userOrError.value.name.value,
      email: userOrError.value.email.value
    }

    await this.registerUserOnMailingList.perform(userData)

    const result = await this.sendEmail.perform(userData)

    if (result.isLeft()) {
      return left(result.value)
    }

    return right(userOrError.value)
  }
}
