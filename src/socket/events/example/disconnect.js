exports.event = 'disconnect'
exports.handler = client => async () => {
  console.log('Cliente Socket desconectado!', client)
}
