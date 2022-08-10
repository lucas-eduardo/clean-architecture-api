export class InvalidEmailError extends Error {
  readonly name = 'InvalidEmailError'

  constructor (email: string) {
    super(`Invalid email: ${email}.`)
  }
}
