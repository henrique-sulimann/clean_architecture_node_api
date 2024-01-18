/*
Interface para passar para o nosso parâmetro de account que a nossa interface
AddAccountRepository irá receber
*/
export interface AddAccountModelRepository {
  name: string
  email: string
  password: string
}
/*
Interface de retorno do método que a interface AddAccountRepository irá retornar
para que seja enviado para a classe de cadastro no banco de dados
*/
export interface AccountModelRepository {
  id: string
  name: string
  email: string
  password: string
}
/*
Interface que terá o método para adicionar usuários no banco de dados
Vejamos que esta é apenas uma interface que será implementada pela nossa classe
de cadastro de banco de dados, ou seja, realizando a inversão de dependencia
*/
export interface AddAccountRepository {
  add: (account: AddAccountModelRepository) => Promise<AccountModelRepository>
}
