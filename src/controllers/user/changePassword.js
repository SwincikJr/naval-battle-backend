const { controller } = require("../../presenters/controller")
const { validateChangeBody,
        checkRecoveryPassword,
        encryptPassword
     } = require("./rules")
const { validateErrorBody } = require("../../presenters/validator")
const {findUserAndUpdatePassword} = require("../../database/repository/user")

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
    await findUserAndUpdatePassword(_id, password)
    return res.status(status.OK).json({ recovering: false })
})