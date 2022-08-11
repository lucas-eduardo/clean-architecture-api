import { UserData } from '@/entities'
import { UseCase } from '@/use-cases/ports'

import { MissingParamError } from './errors'
import { HttpRequest, HttpResponse } from './ports'
import { badRequest, created, serverError } from './util'

export class RegisterUserController {
  private readonly useCase: UseCase

  constructor (useCase: UseCase) {
    this.useCase = useCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.name || !request.body.email) {
        let missingParam = !(request.body.name) ? 'name ' : ''
        missingParam += !(request.body.email) ? 'email' : ''

        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const userData: UserData = request.body

      const response = await this.useCase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return created(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
