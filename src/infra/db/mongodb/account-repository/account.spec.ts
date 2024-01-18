// import { MongoHelper } from '../helpers/mongo-helper'
// import { AccountMongoRepository } from './account'
// describe('Account MongoDB Repository', () => {
//   beforeAll(async () => {
//     await MongoHelper.connect(process.env.MONGO_URL ?? 'teste')
//   })
//   afterAll(async () => {
//     await MongoHelper.disconnect()
//   })
//   it('Should return an account on success', async () => {
//     const sut = new AccountMongoRepository()
//     const account = await sut.add({
//       name: 'any_name',
//       email: 'any_email@email.com',
//       password: 'any_password'
//     })
//     expect(account).toBeTruthy()
//     expect(account.id).toBe('any_id')
//     expect(account.name).toBe('any_name')
//     expect(account.email).toBe('any_email@email.com')
//     expect(account.password).toBe('any_password')
//   })
// })
