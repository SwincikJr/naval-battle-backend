const { Types } = require("mongoose");

module.exports = {
    name: 'SocketClient',
    fields: {
        UserId: { 
            type: Types.ObjectId, 
            required: true
        },
        socketClientId: {
            type: String,
            required: true
        }
    }
}
