const { body } = require('express-validator')
const { controller } = require('../../presenters/controller')
const TokenGenerator = require('uuid-token-generator')
const { findUserByUsername, findGuest } = require('../../database/repository/user')
const { status } = require('../../presenters/http')
const { errorResponse } = require('../../presenters/handle')

exports.validateGuestBody = [
    body('username').trim().isString().notEmpty()
]

exports.generateActivationKey = controller((req, _, next) => {
    req.body.activation_key = (new TokenGenerator(256, TokenGenerator.BASE62)).generate();
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

exports.checkGuest = controller(async ({ _rt_auth_token: { username } }, res, next) => {
    const guest = await findGuest(username)
    if (!guest) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Não encontrado',
        'Convidado não encontrado'
    ))
    return next()
})