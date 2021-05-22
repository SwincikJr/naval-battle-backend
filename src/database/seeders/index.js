const models = require('../models')
const admin = require('./admin')
const game = require('./game')

module.exports = () => {
    admin(models)
    game(models)
}
