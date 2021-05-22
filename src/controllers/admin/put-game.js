const { status } = require('../../presenters/http')
const { controller } = require('../../presenters/controller')
const { updateGame } = require('../../database/repository/game')
const { validateGameBody, checkVesselsOnGame } = require('./rules')
const { validateErrorBody } = require('../../presenters/validator')
const { validateIdInParams } = require('../../presenters/handle')

exports.path = '/admin/game/:_id'
exports.method = 'put'
exports.middleware = [
    validateIdInParams,
    validateGameBody,
    validateErrorBody,
    checkVesselsOnGame
]
exports.admin = true

exports.handler = controller(async (req, res) => {
    await updateGame(req.params._id, req.body)
    return res.status(status.NO_CONTENT).send()
})
