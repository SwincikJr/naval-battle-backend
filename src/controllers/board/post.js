const { createBoard,findUserByQuery} = require('../../database/repository/board')
const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { checkmatimeSpace } = require('./rules')


exports.path = '/board'
exports.method = 'post'
exports.middleware = [
    checkmatimeSpace
]
exports.authenticate = true

exports.handler = controller(async ({body}, res) => {
    const vessels = body.vessels
    const board = await createBoard({vessels})
    return res.status(status.CREATED).json({ board:board._id })
})