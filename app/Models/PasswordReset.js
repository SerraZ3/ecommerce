'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PasswordReset extends Model {
  static boot() {
    super.boot()

    // Sempre antes de resetar a senha irá gerar um token e colocar um periodo de 30 min para a pessoa resetar
    this.addHook('beforeCreate', async model => {
      model.token = await str_ramdom(25)
      const expires_at = new Date()
      expires_at.setMinutes(expires_at.getMinutes() + 30)
      model.expires_at = expires_at
    })
  }

  // Formata os valores para o padrão do pg
  static get date() {
    return ['created_at', 'updated_at', 'expires_at']
  }
}

module.exports = PasswordReset