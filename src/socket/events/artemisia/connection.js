const { validateToken } = require('../../../presenters/jwt')
const { createSocketClient } = require('../../../database/repository/socketClient')

module.exports = async (client) => { 
  const { token } = client.handshake.auth
  const validatedToken = await validateToken(token)
  if (!validatedToken) return false
  const { _id: UserId } = validatedToken 
  const { id: socketClientId } = client
  await createSocketClient({ UserId, socketClientId })
  return true
}
