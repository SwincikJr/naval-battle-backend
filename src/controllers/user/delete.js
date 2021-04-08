const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { validateErrorBody } = require('../../presenters/validator')
const {findUserAndDelete} = require("../../database/repository/user")
const { validateToken } = require('../../presenters/jwt')
const { errorResponse } = require('../../presenters/handle')
const { 
    validateTokenBody
} = require('./rules')

exports.path = '/delete/user'
exports.method = 'put'
exports.middleware = [
    validateTokenBody,
    validateErrorBody
]
exports.authenticate = false

exports.handler = controller(async ({ body: {token} }, res) => {
    const data = await validateToken(token)
    const user = await findUserAndDelete(data._id)
    if(user.nModified == 1)return res.status(status.OK).json({deleted:true})
    return res.status(status.BAD_REQUEST).json(errorResponse(
        'Falha ao deletar',
        'A conta informada não foi alterada'
    ))
})