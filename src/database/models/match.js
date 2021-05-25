const { Types } = require("mongoose");

module.exports = {
    name: 'Match',
    fields: {
        PlayerOneId: { 
            type: Types.ObjectId, 
            required: true
        },
        PlayerTwoId: {
            type: Types.ObjectId,
            required: true
        },
        GameId: {
            type: String,
            required: true
        },
        running: {
            type: Boolean,
            required: true
        }
    }
}
