const { Types } = require('mongoose')

module.exports = {
    name: 'Loja',
    fields: {
        diamante: {
            type: Number,
            required: true
        },
        custo: {
            type: Number,
            required: true
        },
        tipo: { // 'REAL' ou 'OURO'
            type: String,
            required: true
        }
    }
}