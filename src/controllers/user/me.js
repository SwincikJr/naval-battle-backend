const { controller } = require('../../presenters/controller')
const { checkExistsQuery } = require('./rules')
const { findUserByQuery } = require('../../database/repository/user')
const { status } = require('../../presenters/http')

exports.path = '/user/me'
exports.method = 'get'
exports.middleware = []
exports.authenticate = true

exports.handler = controller(async (req, res) => {
    const user = await findUserByQuery({ _id: req._rt_auth_token._id })
    return res.status(status.OK).json({ coins: user.coins, diamonds: user.diamonds })
})
