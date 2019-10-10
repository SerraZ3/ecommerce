'use strict'

class Login {
  get rules() {
    return {
      // validation rules
      email: 'required|email',
      password: 'required'
    }
  }
  // Mostra todos os erros ao inves de apenas um
  get validateAll() {
    return true
  }
  get messages() {
    return {
      'email.required': 'O e-mail é obrigatório',
      'password.required': 'A senha é obrigatório'
    }
  }
}

module.exports = Login
