const { status } = require('../../presenters/http')
const { controller } = require('../../presenters/controller')
const { createGame } = require('../../database/repository/game')
const { validateGameBody, checkPreviousGameId, checkVesselsOnGame, validateGameIdInBody } = require('./rules')
const { validateErrorBody } = require('../../presenters/validator')

exports.path = '/admin/game'
exports.method = 'post'
exports.middleware = [
    validateGameIdInBody,
    validateGameBody,
    validateErrorBody,
    checkPreviousGameId,
    checkVesselsOnGame
]
exports.admin = true

exports.handler = controller(async (req, res) => {
    const game = await createGame(req.body)
    return res.status(status.CREATED).json(game)
})
