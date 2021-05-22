const { param } = require("express-validator")
const { Types } = require("mongoose")

exports.errorResponse = (title, message) => {
    if (!title || !message) throw new Error('Título e Mensagem de erro são obrigatórios!')
    return { errors: [{ title, message }]}
}

const validateMongoObjectId = value => {
    return Types.ObjectId.isValid(value)
}

exports.validateIdInParams = [
    param('_id')
        .isString()
        .trim()
        .notEmpty()
        .custom(validateMongoObjectId)
]
