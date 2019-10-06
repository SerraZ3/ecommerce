'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CuponSchema extends Schema {
  up() {
    this.create('cupons', table => {
      table.increments()
      table.string('code', 100).notNullable()
      table.dateTime('valid_from')
      table.dateTime('valid_until')
      table.integer('quantify').defaultTo(1)

      // Diz em que caso o cupon pode ser usado
      table.enu('can_use_for', ['product', 'client', 'product_client', 'all'])
      // Forma de aplicação do cupon
      table.enu('type', ['free', 'percent', 'currency']).defaultTo('currency')
      // O cupon pode ser aplicado juntamente com outros cupons
      table.boolean('recursive').defaultTo('false')
      table.timestamps()
    })
  }

  down() {
    this.drop('cupons')
  }
}

module.exports = CuponSchema
