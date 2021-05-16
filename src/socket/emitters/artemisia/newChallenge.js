exports.event = 'newChallenge'
exports.handler = io => async ({ clients, challenge }) => {
    clients.forEach(client => {
        io.to(client.socketClientId).emit('artemisia.newChallenge', challenge) 
    })
}
