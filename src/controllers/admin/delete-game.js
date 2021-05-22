const { status } = require('../../presenters/http')
const { controller } = require('../../presenters/controller')
const { deleteGame } = require('../../database/repository/game')
const { checkDeleteRules } = require('./rules')
const { validateErrorBody } = require('../../presenters/validator')
const { validateIdInParams } = require('../../presenters/handle')

exports.path = '/admin/game/:_id'
exports.method = 'delete'
exports.middleware = [
    validateIdInParams,
    validateErrorBody,
    checkDeleteRules
]
exports.admin = true

exports.handler = controller(async (req, res) => {
    await deleteGame(req.params._id)
    return res.status(status.NO_CONTENT).send()
})
