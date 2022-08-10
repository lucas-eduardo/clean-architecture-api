import { Email } from './email'

describe('Email validation', () => {
  test('should not accept null', () => {
    const email = null

    expect(Email.validate(email)).toBeFalsy()
  })

  test('should not accept undefined', () => {
    const email = undefined

    expect(Email.validate(email)).toBeFalsy()
  })

  test('should not accept empty', () => {
    const email = ''

    expect(Email.validate(email)).toBeFalsy()
  })

  test('should accept valid email', () => {
    const email = 'john@doe.com'

    expect(Email.validate(email)).toBeTruthy()
  })

  test('should not accept strings larger than 320 chars', () => {
    const email = 'john'.repeat(160) + 'doe'.repeat(160) + '@doe.com'

    expect(Email.validate(email)).toBeFalsy()
  })

  test('should not accept local part larger than 64 chars', () => {
    const email = 'john'.repeat(65) + '@doe.com'

    expect(Email.validate(email)).toBeFalsy()
  })
})
