const { createBoard,findUserByQuery} = require('../../database/repository/board')
const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { checkmatimeSpace, getBoardInfo } = require('./rules')


exports.path = '/board'
exports.method = 'post'
exports.middleware = [
    getBoardInfo,
    checkmatimeSpace
]
exports.authenticate = true

exports.handler = controller(async ({body, _rt_auth_token}, res) => {
    const vessels = body.vessels
    const userId =  _rt_auth_token._id
    const board = await createBoard({vessels, userId})
    return res.status(status.CREATED).json({ board:board._id })
})