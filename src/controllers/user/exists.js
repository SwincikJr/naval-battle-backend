const { controller } = require('../../presenters/controller')
const { checkExistsQuery } = require('./rules')
const { findUserByQuery } = require('../../database/repository/user')
const { status } = require('../../presenters/http')

exports.path = '/exists/user'
exports.method = 'get'
exports.middleware = [checkExistsQuery]
exports.authenticate = false

exports.handler = controller(async ({ query: { property, value } }, res) => {
    const query = {}
    query[property] = value
    const user = await findUserByQuery(query)
    return res.status(status.OK).json({ exists: user ? true : false })
})
