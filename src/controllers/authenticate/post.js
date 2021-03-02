const { status } = require('../../presenters/http')
const { generateToken } = require('../../presenters/jwt')

exports.path = '/authenticate'
exports.method = 'post'
exports.middleware = []
exports.authenticate = false

exports.handler = async (req, res) => {
    return res.status(status.OK).json({ token: generateToken({ success: true }) })
}