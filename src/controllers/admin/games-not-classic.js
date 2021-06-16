const { status } = require('../../presenters/http')
const { controller } = require('../../presenters/controller')
const { findNoClassicGames } = require('../../database/repository/game')

exports.path = '/admin/games/not-classic'
exports.method = 'get'
exports.middleware = []
exports.admin = false

exports.handler = controller(async (_, res) => {
    let games = await findNoClassicGames()
    return res.status(status.OK).json(games)
})