const { create, findOne, update, findAll } = require('../index')

exports.createBoard = (vessels, UserId, MatchId, rows, columns) => {
    return create('Board', { vessels, UserId, MatchId, rows, columns })
}

exports.findBoardByQuery = query => findOne('Board', { ...query })

exports.findBoardsOfMatch = MatchId => findAll('Board', { MatchId })

exports.updateBoard = (_id, data) => update('Board', { _id }, data)