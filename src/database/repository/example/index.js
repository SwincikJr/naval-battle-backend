const { query } = require('express')
const { findOne, create, findAll, update, remove } = require('../index')

exports.createExample = ({ example }) => create('Example', { example })

exports.findExample = query => findOne('Example', query)

exports.getExample = query => findAll('Example', query)

exports.updateExample = (query, data) => update('Example', query, data)

exports.removeExample = query => remove('Example', query)
