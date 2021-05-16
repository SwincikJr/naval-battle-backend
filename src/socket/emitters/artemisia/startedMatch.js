const { findAllSocketClientsByUserId } = require("../../../database/repository/socketClient")

exports.event = 'startedMatch'
exports.handler = io => async ({ _id, match }) => {
    const clients = await findAllSocketClientsByUserId(_id)
    clients.forEach(client => {
        io.to(client.socketClientId).emit('artemisia.startedMatch', match)     
    })
}
