/*
Interface para o nosso método de Encrypt de passowrd
Aqui é onde nós fazemos a inversão da dependência de uma classe externa
como o "bcrypt" fazendo com que todo o nosso código de usecases seja totalmente
desacoplado de classes externas
*/
export interface Encrypter {
  encrypt: (password: string) => Promise<string>
}
