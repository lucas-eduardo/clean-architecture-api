import { Either } from '@/shared'
import { MailServiceError } from '@/use-cases/errors'

export interface EmailOptions {
  readonly host: string
  readonly port: number
  readonly username: string
  readonly password: string
  readonly from: string
  readonly to: string
  readonly subject: string
  readonly text: string
  readonly html?: string
  readonly attachments?: Object[]
}

export interface EmailService {
  send: (options: EmailOptions) => Promise<Either<MailServiceError, EmailOptions>>
}
