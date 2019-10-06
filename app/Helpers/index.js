'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')

/**
 * Generate random string
 *
 * @param {int} length - 0 tamanho da string que voce quer gerar
 * @return {string} - uma string randomica do tamanho do length
 */
const str_random = async (length = 40) => {
  let string = ''
  let len = string.length

  if (len < length) {
    let size = length - len
    let bytes = await crypto.randomBytes(size)
    let buffer = Buffer.from(bytes)
    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }
  return string
}
/**
 * Move um unico arquivo para o caminho especificado, se nenhum for especificado entao o public/uploads será utilizado
 *
 * @param {FileJar} file arquvio a ser gerenciado
 * @param {string} path caminho onde o arquvio deve ser movido
 * @return {Object<fileJar>}
 */
const manage_single_upload = async (file, path = null) => {
  path ? path : Helpers.publicPath('uploads')

  // Gera nome aleatorio
  const random_name = await str_random(30)
  let filename = `${new Date().getTime()}-${random_name}.${file.subtpe}`

  // Renomeia o arquivo e move ele para o path
  await file.move(path, { name: filename })

  return file
}

/***
 * Move um mulitplos arquivo para o caminho especificado, se nenhum for especificado entao o public/uploads será utilizado
 * @param {FileJar} fileJar arquvio a ser gerenciado
 * @param {string} path caminho onde o arquvio deve ser movido
 */
const manage_multiple_upload = async (file, path = null) => {
  path ? path : Helpers.publicPath('uploads')

  let successes = [],
    errors = []

  await Promise.all(
    fileJar.files.map(async file => {
      let random_name = await str_random(30)
      let filename = `${new Date().getTime()}-${random_name}.${file.subtpe}`

      // Renomeia o arquivo e move ele para o path
      await file.move(path, { name: filename })

      if (file.moved()) {
        successes.push(file)
      } else {
        errors.push(file)
      }
    })
  )

  return { successes, errors }
}

module.exports = {
  str_random,
  manage_single_upload,
  manage_multiple_upload
}
