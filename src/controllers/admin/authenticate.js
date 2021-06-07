const { status } = require('../../presenters/http')
const { generateToken } = require('../../presenters/jwt')
const { validateAuthBody } = require('./rules')
const { validateErrorBody } = require('../../presenters/validator')
const { controller } = require('../../presenters/controller')
const { findAdminByUsername } = require('../../database/repository/admin')
const { compare } = require('../../presenters/encryptation')
const { errorResponse } = require('../../presenters/handle')

exports.path = '/admin/authenticate'
exports.method = 'post'
exports.middleware = [
    validateAuthBody,
    validateErrorBody
]
exports.authenticate = false

exports.handler = controller(async ({ body: { username, password } }, res) => {
    const admin = await findAdminByUsername(username)
    if (!admin || !compare(password, admin.password)) 
        return res.status(status.UNAUTHORIZED).json(errorResponse(
            'Falha no login!',
            'Login/senha incorreto.'
        ))
    return res.status(status.OK).json({ 
        username: admin.username, 
        token: generateToken({ _id: admin._id, username: admin.username }) 
    })
})