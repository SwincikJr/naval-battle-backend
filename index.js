const http = require('http')
const app = require('./app')

const { listenServerSocket } = require('./src/socket')

const port = process.env.PORT || 3000
const server = http.createServer(app)

listenServerSocket(server)

server.listen(port, () => { console.info(`Server start in host: http://localhost:${port}`) })
