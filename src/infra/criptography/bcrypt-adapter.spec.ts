import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'))
  }
}))
const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('BCrypt Adapter', () => {
  it('Should call BCrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('valid_password')
    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt)
  })
  it('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('valid_password')
    expect(hash).toBe('hashed_password')
  })
  // it('Should Throw error if Bcrypt Throw error in infraLayer', async () => {
  //   const sut = makeSut()
  //   jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const promise = sut.encrypt('valid_password')
  //   await expect(promise).rejects.toThrow()
  // })
})
