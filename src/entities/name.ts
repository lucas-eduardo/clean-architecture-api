import { Either, left, right } from '@/shared'

import { InvalidNameError } from './errors'

export class Name {
  public readonly value: string

  private constructor (name: string) {
    this.value = name
  }

  static create (name: string): Either<InvalidNameError, Name> {
    if (!Name.validate(name)) {
      return left(new InvalidNameError(name))
    }

    return right(new Name(name))
  }

  static validate (name: string) {
    if (!name) {
      return false
    }

    if (name.trim().length < 2) {
      return false
    }

    if (name.trim().length > 256) {
      return false
    }

    return true
  }
}
