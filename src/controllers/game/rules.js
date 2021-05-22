const { param } = require("express-validator");
const { checkUserInGameOrWaiting, findUserByEmailOrUsername } = require("../../database/repository/user");
const { controller } = require("../../presenters/controller");
const { errorResponse } = require("../../presenters/handle");
const { status } = require("../../presenters/http");

exports.checkPlayerInGameOrWaiting = controller(async ({ _rt_auth_token: { _id } }, res, next) => {
    const inGameOrWaiting = await checkUserInGameOrWaiting(_id)
    if (inGameOrWaiting) return res.status(status.BAD_REQUEST).json(
        errorResponse(
            'Operação não autorizada!',
            'Você já se encontra em jogo ou em espera.'
        )
    )
    return next()
})

exports.checkChallengedExists = controller(async ({ body: { login } }, res, next) => {
    const challenged = await findUserByEmailOrUsername(login)
    if (!challenged) return res.status(status.BAD_REQUEST).json(
        errorResponse(
            'Jogador não encontrado!',
            'O jogador desafiado não está cadastrado.'
        )
    )
    return next()
})

exports.validateGameIdInParams = [
    param('id').isString().trim().notEmpty()
]
