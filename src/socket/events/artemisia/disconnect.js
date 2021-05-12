const { deleteBySocketClientId } = require('../../../database/repository/socketClient')

exports.event = 'disconnect'
exports.handler = client => async () => {
  await deleteBySocketClientId(client.id)
}
