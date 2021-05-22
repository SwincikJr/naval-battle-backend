const { status } = require('../../presenters/http')
const { controller } = require('../../presenters/controller')
const { findAllGames } = require('../../database/repository/game')
const { validateGameBody, checkPreviousGameId } = require('./rules')
const { validateErrorBody } = require('../../presenters/validator')

exports.path = '/admin/game'
exports.method = 'post'
exports.middleware = [
    validateGameBody,
    validateErrorBody,
    checkPreviousGameId
]
exports.admin = true

exports.handler = controller(async (_, res) => {
    let games = await findAllGames()
    return res.status(status.OK).json(games)
})
