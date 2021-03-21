const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { validateErrorBody } = require('../../presenters/validator')
const { 
    validateActivateBody,
    checkUser
} = require('./rules')
const { activateUser } = require('../../database/repository/user')

exports.path = '/activate/user'
exports.method = 'post'
exports.middleware = [
    validateActivateBody,
    validateErrorBody,
    checkUser
]
exports.authenticate = false

exports.handler = controller(async ({ body: { _id } }, res) => {
    const user = await activateUser(_id)
    return res.status(status.CREATED).json(user)
})
