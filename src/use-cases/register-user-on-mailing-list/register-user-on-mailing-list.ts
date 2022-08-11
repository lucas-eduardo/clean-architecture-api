import { User, UserData } from '@/entities'
import { UseCase } from '@/use-cases/ports'

import { UserRepository } from './ports'

export class RegisterUserOnMailingList implements UseCase {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  async perform (request: User): Promise<UserData> {
    const user = {
      name: request.name.value,
      email: request.email.value
    }

    if (!await this.userRepo.exists(user)) {
      await this.userRepo.add(user)
    }

    return user
  }
}
