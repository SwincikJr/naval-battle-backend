module.exports = {
    name: 'User',
    fields: {
        email: { 
            type: String, 
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
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
        deleted: {
            type: Boolean,
            default: false
        }
    }
}