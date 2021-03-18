const { body } = require('express-validator')
const { controller } = require('../../presenters/controller')
const TokenGenerator = require('uuid-token-generator')
const { findUserByEmail, findUserByUsername } = require('../../database/repository/user')
const { status } = require('../../presenters/http')
const { errorResponse } = require('../../presenters/handle')
const { hash } = require('../../presenters/encryptation')
const { sendMailTemplate } = require('../../presenters/email')

exports.validateUserBody = [
    body('email').isEmail(),
    body('username').trim().isString().notEmpty(),
    body('password').trim().isString().notEmpty()
]

exports.generateActivationKey = controller((req, _, next) => {
    req.body.activation_key = (new TokenGenerator(256, TokenGenerator.BASE62)).generate();
    return next()
})

exports.checkEmail = controller(async ({ body: { email } }, res, next) => {
    const user = await findUserByEmail(email)
    if (user) return res.status(status.BAD_REQUEST).json(errorResponse(
        'E-mail em uso!',
        'O endereço de e-mail informado já se encontra vincludado à outra conta.'
    ))
    return next()
})

exports.checkUsername = controller(async ({ body: { username } }, res, next) => {
    const user = await findUserByUsername(username)
    if (user) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Nome de usuário em uso!',
        'O nome de usuário informado já se encontra em uso.'
    ))
    return next()
})

exports.encryptPassword = controller((req, _, next) => {
    req.body.password = hash(req.body.password)
    return next()
})

exports.sendActivationEmail = (email, activation_key) => {
    const { BASE_URL_FRONT } = process.env
    const url = `${BASE_URL_FRONT}/user/activate?e=${email}&k=${activation_key}`
    return sendMailTemplate(
        email, 
        'Artemísia: Ativação de Conta', 
        'html',
        'activation',
        url
    )
}
