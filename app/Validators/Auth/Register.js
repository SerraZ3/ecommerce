'use strict'

class AuthRegister {
  get rules() {
    return {
      // validation rules
      name: 'required',
      surname: 'required',
      email: 'required|email|unique:users,email',
      password: 'required|confirmed'
    }
  }
  get messages() {
    return {
      'name.required': 'O nome é obrigatório',
      'surname.required': 'O sobrenome é obrigatório',
      'email.required': 'O e-mail é obrigatório',
      'email.email': 'O e-mail inválido',
      'email.unique': 'Este E-mail já existe',
      'password.required': 'A senha é obrigatório',
      'password.confirmed': 'As senha não são iguais'
    }
  }
}

module.exports = AuthRegister
