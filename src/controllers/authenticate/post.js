const { status } = require('../../presenters/http')
const { generateToken } = require('../../presenters/jwt')
const { validateAuthBody } = require('./rules')
const { validateErrorBody } = require('../../presenters/validator')
const { findUserByEmailOrUsername } = require('../../database/repository/user')
const { compare } = require('../../presenters/encryptation')
const { errorResponse } = require('../../presenters/handle')
const { controller } = require('../../presenters/controller')

exports.path = '/authenticate'
exports.method = 'post'
exports.middleware = [
    validateAuthBody,
    validateErrorBody
]
exports.authenticate = false

exports.handler = controller(async ({ body: { login, password } }, res) => {
    const user = await findUserByEmailOrUsername(login)
    if (!user || !compare(password, user.password))
        return res.status(status.UNAUTHORIZED).json(errorResponse(
            'Falha no login!',
            'Login/senha incorreto.'
        ))
    if (!user.activated) 
        return res.status(status.BAD_REQUEST).json(errorResponse(
            'E-mail não confirmado.',
            'O endereço de e-mail ainda não foi confirmado.'
        ))
    return res.status(status.OK).json({ 
        username: user.username, 
        email: user.email, 
        token: generateToken({ _id: user._id }) 
    })
})