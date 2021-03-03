const models = require('../models')

exports.create = (model, data) => (new models[model](data)).save()

exports.update = (model, query, data) => models[model].updateOne(query, data).exec()

exports.findOne = (model, query) => models[model].findOne(query).exec()

exports.findAll = (model, query) => models[model].find(query).exec()

exports.remove = (model, query) => models[model].deleteOne(query).exec()
