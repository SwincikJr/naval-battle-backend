const { findGameByGameId } = require("../../database/repository/game")
const { controller } = require("../../presenters/controller")
const { errorResponse, validateIdInParams } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { checkUsersOfMatch } = require("./rules")

exports.path = '/game/info/:_id'
exports.method = 'get'
exports.middleware = [
    validateIdInParams,
    validateErrorBody,
    checkUsersOfMatch
]
exports.authenticate = true

exports.handler = controller(async (req, res) => { 
    const game = await findGameByGameId(req._GameId)
    if (!game) return res.status(status.NOT_FOUND).json(errorResponse(
        'Jogo não encontrado!',
        'A modalidade de jogo solicitada não foi localizada.'
    ))
    return res.status(status.OK).json(game)
})