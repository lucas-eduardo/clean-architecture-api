import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'

import { MissingParamError } from './errors'
import { HttpRequest, HttpResponse } from './ports'
import { badRequest, created } from './util'

export class RegisterUserController {
  private readonly useCase: RegisterUserOnMailingList

  constructor (useCase: RegisterUserOnMailingList) {
    this.useCase = useCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    if (!request.body.name || !request.body.email) {
      let missingParam = !(request.body.name) ? 'name ' : ''
      missingParam += !(request.body.email) ? 'email' : ''

      return badRequest(new MissingParamError(missingParam.trim()))
    }

    const userData: UserData = request.body

    const response = await this.useCase.registerUserOnMailingList(userData)

    if (response.isLeft()) {
      return badRequest(response.value)
    }

    if (response.isRight()) {
      return created(response.value)
    }
  }
}
