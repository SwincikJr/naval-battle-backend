const { findBoardsOfMatch, findBoardByQuery, updateBoard } = require("../../database/repository/board")
const { updateUserMovingOfMatch } = require("../../database/repository/match")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { validateIdInParams, errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { checkUsersOfMatch, checkUserMoving } = require("./rules")

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
    
    const hitedVessel = opponentBoard.vessels.find(v => {
        return !!v.coordinates.find(c => c.row == req.body.row && c.column == req.body.column)
    })

    if (hitedVessel) {
        const hitedCoordinate = hitedVessel.coordinates.find(c => c.row == req.body.row && c.column == req.body.column)
        hitedCoordinate.destroyed = true
        sanked = !hitedVessel.coordinates.find(c => !c.destroyed)
    }

    await updateBoard(opponentBoard._id, opponentBoard)
    await updateUserMovingOfMatch(req.params._id, opponentBoard.UserId)

    runEvent('artemisia.attack', { 
        UserId: opponentBoard.UserId,
        row: req.body.row,
        column: req.body.column,
        hit: !!hitedVessel,
        sanked
    })

    return res.status(status.OK).json({ hit: !!hitedVessel, sanked })
})