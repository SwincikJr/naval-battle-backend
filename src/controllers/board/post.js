const { createBoard, findBoardByQuery } = require('../../database/repository/board')
const { controller } = require('../../presenters/controller')
const { runEvent } = require('../../presenters/events')
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

exports.handler = controller(async ({ _vessels, _rt_auth_token, body, _gameInfo }, res) => {
    const vessels = _vessels
    const userId =  _rt_auth_token._id
    const board = await createBoard(vessels, userId, body.MatchId, _gameInfo.rowBoard, _gameInfo.columnBoard)
    const adversaryBoard = await findBoardByQuery({
        MatchId: body.MatchId,
        UserId: { $ne: userId }
    })
    if (adversaryBoard) {
        runEvent('artemisia.opponentReady', adversaryBoard.UserId)
    }
    return res.status(status.CREATED).json({ board: board._id, wait: !adversaryBoard })
})