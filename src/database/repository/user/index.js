const { create, findOne } = require('../index')

exports.createUser = ({ email, username, password, activation_key }) => {
    return create('User', { email, username, password, activation_key })
}

exports.findUserByEmail = email => findOne('User', { email, deleted: false })

exports.findUserByUsername = username => findOne('User', { username, deleted: false })
