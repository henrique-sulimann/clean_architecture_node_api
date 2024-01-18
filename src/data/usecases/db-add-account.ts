import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Encrypter } from '../protocols/encrypter'
import { AddAccountRepository } from '../protocols/add-account-repository'

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    const hashedPassword = await this.encrypter.encrypt(password)
    const accountResult = await this.addAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    )
    return await new Promise((resolve) =>
      resolve(accountResult)
    )
  }
}
