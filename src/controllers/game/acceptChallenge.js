const { findPendingChallengeByChallengedId } = require("../../database/repository/challenge")
const { startMatch } = require("../../database/repository/match")
const { setUsersPlayingForChallenge } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")

exports.path = '/game/challenge'
exports.method = 'put'
exports.middleware = []
exports.authenticate = true

exports.handler = controller(async ({ _rt_auth_token: { _id } }, res) => {
    const challenge = await findPendingChallengeByChallengedId(_id)
    if (!challenge) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Nenhum desafio encontrado!',
        'Você não possui nenhum desafio pendente.'
    ))
    await setUsersPlayingForChallenge(challenge.ChallengerId, _id)
    const match = startMatch(challenge.ChallengerId, _id)
    runEvent('artemisia.startedMatch', { _id: challenge.ChallengerId, match })
    return res.status(status.OK).json(match)
})
