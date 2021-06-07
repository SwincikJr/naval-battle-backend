const { createItem } = require("../../database/repository/loja")
const { controller } = require("../../presenters/controller")
const { status } = require('../../presenters/http')
const { validateItemCreate } = require("./rules")

exports.path = '/loja/create'
exports.method = 'post'
exports.middleware = [
    validateItemCreate
]
exports.authenticate = false

exports.handler = controller(async ({ body }, res) => {
    if (body.tipo != 'OURO' && body.tipo != 'REAL') return res.status(status.BAD_REQUEST).json({ msg: 'Tipo inválido' })
    const item = await createItem(body)
    res.status(status.CREATED).json(item)
})