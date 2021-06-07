const { controller } = require("../../presenters/controller")
const { status } = require('../../presenters/http')
const { validateGetItem } = require("./rules")
const { removeItem } = require("../../database/repository/loja")

exports.path = '/loja/remove'
exports.method = 'delete'
exports.middleware = [
    validateGetItem
]
exports.authenticate = false

exports.handler = controller(async ({ body }, res) => {
    await removeItem(body._id)
    res.status(status.OK).json({})
})