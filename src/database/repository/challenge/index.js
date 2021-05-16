const { create, findOne, findOneAndUpdate } = require("..")

exports.createChallenge = (ChallengerId, ChallengedId) => {
    return create('Challenge', { ChallengerId, ChallengedId, pending: true })
}

exports.findPendingChallengeByUserId = UserId => {
    return findOneAndUpdate('Challenge', { 
        $or: [
            { ChallengerId: UserId },
            { ChallengedId: UserId }   
        ],
        pending: true
    }, {
        pending: false
    })
}

exports.findPendingChallengeByChallengedId = ChallengedId => {
    return findOneAndUpdate('Challenge', {
        ChallengedId,
        pending: true
    }, {
        pending: false
    })
}
