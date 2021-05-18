const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const {findGuestAndDelete} = require("../../database/repository/user")
const {checkGuest} = require("./rules")

exports.path = '/delete/guest'
exports.method = 'delete'
exports.middleware = [
    checkGuest
]
exports.authenticate = true


exports.handler = controller(async ({ _rt_auth_token: {_id} }, res) => {
    await findGuestAndDelete(_id)
    return res.status(status.OK).json({deleted:true})
})