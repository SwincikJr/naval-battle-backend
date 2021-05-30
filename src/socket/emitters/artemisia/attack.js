const { findAllSocketClientsByUserId } = require("../../../database/repository/socketClient")

exports.event = 'attack'
exports.handler = io => async ({ UserId, row, column, hit, sanked }) => {
    const clients = await findAllSocketClientsByUserId(UserId)
    clients.forEach(client => {
        io.to(client.socketClientId).emit('artemisia.attack', { row, column, hit, sanked })
    })
}