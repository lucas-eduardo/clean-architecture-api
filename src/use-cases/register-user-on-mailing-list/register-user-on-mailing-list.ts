import { User, UserData } from '@/entities'
import { InvalidNameError, InvalidEmailError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/use-cases/ports'

import { UserRepository } from './ports'

export class RegisterUserOnMailingList implements UseCase {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  async perform (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
    const userOrError = User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    if (!await this.userRepo.exists(request)) {
      await this.userRepo.add(request)
    }

    return right(request)
  }
}
