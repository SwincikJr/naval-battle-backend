const { Types } = require("mongoose");

module.exports = {
    name: 'Board',
    fields: {
        UserId: { 
            type: Types.ObjectId, 
            required: true
        },
        vessels:[
            {
                id:String, 
                coordinates: [
                    { row: Number, column: Number, destroyed: Boolean }
                ]
            }
        ],
        MatchId: {
            type: Types.ObjectId, 
            required: true
        },
        rows: {
            type: Number,
            required: true
        },
        columns: {
            type: Number,
            required: true
        },
        attackedCoordinates: [
            { row: Number, column: Number }
        ]
    }
}