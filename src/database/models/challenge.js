const { Types } = require("mongoose");

module.exports = {
    name: 'Challenge',
    fields: {
        ChallengerId: { 
            type: Types.ObjectId, 
            required: true
        },
        ChallengedId: {
            type: Types.ObjectId,
            required: true
        },
        pending: {
            type: Boolean,
            required: true
        }
    }
}
