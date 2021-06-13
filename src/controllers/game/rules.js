const { param } = require("express-validator");
const { findBoardByQuery } = require("../../database/repository/board");
const { findMatchByIdAndUserId } = require("../../database/repository/match");
const { checkUserInGameOrWaiting, findUserByEmailOrUsername, findUserByQuery } = require("../../database/repository/user");
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

exports.checkUsersOfMatch = controller(async (req, res, next) => {
    const match = await findMatchByIdAndUserId(req.params._id, req._rt_auth_token._id)
    if (!match) return res.status(status.NOT_FOUND).json(errorResponse(
        'Partida não localizada!',
        'A Partida solicitada não foi localizada.'
    ))
    req._GameId = match.GameId
    req._Match = match
    return next()
})

exports.checkUserMoving = controller(async (req, res, next) => {
    if (req._Match.moving != req._rt_auth_token._id) {
        return res.status(status.BAD_REQUEST).json(errorResponse(
            'Não está na sua vez de jogar!',
            'Aguarde a jogada do seu oponente antes de atacar.'
        ))
    }
    return next()
})

exports.clearOponentBoard = board => {

    const hasDestroyedCoordinatesOnVessel = vessel => {
        return vessel.coordinates.find(c => c.destroyed)
    }

    const getDestroyedCoordinatesOnVessel = vessel => {
        return vessel.coordinates.filter(c => c.destroyed)
    }

    board.vessels = board.vessels
        .filter(v => !!hasDestroyedCoordinatesOnVessel(v))
        .map(v => {
            return {
                coordinates: getDestroyedCoordinatesOnVessel(v)
            }
        })
    return board
}

exports.calculateLoot = async (MatchId, UserId) => {
    const board = await findBoardByQuery({ MatchId, UserId })
    const remainingCoordinates = board.vessels.reduce((acc, curr) => {
        const coordinates = curr.coordinates.filter(c => !c.destroyed).length
        return acc + coordinates
    }, 0)
    return { 
        score: remainingCoordinates * 100,
        coins: remainingCoordinates * 5
    }
}

exports.checkDiamondsOfUser = min => controller(async (req, res, next) => {
    const user = await findUserByQuery({ _id: req._rt_auth_token._id })
    if (user && user.diamonds >= min) return next()
    return res.status(status.BAD_REQUEST).json(errorResponse(
        'Diamantes insuficientes!',
        'Você não possui diamantes suficientes para a ação requisitada.'
    ))
})
