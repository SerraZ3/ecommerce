'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  /**
   * Relacionamente entre imagem e categoria
   */
  image() {
    return this.belongsTo('App/Models/Image')
  }
  /**
   * Relacionamente entre imagem e categoria
   */
  products() {
    return this.belongsToMany('App/Models/Product')
  }
}

module.exports = Category
