const { status } = require('../../presenters/http')
const { controller } = require('../../presenters/controller')
const { findAllGames } = require('../../database/repository/game')

exports.path = '/admin/games'
exports.method = 'get'
exports.middleware = []
exports.admin = true

exports.handler = controller(async (_, res) => {
    let games = await findAllGames()
    return res.status(status.OK).json(games)
})