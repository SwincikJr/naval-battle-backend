const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })

const models = {}

const dir = path.join(__dirname)
const listModels = fs.readdirSync(dir)
    .filter(m => m !== 'index.js')

listModels.forEach(m => {
    const model = require(`./${m}`)
    const schema = new mongoose.Schema(model.fields)
    models[model.name] = new mongoose.model(model.name, schema)
})

module.exports = models
