'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')
const Transformer = use('App/Transformers/Admin/CategoryTransformer')

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, transform, pagination }) {
    const title = request.input('title')

    const query = Category.query()

    if (title) {
      // LIKE  = Case sitive
      // ILIKE = Not Case sitive
      query.where('title', 'ILIKE', `%${title}%`)
    }

    var categories = await query.paginate(pagination.page, pagination.limit)
    categories = await transform.paginate(categories, Transformer)
    return response.send(categories)
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { title, description, image_id } = request.all()
      const category = await Category.create({ title, description, image_id })
      return response.status(201).send(category)
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Erro a processar a sua solicitação' })
    }
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, view }) {
    const category = await Category.findOrFail(id)
    return response.send(category)
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)

    const { title, description, image_id } = request.all()
    // Mescla as informações com a do bd
    category.merge({ title, description, image_id })
    category.save()

    return response.send(category)
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)
    try {
      await category.delete()
      return response.status(204).send()
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'Não foi possivel deletar essa categoria' })
    }
  }
}

module.exports = CategoryController
