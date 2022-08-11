export class MailServiceError extends Error {
  readonly name = 'MailServiceError'

  constructor () {
    super('Mail service error')
  }
}
