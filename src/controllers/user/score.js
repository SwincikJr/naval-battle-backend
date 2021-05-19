const { getUserScore } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { status } = require('../../presenters/http')
const { validadeGetScore } = require("./rules")

exports.path = '/score'
exports.method = 'get'
exports.middleware = [
    validadeGetScore
]
exports.authenticate = false //não tenho certeza 

exports.handler = controller(async ({ body }, res) => {
    const user = await getUserScore(body._id)
    return res.status(status.OK).json(user.score)
})