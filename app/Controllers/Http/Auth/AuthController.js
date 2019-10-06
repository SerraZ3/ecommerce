'use strict'
const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {
  async register({ request, response }) {
    // Criando uma transaction (Serve para cadastrar diversos elementos no DB e garantir que ou todos serão cadastrados ou nenhum)
    const trx = await Database.beginTransaction()
    try {
      const { name, surname, email, password } = request.all()
      const user = await User.create({ name, surname, email, password }, trx)
      const userRole = await Role.findBy('slug', 'client')
      await user.role().attach([userRole.id], null, trx)
      // Roda todos os valores da trx e garante a persistencia
      await trx.commit()
      return response.status(201).send({ data: user })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({ message: 'Erro ao realizar cadastro' })
    }
  }
  async login({ request, response, auth }) {}
  async refresh({ request, response, auth }) {}
  async logout({ request, response, auth }) {}
  async forgot({ request, response }) {}
  async remember({ request, response }) {}
  async reset({ request, response }) {}
}

module.exports = AuthController
