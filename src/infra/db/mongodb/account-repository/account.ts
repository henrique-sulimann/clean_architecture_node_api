// import { AddAccountModelRepository, AddAccountRepository } from '../../../../data/protocols/add-account-repository'
// import { MongoHelper } from '../helpers/mongo-helper'

// export class AccountMongoRepository implements AddAccountRepository {
//   async add (account: AddAccountModelRepository): Promise<any> {
//     const accountCollection = MongoHelper.getCollection('accounts')
//     const result = await accountCollection.insertOne(account)
//     // const accountData = result.op[0]
//     return result
//   }
// }
