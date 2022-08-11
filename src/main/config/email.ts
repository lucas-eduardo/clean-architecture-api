import { join } from 'node:path'

import { EmailOptions } from '@/use-cases/send-email/ports'

const attachments = [{
  filename: 'text.txt',
  path: join(process.cwd(), 'resourcers', 'text.txt')
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Lucas Eduardo <dev@lucaseduardo.io>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from,
    to,
    subject: 'Mensagem de teste',
    text: 'Texto da mensagem',
    html: '<b>Texto da mensagem</b>',
    attachments
  }

  return mailOptions
}
