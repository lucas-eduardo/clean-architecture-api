import { User } from './user'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'

    const error = User.create({ name: 'john doe', email: invalidEmail }).value as Error

    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual(`Invalid email: ${invalidEmail}.`)
  })

  test('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'J    '

    const error = User.create({ name: invalidName, email: 'john@dow.com' }).value as Error

    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`)
  })

  test('should not create user with invalid name (too many characters)', () => {
    const invalidName = 'john doe'.repeat(248)

    const error = User.create({ name: invalidName, email: 'john@dow.com' }).value as Error

    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`)
  })

  test('should create user with valid data', () => {
    const validName = 'John Doe'
    const validEmail = 'john@doe.com'

    const user = User.create({ name: validName, email: validEmail }).value as User

    expect(user.name.value).toEqual(validName)
    expect(user.email.value).toEqual(validEmail)
  })
})
