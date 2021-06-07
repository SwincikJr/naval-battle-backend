const { create, findAll, findOneAndUpdate, remove } = require('../index');

exports.createItem = ({ diamante, custo, tipo }) => {
    return create('Loja', { diamante, custo, tipo })
}

exports.findAll = () => {
    return findAll('Loja', {})
}

exports.findItemUpdate = (_id, body) => {
    return findOneAndUpdate('Loja', { _id: _id }, body)
}

exports.removeItem = _id => {
    return remove('Loja', { _id: _id })
}