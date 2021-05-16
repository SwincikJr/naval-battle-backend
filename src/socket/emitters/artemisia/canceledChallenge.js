const { findAllSocketClientsByUserId } = require("../../../database/repository/socketClient")

exports.event = 'canceledChallenge'
exports.handler = io => async (ChallengedId) => {
    const clients = await findAllSocketClientsByUserId(ChallengedId)
    clients.forEach(client => {
        io.to(client.socketClientId).emit('artemisia.canceledChallenge') 
    })
}
