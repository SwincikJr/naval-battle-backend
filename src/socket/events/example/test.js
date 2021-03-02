exports.event = 'test'
exports.handler = client => async (data) => {
  console.log('Teste Socket executado!', client, data)
}
