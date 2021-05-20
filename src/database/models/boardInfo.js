module.exports = {
    name: 'BoardInfo',
    fields: {
        _id:Number,
        playableVessels: [{
             id: String ,
             label: String ,
             amountPerPlayer: Number,
            map:[{row:Number, column:Number}]
            }
        ],
        columnBoard: Number,
        rowBoard: Number
    }
}