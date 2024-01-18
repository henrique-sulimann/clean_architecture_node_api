import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissimParamError } from '../errors/missim-param-error'
import { badRequest, internalServerError, ok } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'
import { PasswordDontMatchError } from '../errors/password-dont-match'
import { AddAccount } from '../../domain/usecases/add-account'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissimParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new PasswordDontMatchError())
      }
      const accountReturn = await this.addAccount.add({
        name,
        email,
        password
      })
      return await new Promise(resolve => resolve(ok(accountReturn)))
    } catch (error) {
      return internalServerError()
    }
  }
}
