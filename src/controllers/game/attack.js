const { findBoardsOfMatch, findBoardByQuery, updateBoard } = require("../../database/repository/board")
const { updateUserMovingOfMatch, endMatch } = require("../../database/repository/match")
const { updateUserInfo, findUserByQuery } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { validateIdInParams, errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { checkUsersOfMatch, checkUserMoving, calculateLoot } = require("./rules")

exports.path = '/game/battle/:_id'
exports.method = 'put'
exports.middleware = [
    validateIdInParams,
    validateErrorBody,
    checkUsersOfMatch,
    checkUserMoving
]
exports.authenticate = true

exports.handler = controller(async (req, res) => {
    
    const opponentBoard = await findBoardByQuery({
        MatchId: req.params._id,
        UserId: { $ne: req._rt_auth_token._id }
    })
    
    if (!opponentBoard) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Tabuleiro não localizado!',
        'Seu oponente ainda não posicionou suas embarcações.'
    ))

    if(!opponentBoard.attackedCoordinates) opponentBoard.attackedCoordinates = []

    opponentBoard.attackedCoordinates.push({ row: req.body.row, column: req.body.column })
    
    let sanked = false
    let victory = false
    let score = 0
    let coins = 0
    
    const hitedVessel = opponentBoard.vessels.find(v => {
        return !!v.coordinates.find(c => c.row == req.body.row && c.column == req.body.column)
    })

    if (hitedVessel) {
        
        const hitedCoordinate = hitedVessel.coordinates.find(c => c.row == req.body.row && c.column == req.body.column)
        hitedCoordinate.destroyed = true
        sanked = !hitedVessel.coordinates.find(c => !c.destroyed)
        const remainingVessels = opponentBoard.vessels.find(v => {
            return !!v.coordinates.find(c => !c.destroyed)
        })
        
        if (!remainingVessels) {

            victory = true

            const loot = await calculateLoot(req.params._id, req._rt_auth_token._id)
            score = loot.score
            coins = loot.coins

            await updateUserInfo(req._rt_auth_token._id, {
                $inc: { score, coins },
                playing: false
            })

            await updateUserInfo(opponentBoard.UserId, { playing: false })

            await endMatch(req.params._id)
        }

    } else {
        await updateUserMovingOfMatch(req.params._id, opponentBoard.UserId)
    }

    await updateBoard(opponentBoard._id, opponentBoard)

    runEvent('artemisia.attack', { 
        UserId: opponentBoard.UserId,
        row: req.body.row,
        column: req.body.column,
        hit: !!hitedVessel,
        sanked,
        defeat: victory
    })

    return res.status(status.OK).json({ hit: !!hitedVessel, sanked, victory, coins, score })
})