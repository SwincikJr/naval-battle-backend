const { body } = require('express-validator')
const { findGameByGameId } = require('../../database/repository/game')
const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { errorResponse } = require('../../presenters/handle')

exports.validateAuthBody = [
    body('username').trim().isString().notEmpty(),
    body('password').trim().isString().notEmpty()
]

exports.validateGameBody = [
    body('id').isString().trim().notEmpty(),
    body('label').isString().trim().notEmpty(),
    body('rowBoard').isInt({ min: 3 }),
    body('columnBoard').isInt({ min: 3 }),
    body('playableVessels').isArray({ min: 1 }),
    body('playableVessels.*').isObject(),
    body('playableVessels.*.id').isString().trim().notEmpty(),
    body('playableVessels.*.label').isString().trim().notEmpty(),
    body('playableVessels.*.amountPerPlayer').isInt({ min: 1 }),
    body('playableVessels.*.map').isArray(),
    body('playableVessels.*.map.*').isObject(),
    body('playableVessels.*.map.*.row').isInt(),
    body('playableVessels.*.map.*.column').isInt()
]

exports.checkPreviousGameId = controller(async (req, res, next) => {
    const previousGame = await findGameByGameId(req.body.id)
    if (previousGame) return res.status(status.BAD_REQUEST).json(errorResponse(
        'ID em uso!',
        'O ID fornecido já pertence à outra modalidade.'
    ))
    return next()
})

exports.checkVesselsOnGame = controller(async (req, res, next) => {
    
})