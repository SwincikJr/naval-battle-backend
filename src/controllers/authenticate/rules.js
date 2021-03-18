const { body } = require('express-validator')

exports.validateAuthBody = [
    body('login').trim().isString().notEmpty(),
    body('password').trim().isString().notEmpty()
]
