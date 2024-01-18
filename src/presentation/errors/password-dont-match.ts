export class PasswordDontMatchError extends Error {
  constructor () {
    super('Password and PasswordConfirmation dont match')
    this.name = 'PasswordDontMatchError'
  }
}
