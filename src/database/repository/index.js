const models = require('../models')

exports.create = (model, data) => (new models[model](data)).save()

exports.update = (model, query, data) => models[model].updateOne(query, data).exec()

exports.findOne = (model, query) => models[model].findOne(query).exec()

exports.findAll = (model, query) => models[model].find(query).exec()

exports.findNoClassic = (model, query) => models[model].find(query).exec()

exports.remove = (model, query) => models[model].deleteOne(query).exec()

exports.removeMany = (model, query) => models[model].deleteMany(query).exec()

exports.findOneAndUpdate = (model, query, data) => models[model].findOneAndUpdate(query, data).exec()

exports.updateMany = (model, query, data) => models[model].updateMany(query, data).exec()

exports.findAllSortLimit = (model, query,data,query1, query2) => models[model].find(query,data).sort(query1).limit(query2).exec()
