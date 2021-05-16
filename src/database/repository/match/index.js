const { create } = require("..");

exports.startMatch = (PlayerOneId, PlayerTwoId) => create('Match', { PlayerOneId, PlayerTwoId, running: true })
