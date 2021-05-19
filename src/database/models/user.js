const { Types } = require('mongoose')

module.exports = {
    name: 'User',
    fields: {
        email: { 
            type: String, 
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        activation_key: {
            type: String,
            required: true
        },
        activated: {
            type: Boolean,
            default: false
        },
        recovering: {
            type: Boolean,
            default: false
        },
        waiting: {
            type: Boolean,
            default: false
        },
        playing: {
            type: Boolean,
            default: false
        },
        challenging: {
            type: Boolean,
            default: false
        },
        challenged: {
            type: Boolean,
            default: false
        },
        deleted: {
            type: Boolean,
            default: false
        },
        guest:{
            type:Boolean,
            default:false
        },
        score:{
            type: Number,
            default: 0
        }
    }
}