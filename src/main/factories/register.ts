
import { NodemailerEmailService } from '@/external/mail-services'
import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { getEmailOptions } from '@/main/config/email'
import { RegisterAndSendEmail } from '@/use-cases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { SendEmail } from '@/use-cases/send-email'
import { RegisterAndSendEmailController } from '@/web-controllers'

export const makeRegisterSendEmailController = (): RegisterAndSendEmailController => {
  const mongoDbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)

  const emailService = new NodemailerEmailService()
  const sendEmailUseCase = new SendEmail(getEmailOptions(), emailService)
  const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUserOnMailingListUseCase, sendEmailUseCase)

  const registerUserController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)

  return registerUserController
}
