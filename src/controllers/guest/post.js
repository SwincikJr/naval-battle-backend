const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { validateErrorBody } = require('../../presenters/validator')
const { 
    validateGuestBody, 
    checkUsername
} = require('./rules')
const { createGuest } = require('../../database/repository/user')
const { generateToken } = require('../../presenters/jwt')

exports.path = '/guest/user'
exports.method = 'post'
exports.middleware = [
    validateGuestBody,
    validateErrorBody,
    checkUsername
]
exports.authenticate = false

exports.handler = controller(async ( {body }, res) => {
    const { _id,username } = await createGuest(body.username)
    return res.status(status.CREATED).json({ 
        username, 
        token: generateToken({ _id, username, guest:true }) 
    })
})