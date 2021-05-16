const { createChallenge } = require("../../database/repository/challenge")
const { findAllSocketClientsByUserId } = require("../../database/repository/socketClient")
const { checkUserChallengebleByEmailOrUsername, updateUserInfo } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { checkPlayerInGameOrWaiting, checkChallengedExists } = require('./rules')

exports.path = '/game/challenge'
exports.method = 'post'
exports.middleware = [checkPlayerInGameOrWaiting, checkChallengedExists]
exports.authenticate = true

exports.handler = controller(async ({ _rt_auth_token: { _id, username }, body: { login } }, res) => {
    const challenged = await checkUserChallengebleByEmailOrUsername(login)
    const clients = challenged 
        ? await findAllSocketClientsByUserId(challenged._id) 
        : null
    if (!challenged || !clients.length) {
        if (challenged) await updateUserInfo(challenged._id, { challenged: false })
        return res.status(status.NOT_FOUND).json(errorResponse(
            'Desafio não concluído',
            'O jogador informado não pode ser desafiado no momento.'
        ))
    }
    await updateUserInfo(_id, { challenging: true })
    const challenge = await createChallenge(_id, challenged._id)
    challenge.challengerUsername = username
    runEvent('artemisia.newChallenge', { clients, challenge: { ...challenge, username } })
    return res.status(status.OK).json(challenge)
})
