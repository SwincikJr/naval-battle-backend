const { status } = require('../../presenters/http')
const { errorResponse } = require('../../presenters/handle')
const { controller } = require("../../presenters/controller")
const { validateChangeBody,
        checkRecoveryPassword,
        encryptPassword
     } = require("./rules")
const { validateErrorBody } = require("../../presenters/validator")
const {updatePassword, findUserByQuery} = require("../../database/repository/user")

exports.path = '/change/password'
exports.method = 'put'
exports.middleware = [
    validateChangeBody,
    validateErrorBody,
    checkRecoveryPassword,
    encryptPassword
]
exports.authenticate = false

exports.handler = controller(async ({ body: {_id, password} }, res) => {
    await updatePassword(_id, password)
    const updatedUser = await findUserByQuery(_id)
    if(updatedUser.recovering)return res.status(status.BAD_REQUEST).json(errorResponse(
        'Falha ao autalizar a senha',
        'o status (recovering) da conta informada não foi alterado'
    ))
    return res.status(status.OK).json({ recovering: false })
})