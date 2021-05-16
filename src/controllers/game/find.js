const { startMatch } = require("../../database/repository/match")
const { findUserWaiting, setUserWaiting, setUserPlaying } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { checkPlayerInGameOrWaiting } = require('./rules')

exports.path = '/game/find'
exports.method = 'post'
exports.middleware = [checkPlayerInGameOrWaiting]
exports.authenticate = true

exports.handler = controller(async ({ _rt_auth_token: { _id } }, res) => {
    const waiting = await findUserWaiting(_id)
    if (!waiting) {
        await setUserWaiting(_id)
        return res.status(status.NOT_FOUND).json(
            errorResponse(
                'Nenhum jogador disponível!',
                'Nenhum jogador está disponível para jogar no momento.'
            )
        )
    }
    await setUserPlaying(_id)
    const match = await startMatch(_id, waiting._id)
    runEvent('artemisia.startedMatch', { _id: waiting._id, match })
    return res.status(status.OK).json(match)
})
