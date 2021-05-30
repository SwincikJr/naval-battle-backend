const { findAllSocketClientsByUserId } = require("../../../database/repository/socketClient")

exports.event = 'opponentReady'
exports.handler = io => async (userId) => {
    const clients = await findAllSocketClientsByUserId(userId)
    clients.forEach(client => {
        io.to(client.socketClientId).emit('artemisia.opponentReady') 
    })
}