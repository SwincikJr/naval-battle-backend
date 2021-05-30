const { create, findOne, update, findAll } = require('../index')

exports.createBoard = (vessels, UserId, MatchId) => {
    return create('Board', { vessels, UserId, MatchId })
}

exports.findBoardByQuery = query => findOne('Board', { ...query })