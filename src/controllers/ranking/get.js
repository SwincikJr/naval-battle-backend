const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const {findByScore, findOneScore} = require('../../database/repository/user')

exports.path = '/ranking'
exports.method = 'get'
exports.middleware = []
exports.authenticate = true


exports.handler = controller(async ({ _rt_auth_token: {_id} }, res) => {
    const ranking = await findByScore()
    const myScore = await findOneScore(_id)
    return res.status(status.OK).json({ranking,myScore})
})