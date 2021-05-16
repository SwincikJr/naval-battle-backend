const { create, remove, removeMany, findAll } = require('../index')

exports.createSocketClient = ({ UserId, socketClientId }) => create('SocketClient', { UserId, socketClientId })
exports.deleteBySocketClientId = socketClientId => remove('SocketClient', { socketClientId })
exports.deleteAllSocketClients = () => removeMany('SocketClient', { })
exports.findAllSocketClientsByUserId = UserId => findAll('SocketClient', { UserId })
