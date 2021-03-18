const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { validateErrorBody } = require('../../presenters/validator')
const { 
    validateUserBody, 
    generateActivationKey, 
    checkEmail, 
    checkUsername, 
    encryptPassword,
    sendActivationEmail
} = require('./rules')
const { createUser } = require('../../database/repository/user')

exports.path = '/user'
exports.method = 'post'
exports.middleware = [
    validateUserBody,
    validateErrorBody,
    checkEmail,
    checkUsername,
    generateActivationKey,
    encryptPassword
]
exports.authenticate = false

exports.handler = controller(async ({ body }, res) => {
    const { _id, username, email } = await createUser(body)
    sendActivationEmail(email, body.activation_key)
    return res.status(status.CREATED).json({ _id, username, email })
})
