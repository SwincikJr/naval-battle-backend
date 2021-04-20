const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const {findUserAndDelete} = require("../../database/repository/user")

exports.path = '/delete/user'
exports.method = 'put'
exports.middleware = []
exports.authenticate = true


exports.handler = controller(async ({ _rt_auth_token: {_id} }, res) => {
    await findUserAndDelete(_id)
    return res.status(status.OK).json({deleted:true})
})