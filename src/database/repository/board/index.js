const { create, findOne, update, findAll } = require('../index')

exports.createBoard = ( vessels, userId ) => {
    return create('Board', vessels, userId)
}

exports.findUserByQuery = query => findOne('Board', { ...query })