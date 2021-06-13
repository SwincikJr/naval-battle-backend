const { findBoardsOfMatch } = require("../../database/repository/board")
const { findUserByQuery } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { validateIdInParams, errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { checkUsersOfMatch, clearOponentBoard } = require("./rules")

exports.path = '/game/battle/:_id'
exports.method = 'get'
exports.middleware = [
    validateIdInParams,
    validateErrorBody,
    checkUsersOfMatch
]
exports.authenticate = true

exports.handler = controller(async (req, res) => {
    const boardsOfMatch = await findBoardsOfMatch(req.params._id)
    if (boardsOfMatch.length < 2) {
        return res.status(status.BAD_REQUEST).json(errorResponse(
            'Batalha não iniciada!',
            'As embarcações ainda estão sendo posicionadas.'
        ))
    }
    const user = await findUserByQuery({ _id: req._rt_auth_token._id })
    const response = {
        match: req._Match,
        yourBoard: boardsOfMatch.find(b => b.UserId == req._rt_auth_token._id),
        opponentBoard: clearOponentBoard(boardsOfMatch.find(b => b.UserId != req._rt_auth_token._id)),
        moving: req._Match.moving == req._rt_auth_token._id,
        diamonds: user.diamonds
    }
    return res.status(status.OK).json(response)
})