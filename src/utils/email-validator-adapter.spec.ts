import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'
jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('EmailValidatorAdapter Tests', () => {
  it('Should return false if validation functioon retorn false', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
  it('Should return true if validation functioon retorn true', async () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })
  it('Should call validator with correct value', async () => {
    const sut = makeSut()
    const emailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid_email@email.com')
    expect(emailSpy).toHaveBeenCalledWith('valid_email@email.com')
  })
})
