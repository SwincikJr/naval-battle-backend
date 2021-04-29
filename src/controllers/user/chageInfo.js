const { updateUserInfo } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { status } = require('../../presenters/http')
const { validateUpdateUserBody } = require("./rules")

exports.path = '/change/info'
exports.method = 'put'
exports.middleware = [
    validateUpdateUserBody
]
exports.authenticate = true

exports.handler = controller(async ({ body }, res) => {
    delete body.password
    delete body.activation_key
    delete body.activated
    delete body.recovering
    delete body.deleted
    const user = await updateUserInfo(body._id, body)
    return res.status(status.CREATED).json(user)
})