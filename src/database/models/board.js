module.exports = {
    name: 'Board',
    fields: {
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