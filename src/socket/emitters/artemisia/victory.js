const { findAllSocketClientsByUserId } = require("../../../database/repository/socketClient")

exports.event = 'victory'
exports.handler = io => async ({ UserId, coins, score }) => {
    const clients = await findAllSocketClientsByUserId(UserId)
    clients.forEach(client => {
        io.to(client.socketClientId).emit('artemisia.victory', { coins, score })
    })
}