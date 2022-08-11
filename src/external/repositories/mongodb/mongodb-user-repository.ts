import { UserData } from '@/entities'
import { UserRepository } from '@/use-cases/register-user-on-mailing-list/ports'

import { MongoHelper } from './helpers'

export class MongodbUserRepository implements UserRepository {
  async add (user: UserData): Promise<void> {
    const userCollection = await MongoHelper.getCollection('users')

    const exists = await this.exists(user)

    if (!exists) {
      const userClone: UserData = {
        name: user.name,
        email: user.email
      }

      await userCollection.insertOne(userClone)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection('users')

    const result = await userCollection.findOne<UserData>({ email })

    return result
  }

  async findAllUsers (): Promise<UserData[]> {
    const userCollection = await MongoHelper.getCollection('users')

    const users = await userCollection.find().toArray()

    return users as unknown as UserData[]
  }

  async exists (user: UserData): Promise<boolean> {
    const result = await this.findUserByEmail(user.email)

    return result !== null
  }
}
