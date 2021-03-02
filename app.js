require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')

const { status } = require('./src/presenters/http')
const language = require('./src/middlewares/language')
const error = require('./src/middlewares/error')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')))

app.use(language())
app.use(error())

require('./src/presenters/router')(app)

app.disable('x-powered-by')

app.use((_, res) => {
    res._rt_send_error(status.NOT_FOUND, 'NOT_FOUND')
})

module.exports = app
