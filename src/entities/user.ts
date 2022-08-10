import { Either, left } from '@/shared/either'

import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { Name } from './name'
import { UserData } from './user-data'

export class User {
  static create (user: UserData): Either<InvalidNameError | InvalidEmailError, User> {
    const nameOrError = Name.create(user.name)

    if (nameOrError.isLeft()) {
      return left(new InvalidNameError())
    }

    const emailOrError = Email.create(user.email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }
  }
}
