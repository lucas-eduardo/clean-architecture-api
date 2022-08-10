import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'

import { HttpRequest, HttpResponse } from './ports'
import { created } from './util'

export class RegisterUserController {
  private readonly useCase: RegisterUserOnMailingList

  constructor (useCase: RegisterUserOnMailingList) {
    this.useCase = useCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const userData: UserData = request.body

    const response = await this.useCase.registerUserOnMailingList(userData)

    if (response.isRight()) {
      return created(response.value)
    }
  }
}
