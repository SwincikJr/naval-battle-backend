const { Types } = require("mongoose");

module.exports = {
    name: 'Board',
    fields: {
        userId: { 
            type: Types.ObjectId, 
            required: true
        },
        vessels:[
            {
                id:String, 
                coordinates: [
                    { row: Number, column: Number }
                ]
            }
        ]
    }
}