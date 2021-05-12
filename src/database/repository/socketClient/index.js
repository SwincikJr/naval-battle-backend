const { create, remove } = require('../index')

exports.createSocketClient = ({ UserId, socketClientId }) => create('SocketClient', { UserId, socketClientId })
exports.deleteBySocketClientId = socketClientId => remove('SocketClient', { socketClientId })
