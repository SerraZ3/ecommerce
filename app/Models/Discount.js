'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Discount extends Model {
  static boot() {
    super.boot()
    this.addHook('beforeSave', 'DiscountHook.calculateValues')
    this.addHook('afterSave', 'DiscountHook.decrementCoupons')
    this.addHook('afterDelete', 'DiscountHook.incrementCoupons')
  }
  // Diz a tabela que esse model é vinculado pois nao existe table discount
  static get table() {
    return 'coupon_order'
  }
  // Diz qual o campo da minha tabela que respresenta a chave estrangeira
  order() {
    return this.belongsTo('App/Model/Order', 'order_id', 'id')
  }
  // Diz qual o campo da minha tabela que respresenta a chave estrangeira
  coupon() {
    return this.belongsTo('App/Model/Coupon', 'coupon_id', 'id')
  }
}

module.exports = Discount
