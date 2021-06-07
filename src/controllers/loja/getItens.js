const { findAll } = require("../../database/repository/loja")
const { controller } = require("../../presenters/controller")
const { status } = require('../../presenters/http')
const { validateGetItem } = require("./rules")

exports.path = '/loja'
exports.method = 'get'
exports.middleware = [
    validateGetItem
]
exports.authenticate = false

exports.handler = controller(async ({ body }, res) => {
    const itens = await findAll()
    return res.status(status.OK).json(itens)
})