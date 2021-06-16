const { findOne, findAll, create, update, remove, findClassic } = require("..");

exports.findGameByGameId = id => findOne('Game', { id })
exports.findAllGames = () => findAll('Game', {})
exports.findNoClassicGames = () => findNoClassic('Game', { id: { $ne: 'classic' } })
exports.createGame = game => create('Game', game)
exports.updateGame = (_id, game) => update('Game', { _id }, game)
exports.findGameById = _id => findOne('Game', { _id })
exports.deleteGame = _id => remove('Game', { _id })