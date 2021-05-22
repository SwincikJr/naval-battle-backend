const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')
const { errorResponse } = require('../../presenters/handle')
const { findGameByGameId } = require('../../database/repository/game')

exports.getGameInfo = controller(async(req, res, next)=>{
    const game = await findGameByGameId(req.body.gameId || 'classic')
    if(!game){
        return res.status(status.BAD_REQUEST).json(errorResponse(
            'Modalidade de jogo não localizada.',
            'Nenhuma modalidade de jogo foi encontrada. Por favor, contate o administrador do sistema.'
        ))
    }
    req._gameInfo = game
    return next()
})

exports.checkMaritimeSpace = controller(async (req, res, next)=>{

    const { playableVessels, columnBoard, rowBoard } = req._gameInfo

    const validTotalVesselsAmount = vessels => {
        return vessels.length === totalAmountPerPlayer
    }
    
    const totalAmountPerPlayer = playableVessels.map(p => p.amountPerPlayer).reduce((acc, cur) => acc + cur)

    
    const validVesselsAmount = vessels => {
        for (const playableVessel of playableVessels) {
            if(vessels.filter(v => v.id === playableVessel.id).length !== playableVessel.amountPerPlayer) {
                return false
            }
        }
        return true
    }
    
    const generateMaritmeSpace = vessels => {
        const vesselsInMaritmeSpace = []
        vessels.forEach(vessel => {
            const playableVessel = playableVessels.find(p => p.id === vessel.id)
            const coordinates = [vessel.startPosition]
            playableVessel.map.forEach(m => {
                coordinates.push({
                  row: vessel.startPosition.row + m.row,
                  column: vessel.startPosition.column + m.column  
                })
            })
            vesselsInMaritmeSpace.push({
                id: vessel.id,
                coordinates
            })
        })
        return vesselsInMaritmeSpace
    }
    
    const getCoordinates = maritmeSpace => {
        let coordinates = []
        maritmeSpace.forEach(m => { coordinates = coordinates.concat(m.coordinates) })
        return coordinates
    }
    
    const validCoordinatesInsideOfSpace = coordinates => {
        return coordinates.filter(c => c.row < 0 || c.row > rowBoard || c.column < 0 || c.column > columnBoard).length === 0
    }

    const validNotEqualCoordinates = coordinates => {
        for (const coordinate of coordinates) {
            if (coordinates.filter(c => c.row === coordinate.row && c.column === coordinate.column).length > 1)
                return false
        }
        return true
    }
    
    const validNotNeighborsCoordinates = maritmeSpace => {
        let auxMaritmeSpace
        let auxCoordinates
        let neighborsCoordinates
        for (const vessel of maritmeSpace) {
            auxMaritmeSpace = maritmeSpace.filter(m => {
                return m.coordinates !== vessel.coordinates
            })
            auxCoordinates = getCoordinates(auxMaritmeSpace)
            for (const coordinate of vessel.coordinates) {
                neighborsCoordinates = auxCoordinates.filter(c => {
                    return (c.row === coordinate.row && c.column === coordinate.column - 1)
                        || (c.row === coordinate.row && c.column === coordinate.column + 1)
                        || (c.row === coordinate.row - 1 && c.column === coordinate.column)
                        || (c.row === coordinate.row + 1 && c.column === coordinate.column)
                })
                if (neighborsCoordinates.length > 0) return false
            }
        }
        return true
    }

    const validCoordinates = maritmeSpace => {
        const coordinates = getCoordinates(maritmeSpace)
        if (!validCoordinatesInsideOfSpace(coordinates)) return false
        if (!validNotEqualCoordinates(coordinates)) return false
        if (!validNotNeighborsCoordinates(maritmeSpace)) return false
        return true
    }

    const validMaritmeSpace = vessels=>{
        if (!validTotalVesselsAmount(vessels) || !validVesselsAmount) 
        return 'AmountFailure'
        const maritmeSpace = generateMaritmeSpace(vessels)
        if (!validCoordinates(maritmeSpace))
        return 'CoordinatesFailure'
        return maritmeSpace
    }

    const vessels = await validMaritmeSpace(req.body.maritmeSpace)
    if (vessels == 'AmountFailure')
    return res.status(status.BAD_REQUEST).json(errorResponse(
        'Quantidade inválida',
        'Quantidade de embarcações inválida'
    ))
    if(vessels == 'CoordinatesFailure')
    return res.status(status.BAD_REQUEST).json(errorResponse(
        'Coordenadas inválidas',
        'Alguma embarcação está em uma coordenada inválida'
    ))
    req._vessels = vessels
    return next()
})

