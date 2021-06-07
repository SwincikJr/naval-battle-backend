const { body } = require('express-validator')
const { findGameByGameId, findGameById } = require('../../database/repository/game')
const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { errorResponse } = require('../../presenters/handle')

exports.validateAuthBody = [
    body('username').trim().isString().notEmpty(),
    body('password').trim().isString().notEmpty()
]

exports.validateGameIdInBody = [
    body('id').isString().trim().notEmpty()
]

exports.validateGameBody = [
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
    const vessels = req.body.playableVessels
    for (const vessel of vessels) {
        const vesselsById = vessels.filter(v => v.id === vessel.id)
        if (vesselsById.length > 1) return res.status(status.BAD_REQUEST).json(
            errorResponse(
                'ID repetido!',
                'O ID de uma embarcação deve ser único.'
            )
        )
    }
    return next()
})

exports.checkDeleteRules = controller(async (req, res, next) => {
    const game = await findGameById(req.params._id)
    if (!game) return res.status(status.NOT_FOUND).json(errorResponse(
        'Modalidade não encontrada!', 
        'A Modalidade informada não foi localizada.'
    ))
    if (game.id === 'classic') return res.status(status.BAD_REQUEST).json(errorResponse(
        'Operação não permitida!',
        'A Modalidade Clássica não pode ser excluída do sistema.'
    ))
    return next()
})