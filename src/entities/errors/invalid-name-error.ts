export class InvalidNameError extends Error {
  readonly name = 'InvalidNameError'

  constructor (name: string) {
    super(`Invalid name: ${name}.`)
  }
}
