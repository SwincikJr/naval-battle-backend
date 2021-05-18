const { verify } = require('crypto')
const { create, findOne, update, findAll, findOneAndUpdate, findOneAndPopulate, updateMany, remove } = require('../index')

exports.createUser = ({ email, username, password, activation_key }) => {
    return create('User', { email, username, password, activation_key })
}

exports.findUserByEmail = email => findOne('User', { email, deleted: false })

exports.findUserByUsername = username => findOne('User', { username, deleted: false })

exports.findUserByQuery = query => findOne('User', { ...query, deleted: false })

exports.findUserByEmailOrUsername = login => findOne('User', { 
    $or: [
        { email: login }, 
        { username: login }
    ],
    deleted: false
})

exports.findUserByEmailAndActivationKey = (email, activation_key) => findOne('User', { 
        activation_key, email , deleted:false
})

exports.activateUser = _id => update('User', { _id }, { activated: true })

exports.setRecovering = (_id, activation_key) => update('User', { _id }, { recovering: true, activation_key })

exports.updatePassword = (_id, password) => update('User', { _id }, { recovering: false, password })

exports.findUserAndDelete = _id => update('User', { _id }, { deleted: true })

exports.updateUserInfo = (_id, body) => update('User', { _id }, body)

exports.findUserWaiting = _id => {
    return findOneAndUpdate('User', { 
        waiting: true, 
        deleted: false, 
        _id: { $ne: _id } 
    }, {
        waiting: false,
        playing: true
    })
} 

exports.setUserWaiting = _id => update('User', { _id }, { waiting: true })

exports.setUserNotWaiting = _id => update('User', { _id }, { waiting: false })

exports.setUserPlaying = _id => update('User', { _id }, { playing: true })

exports.checkUserInGameOrWaiting = _id => findOne('User', { 
    _id, 
    $or: [
        { playing: true },  
        { waiting: true },
        { challenged: true },
        { challenging: true }
    ] 
})

exports.checkUserChallengebleByEmailOrUsername = login => findOneAndUpdate('User', {
    $or: [
        { email: login }, 
        { username: login }
    ],
    waiting: false,
    playing: false,
    challenged: false,
    deleted: false
}, {
    challenged: true
})

exports.setUsersForCanceledChallenge = (ChallengerId, ChallengedId) => {
    return updateMany('User', {
        $or: [
            { _id: ChallengerId },
            { _id: ChallengedId }
        ]
    }, {
        challenging: false,
        challenged: false
    })
}

exports.setUsersPlayingForChallenge = (ChallengerId, ChallengedId) => {
    return updateMany('User', {
        $or: [
            { _id: ChallengerId },
            { _id: ChallengedId }
        ]
    }, {
        challenging: false,
        challenged: false,
        playing: true
    })
}

exports.createGuest = (username) => {
    return create('User', {username, guest:true, password:'null',email: 'null', activation_key:'null'})
}

exports.findGuestAndDelete = _id => remove('User',{_id})

exports.findGuest = username => findOne('User', { username, guest:true })

exports.getUserScore = _id => findOne('User', {_id})