const { create, findOne, update, findAll } = require('../index')

exports.createBoard = (vessels, UserId) => {
    return create('Board', { vessels, UserId })
}

exports.findUserByQuery = query => findOne('Board', { ...query })