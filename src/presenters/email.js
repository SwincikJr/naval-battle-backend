const nodemailer = require('nodemailer')
const { applyParams } = require('./template')

const buildTemplate = (template, params) => {
  let content = require(`./templates/${template}`)
  content = applyParams(content, params)
  return content
}

const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SENDER_HOST,
    port: process.env.EMAIL_SENDER_PORT,
    secure: process.env.EMAIL_SENDER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SENDER_USER,
      pass: process.env.EMAIL_SENDER_PASS,
    },
    tls: { rejectUnauthorized: false },
  })
}

const setMailOptions = (from, to, subject, content, type) => {
  const mailOptions = { from, to, subject }
  mailOptions[type] = content
  return mailOptions
}

/**
 * @param  {String} to - O endereço de e-mail de destino
 * @param  {String} subject - O assunto do e-mail
 * @param  {String} type - Tipo da mensagem: 'html' ou 'text'
 * @param {String} template - nome do arquivo de template a ser utilizado no conteúdo do e-mail
 * @param {String} params - valores a serem utilizados na montagem do template
 * @returns {Promise} Result - resultado da query ou stack de new Error()
 */
exports.sendMailTemplate = (to, subject, type, template, ...params) => {
  const content = buildTemplate(template, params)

  const transport = createTransport()

  return transport.sendMail(
    setMailOptions(process.env.EMAIL_SENDER_USER, to, subject, content, type)
  )
}