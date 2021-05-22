module.exports = {
    name: 'Game',
    fields: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        playableVessels: [
            {
                id: {
                    type: String,
                    required: true
                },
                label: {
                    type: String,
                    required: true
                },
                amountPerPlayer: {
                    type: Number,
                    required: true
                },
                map:[
                    {
                        row: {
                            type: Number,
                            required: true
                        }, 
                        column: {
                            type: Number,
                            required: true
                        }
                    }
                ]
            }
        ],
        columnBoard: {
            type: Number,
            required: true
        },
        rowBoard: {
            type: Number,
            required: true
        }
    }
}
