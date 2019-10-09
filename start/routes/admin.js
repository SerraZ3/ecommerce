/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  /**
   *
   * Rotas para categorias:
   * index/store/show/update/destroy
   *
   * */

  Route.resource('categories', 'CategoryController').apiOnly()
  /**
   *
   * Rotas para Product:
   * index/store/show/update/destroy
   *
   * */
  Route.resource('products', 'ProductController').apiOnly()
  /**
   *
   * Rotas para coupon:
   * index/store/show/update/destroy
   *
   * */
  Route.resource('coupons', 'CouponController').apiOnly()
  /**
   *
   * Rotas para order:
   * index/store/show/update/destroy
   *
   * */

  // Se a rota for igual a resource do controller, deve ser add antes dele, pois se não irá falhar
  Route.post('orders/:id/discount', 'OrderController.applyDiscount')
  Route.delete('orders/:id/discount', 'OrderController.removeDiscount')

  Route.resource('orders', 'OrderController').apiOnly()
  /**
   *
   * Rotas para image:
   * index/store/show/update/destroy
   *
   * */
  Route.resource('images', 'ImageController').apiOnly()
  /**
   *
   * Rotas para user:
   * index/store/show/update/destroy
   *
   * */
  Route.resource('users', 'UserController').apiOnly()
})
  .prefix('v1/admin')
  .namespace('Admin')
