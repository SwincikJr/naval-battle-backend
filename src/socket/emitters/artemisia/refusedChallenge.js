const { findAllSocketClientsByUserId } = require("../../../database/repository/socketClient")

exports.event = 'refusedChallenge'
exports.handler = io => async (ChallengerId) => {
    const clients = await findAllSocketClientsByUserId(ChallengerId)
    clients.forEach(client => {
        io.to(client.socketClientId).emit('artemisia.refusedChallenge') 
    })
}