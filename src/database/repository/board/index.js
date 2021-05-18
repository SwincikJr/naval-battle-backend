const { create, findOne, update, findAll } = require('../index')

exports.createBoard = ( vessels ) => {
    return create('Board', vessels)
}

exports.findUserByQuery = query => findOne('Board', { ...query })