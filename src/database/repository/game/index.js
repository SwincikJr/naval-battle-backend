// const { create, findOne, update, findAll } = require('../index')

const { findOne, findAll } = require("..");

// exports.createBoardInfo = (_id, playableVessels, columnBoard, rowBoard ) => {
//     return create('BoardInfo', {_id, playableVessels, columnBoard, rowBoard })
// }

// exports.findBoardInfo = query => findOne('BoardInfo', { ...query})

// exports.updateBoardInfo = (_id, playableVessels, columnBoard, rowBoard ) => update('BoardInfo', { _id },{ playableVessels, columnBoard, rowBoard })

exports.findGameByGameId = id => findOne('Game', { id })
exports.findAllGames = () => findAll('Game', {})
