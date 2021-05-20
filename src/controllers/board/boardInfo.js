const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { getBoardInfo } = require('./rules')


exports.path = '/board/info'
exports.method = 'get'
exports.middleware = [
    getBoardInfo
]
exports.authenticate = true

exports.handler = controller(async (req, res) => { 
    return res.status(status.OK).json(req.boardInfo)
})