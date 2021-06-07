const { body } = require('express-validator')

exports.validateItemCreate = [
    body('diamante').isNumeric().notEmpty(),
    body('custo').isNumeric().notEmpty(),
    body('tipo').trim().isString().notEmpty()
]

exports.validateGetItem = [
    body('_id').trim().notEmpty()
]