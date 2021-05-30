const { create, findOne, update } = require("..");

exports.startMatch = (PlayerOneId, PlayerTwoId, GameId, moving) => create('Match', { PlayerOneId, PlayerTwoId, GameId, running: true, moving })

exports.findMatchByIdAndUserId = (_id, UserId) => {
    return findOne('Match', {
        _id,
        $or: [
            { PlayerOneId: UserId },
            { PlayerTwoId: UserId }
        ]
    })
}

exports.updateUserMovingOfMatch = (_id, UserId) => update('Match', { _id }, { moving: UserId })