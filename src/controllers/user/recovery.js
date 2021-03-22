const { setRecovering } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { validateRecoveryBody, checkLogin, generateActivationKey, sendRecoveryMail } = require("./rules")

exports.path = '/recovery/password'
exports.method = 'post'
exports.middleware = [
    validateRecoveryBody,
    validateErrorBody,
    checkLogin,
    generateActivationKey
]
exports.authenticate = false

exports.handler = controller(async ({ body: { _id, email, activation_key } }, res) => {
    await setRecovering(_id, activation_key)
    sendRecoveryMail(email, activation_key)
    return res.status(status.OK).json({ recovering: true })
})
