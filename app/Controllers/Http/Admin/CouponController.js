'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Coupon = use('App/Models/Coupon')
const Database = use('Database')
const Service = use('App/Services/Coupon/CouponService')

/**
 * Resourceful controller for interacting with coupons
 */
class CouponController {
  /**
   * Show a list of all coupons.
   * GET coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, pagination }) {
    const code = request.input('code')

    const query = Coupon.query()

    if (code) {
      // LIKE  = Case sitive
      // ILIKE = Not Case sitive
      query.where('code', 'ILIKE', `%${code}%`)
    }

    const coupons = await query.paginate(pagination.page, pagination.limit)
    return response.send(coupons)
  }

  /**
   * Create/save a new coupon.
   * POST coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const trx = Database.beginTransaction()
    /**
     * 1- Produto         - Pode ser utilziado apenas em produtos especificos
     * 2- Client          - Pode ser utilziado apenas em clientes especificos
     * 3- Client/Products - Pode ser utilziado apenas em clientes e produtos especificos
     * 4- Pode ser utilziado por qualquer cliente e em qualquer pedido
     */

    let can_use_for = { client: false, product: false }
    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type',
        'recursive'
      ])

      const { users, products } = request.only(['users', 'products'])
      const coupon = await Coupon.create(couponData, trx)
      // Starts serve layeer
      const service = new Service(coupon, trx)
      // Insere os relaconamento no DB
      if (users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }
      if (products && products.length > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }
      if (can_use_for.client && can_use_for.product) {
        coupon.can_use_for = 'product_client'
      } else if (!can_use_for.client && can_use_for.product) {
        coupon.can_use_for = 'product'
      } else if (can_use_for.client && !can_use_for.product) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()
      return response.status(201).send(coupon)
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Não foi possivel cadastrar o cupom' })
    }
  }

  /**
   * Display a single coupon.
   * GET coupons/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ params: { id }, response }) {
    const coupon = await Coupon.findOrFail(id)
    return response.send(coupon)
  }

  /**
   * Update coupon details.
   * PUT or PATCH coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    const trx = Database.beginTransaction()
    const coupon = Coupon.findOrFail(id)
    /**
     * 1- Produto         - Pode ser utilziado apenas em produtos especificos
     * 2- Client          - Pode ser utilziado apenas em clientes especificos
     * 3- Client/Products - Pode ser utilziado apenas em clientes e produtos especificos
     * 4- Pode ser utilziado por qualquer cliente e em qualquer pedido
     */

    let can_use_for = { client: false, product: false }
    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type',
        'recursive'
      ])
      coupon.merge(couponData)

      const { users, products } = request.only(['users', 'products'])

      // Starts serve layeer
      const service = new Service(coupon, trx)

      // Insere os relaconamento no DB
      if (users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }
      if (products && products.length > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }
      if (can_use_for.client && can_use_for.product) {
        coupon.can_use_for = 'product_client'
      } else if (!can_use_for.client && can_use_for.product) {
        coupon.can_use_for = 'product'
      } else if (can_use_for.client && !can_use_for.product) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()
      return response.status(200).send(coupon)
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Não foi possivel atualizar o cupom' })
    }
  }

  /**
   * Delete a coupon with id.
   * DELETE coupons/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, response }) {
    const trx = await Database.beginTransaction()
    const coupon = await Coupon.findOrFail(id)
    try {
      await coupon.products().detach([], trx)
      await coupon.orders().detach([], trx)
      await coupon.users().detach([], trx)
      await coupon.delete(trx)
      await trx.commit()
      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response
        .status(500)
        .send({ message: 'Não foi possivel deletar este cupom no momento' })
    }
  }
}

module.exports = CouponController
