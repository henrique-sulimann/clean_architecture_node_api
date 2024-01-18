export class MissimParamError extends Error {
  constructor (paramName: string) {
    super(`Missim Param: ${paramName}`)
    this.name = 'MissimParamError'
  }
}
