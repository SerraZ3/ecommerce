'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, pagination }) {
    const name = request.input('name')

    const query = Product.query()

    if (name) {
      // LIKE  = Case sitive
      // ILIKE = Not Case sitive
      query.where('name', 'ILIKE', `%${name}%`)
    }

    const product = await query.paginate(pagination.page, pagination.limit)
    return response.send(product)
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { name, description, price, image_id } = request.all()
      const product = await Product.create({
        name,
        description,
        price,
        image_id
      })
      return response.status(201).send(product)
    } catch (error) {
      response
        .status(400)
        .send({ message: 'Não foi possivel criar o produto nesse momento!' })
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, response }) {
    const product = await Product.findOrFail(id)
    return response.send(product)
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)
    try {
      const { name, description, price, image_id } = request.all()
      product.merge({ name, description, price, image_id })
      await product.save()
      return response.send(product)
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Não foi possivel atualizar esse produto!' })
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, response }) {
    const product = await Product.findOrFail(id)
    try {
      await product.delete()
      return response.status(204).send()
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'Não foi possivel deletar esse produto' })
    }
  }
}

module.exports = ProductController
