import { SignUpController } from './signup'
import { MissimParamError } from '../errors/missim-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'
import { PasswordDontMatchError } from '../errors/password-dont-match'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account'

interface SubTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const { name, email, password } = account
      return await new Promise(resolve => resolve({ id: '1', name, email, password }))
    }
  }
  return new AddAccountStub()
}
const makeSUT = (): SubTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}
describe('SignUpController', () => {
  it('Should Return 400 if no name provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        // name: 'any_name',
        email: 'email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissimParamError('name')
    )
  })
  it('Should Return 400 if no email provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        // email: 'email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissimParamError('email')
    )
  })
  it('Should Return 400 if no password provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@mail.com',
        // password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissimParamError('password')
    )
  })
  it('Should Return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('email')
    )
  })
  it('Should Return 500 if EmailValidator throw InternalServerError', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(
      new ServerError()
    )
  })
  it('Should Return 500 if EmailValidator throw InternalServerError', async () => {
    const { sut, addAccountStub } = makeSUT()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(
      new ServerError()
    )
  })
  it('Should Return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(httpRequest.body.email)
  })
  it('Should Return 400 if no password confirmation provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@mail.com',
        password: 'password'
        // passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissimParamError('passwordConfirmation')
    )
  })
  it('Should Return 400 if password and passwordConfirmation dont match', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@mail.com',
        password: 'password',
        passwordConfirmation: 'password1'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new PasswordDontMatchError()
    )
  })
  it('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSUT()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'email@mail.com',
      password: 'password'
    })
  })
  it('Should Return 200 if all success provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@mail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: '1',
      name: 'any_name',
      email: 'email@mail.com',
      password: 'password'
    })
  })
})
