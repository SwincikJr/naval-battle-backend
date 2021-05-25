const defaultGame = {
    id: 'classic',
    label: 'Clássico',
    playableVessels: [
        {
            id: 'aircraft_carrier',
            label: 'Porta-avião',
            amountPerPlayer: 1,
            map: [
                { row: 0, column: 1 },
                { row: 0, column: 2 },
                { row: 0, column: 3 },
                { row: 0, column: 4 }
            ]
        },
        {
            id: 'battleship',
            label: 'Encouraçado',
            amountPerPlayer: 2,
            map: [
                { row: 0, column: 1 },
                { row: 0, column: 2 },
                { row: 0, column: 3 }
            ]
        },
        {
            id: 'seaplane',
            label: 'Hidroavião',
            amountPerPlayer: 3,
            map: [
                { row: -1, column: 1 },
                { row: 0, column: 2 }
            ]
        },
        {
            id: 'submarine',
            label: 'Submarino',
            amountPerPlayer: 4,
            map: []
        },
        {
            id: 'cruiser',
            label: 'Cruzador',
            amountPerPlayer: 3,
            map: [
                { row: 0, column: 1 }
            ]
        }
    ],
    columnBoard: 15,
    rowBoard: 15
}

module.exports = models => {
    models['Game'].findOne({ id: defaultGame.id }).then(game => {
        if (!game) {
            (new models['Game'](defaultGame)).save()
        }
    })
}
