import { Either, left, right } from '@/shared'

import { Email, Name, UserData } from './'
import { InvalidNameError, InvalidEmailError } from './errors'

export class User {
  public readonly email: Email
  public readonly name: Name

  private constructor (name: Name, email: Email) {
    this.name = name
    this.email = email
  }

  static create (user: UserData): Either<InvalidNameError | InvalidEmailError, User> {
    const nameOrError = Name.create(user.name)

    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    const emailOrError = Email.create(user.email)

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const name = nameOrError.value as Name
    const email = emailOrError.value as Email

    return right(new User(name, email))
  }
}
