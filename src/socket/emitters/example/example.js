exports.event = 'example'
exports.handler = io => async (data) => {
  io.emit('example', data)
}
