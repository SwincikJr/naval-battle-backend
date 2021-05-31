const { findBoardsOfMatch, findBoardByQuery, updateBoard } = require("../../database/repository/board")
const { updateUserMovingOfMatch, endMatch } = require("../../database/repository/match")
const { updateUserInfo, findUserByQuery } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { validateIdInParams, errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { checkUsersOfMatch, checkUserMoving, calculateLoot } = require("./rules")

exports.path = '/game/giveup/:_id'
exports.method = 'post'
exports.middleware = [
    validateIdInParams,
    validateErrorBody,
    checkUsersOfMatch,
    checkUserMoving
]
exports.authenticate = true

exports.handler = controller(async (req, res) => {
    
    const winner = req._Match.PlayerOneId == req._rt_auth_token._id 
        ? req._Match.PlayerTwoId 
        : req._rt_auth_token._id
    
    const { coins, score } = await calculateLoot(
        req.params._id, 
        winner
    )

    await endMatch(req.params._id)
    await updateUserInfo(req._rt_auth_token._id, { playing: false })
    await updateUserInfo(winner, { 
        $inc: { coins, score },
        playing: false 
    })

    runEvent('artemisia.victory', { UserId: winner, coins, score })

    return res.status(status.NO_CONTENT).send()
})