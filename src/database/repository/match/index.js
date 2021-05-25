const { create, findOne } = require("..");

exports.startMatch = (PlayerOneId, PlayerTwoId, GameId) => create('Match', { PlayerOneId, PlayerTwoId, GameId, running: true })
exports.findMatchByIdAndUserId = (_id, UserId) => {
    return findOne('Match', {
        _id,
        $or: [
            { PlayerOneId: UserId },
            { PlayerTwoId: UserId }
        ]
    })
}