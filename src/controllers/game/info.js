const { findGameByGameId } = require("../../database/repository/game")
const { controller } = require("../../presenters/controller")
const { errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { validateGameIdInParams } = require("./rules")

exports.path = '/game/info/:id'
exports.method = 'get'
exports.middleware = [
    validateGameIdInParams,
    validateErrorBody
]
exports.authenticate = true

exports.handler = controller(async (req, res) => { 
    const game = await findGameByGameId(req.params.id)
    if (!game) return res.status(status.NOT_FOUND).json(errorResponse(
        'Jogo não encontrado!',
        'A modalidade de jogo solicitada não foi localizada.'
    ))
    return res.status(status.OK).json(game)
})