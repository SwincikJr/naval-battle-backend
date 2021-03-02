const events = {}

exports.addEvent = (key, fn) => {
  events[key] = fn
}

exports.runEvent = (key, data) => {
  return events[key](data)
}
