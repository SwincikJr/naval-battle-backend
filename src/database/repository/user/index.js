const { create, findOne, update } = require('../index')

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

exports.findUserByEmailAndActivationKey = (email, activation_key) => {
    return findOne('User', { email, activation_key, deleted: false })
}

exports.activateUser = _id => update('User', { _id }, { activated: true })

exports.setRecovering = (_id, activation_key) => update('User', { _id }, { recovering: true, activation_key })
