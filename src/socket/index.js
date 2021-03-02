const socket = require('socket.io')
const fs = require('fs')
const path = require('path')
const { addEvent } = require('../presenters/events')

const listProtocols = () => {
  const dir = path.join(__dirname, './events')
  const listDir = fs.readdirSync(dir)
  return listDir
}

const listEvents = (protocol) => {
  const dir = path.join(__dirname, `./events/${protocol}`)
  let eventsDir = fs.readdirSync(dir)
  eventsDir = eventsDir.filter((d) => {
    return d !== 'connection.js'
  })
  const listEvents = eventsDir.map((d) => {
    const { event, handler } = require(`./events/${protocol}/${d}`)
    return { event, handler }
  })
  return listEvents
}

const listEmitters = (protocol) => {
  const dir = path.join(__dirname, `./emitters/${protocol}`)
  const emittersDir = fs.readdirSync(dir)
  const listEmitters = emittersDir.map((d) => {
    const { event, handler } = require(`./emitters/${protocol}/${d}`)
    return { event, handler }
  })
  return listEmitters
}

const loadConnectionHandler = (protocol) => {
  const dir = path.join(__dirname, `./events/${protocol}`)
  const connectionFile = fs.readdirSync(dir).find((d) => d === 'connection.js')
  const connectionHandler = connectionFile
    ? require(`./events/${protocol}/${connectionFile}`)
    : null
  return connectionHandler
}

const eventsFactory = () => {
  const factory = {}
  const protocols = listProtocols()
  protocols.forEach((p) => {
    factory[p] = {
      events: listEvents(p),
      connectionHandler: loadConnectionHandler(p),
    }
  })
  return factory
}

const emittersFactory = () => {
  const factory = {}
  const protocols = listProtocols()
  protocols.forEach((p) => {
    factory[p] = {
      emitters: listEmitters(p),
    }
  })
  return factory
}

const loadEvents = (client, events) => {
  events.forEach((e) => {
    client.on(e.event, e.handler(client))
  })
}

const listenEvents = async (io) => {
  const eventsByProtocol = eventsFactory()
  io.on('connection', async (client) => {
    const { protocol } = client.handshake.query
    if (eventsByProtocol[protocol]) {
      const { connectionHandler, events } = eventsByProtocol[protocol]
      if (connectionHandler && !(await connectionHandler(client))) {
        io.to(client.id).emit('socket.connection.fail')
        return
      }
      loadEvents(client, events)
      io.to(client.id).emit('socket.connection.success')
    }
  })
}

const loadEmitters = (io) => {
  emittersByProtocol = emittersFactory()
  Object.getOwnPropertyNames(emittersByProtocol).forEach((p) => {
    emittersByProtocol[p].emitters.forEach((e) => {
      addEvent(`${p}.${e.event}`, e.handler(io))
    })
  })
}

exports.listenServerSocket = async (server) => {
  try {
    const io = socket(server)
    listenEvents(io)
    loadEmitters(io)
  } catch (err) {
    console.error(err)
    throw new Error('Error connect socket')
  }
}
