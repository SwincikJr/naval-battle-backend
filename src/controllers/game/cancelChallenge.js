const { findPendingChallengeByUserId } = require("../../database/repository/challenge")
const { setUsersForCanceledChallenge } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")

exports.path = '/game/challenge'
exports.method = 'delete'
exports.middleware = []
exports.authenticate = true

exports.handler = controller(async ({ _rt_auth_token: { _id } }, res) => {
    const challenge = await findPendingChallengeByUserId(_id)
    if (!challenge) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Nenhum desafio encontrado!',
        'Você não possui nenhum desafio pendente.'
    ))
    await setUsersForCanceledChallenge(challenge.ChallengerId, challenge.ChallengedId)
    challenge.ChallengerId.toString() === _id 
      ? runEvent('artemisia.canceledChallenge', challenge.ChallengedId)
      : runEvent('artemisia.refusedChallenge', challenge.ChallengerId)
    return res.status(status.NO_CONTENT).send(null)
})
