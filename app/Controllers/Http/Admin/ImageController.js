'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Image = use('App/Models/Image')
const { manage_single_upload, manage_multiple_upload } = use('App/Helpers')
const fs = use('fs')

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Show a list of all images.
   * GET images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, pagination }) {
    const images = await Image.query()
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.limit)
    return response.send(images)
  }

  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      // Captura uma image ou mais do request
      const fileJar = request.file('images', {
        types: ['image'],
        size: '2mb'
      })
      //Retorno do usuário
      let images = []
      //Caso seja um unico arquivo - manage_single_upload
      //Caso seja multiplos arquivo - manage_multiple_upload
      if (!fileJar.files) {
        const file = await manage_single_upload(fileJar)

        if (file.moved()) {
          const image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          })
          image.push(image)
          return response.status(201).send({ successes: images, errors: {} })
        }
        return response
          .status(400)
          .send({ message: 'Não foi possivel acessar esta imagem no momento!' })
      }
      let files = await manage_multiple_upload(fileJar)
      await Promise.all(
        files.successes.map(async file => {
          const image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          })
          image.push(image)
        })
      )
      return response
        .status(201)
        .send({ successes: images, errors: files.errors })
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Não foi possivel processar sua operação' })
    }
  }

  /**
   * Display a single image.
   * GET images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, response }) {
    const image = await Image.findOrFail(id)
    response.send(image)
  }

  /**
   * Update image details.
   * PUT or PATCH images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)
    try {
      image.marge[request.only(['original_name'])]
      image.save()
      response.status(200).send(image)
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Não foi possivel atualizar essa imagem no momento' })
    }
  }

  /**
   * Delete a image with id.
   * DELETE images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)
    try {
      let filepath = Helpers.publicPath(`uploads/${image.path}`)
      fs.unlinkSync(filepath)
      await image.delete()
    } catch (error) {
      response
        .status(400)
        .send({ message: 'Nâo foi possivel deletar a imagem no momento' })
    }
  }
}

module.exports = ImageController
