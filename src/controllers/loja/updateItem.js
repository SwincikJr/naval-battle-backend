const { findItemUpdate } = require("../../database/repository/loja")
const { controller } = require("../../presenters/controller")
const { validateGetItem } = require("./rules")
const { status } = require('../../presenters/http')

exports.path = '/loja/update'
exports.method = 'put'
exports.middleware = [
    validateGetItem
]
exports.authenticate = false

exports.handler = controller(async ({ body }, res) => {
    if (body.tipo && (body.tipo != 'OURO' && body.tipo != 'REAL')) return res.status(status.BAD_REQUEST).json({ msg: 'Tipo inválido' })
    await findItemUpdate(body._id, body)
    return res.status(status.OK).json(body)
})
