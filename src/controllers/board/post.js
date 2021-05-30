const { createBoard } = require('../../database/repository/board')
const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { checkMaritimeSpace, getGameInfo, checkMatch, checkPreviousBoardInMatch } = require('./rules')


exports.path = '/board'
exports.method = 'post'
exports.middleware = [
    checkMatch,
    checkPreviousBoardInMatch,
    getGameInfo,
    checkMaritimeSpace
]
exports.authenticate = true

exports.handler = controller(async ({ _vessels, _rt_auth_token, body }, res) => {
    const vessels = _vessels
    const userId =  _rt_auth_token._id
    const board = await createBoard(vessels, userId, body.MatchId)
    return res.status(status.CREATED).json({ board: board._id })
})