const { setUserNotWaiting } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { status } = require("../../presenters/http")

exports.path = '/game/cancel'
exports.method = 'post'
exports.middleware = []
exports.authenticate = true

exports.handler = controller(async ({ _rt_auth_token: { _id } }, res) => {
    await setUserNotWaiting(_id)
    return res.status(status.OK).json({ success: true })
})
