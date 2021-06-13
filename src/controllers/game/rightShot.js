const { findBoardByQuery, updateBoard } = require("../../database/repository/board")
const { endMatch, updateUserMovingOfMatch } = require("../../database/repository/match")
const { updateUserInfo } = require("../../database/repository/user")
const { controller } = require("../../presenters/controller")
const { runEvent } = require("../../presenters/events")
const { validateIdInParams, errorResponse } = require("../../presenters/handle")
const { status } = require("../../presenters/http")
const { validateErrorBody } = require("../../presenters/validator")
const { checkUsersOfMatch, checkUserMoving, checkDiamondsOfUser, calculateLoot } = require("./rules")

exports.path = '/game/rightShot/:_id'
exports.method = 'post'
exports.middleware = [
    validateIdInParams,
    validateErrorBody,
    checkDiamondsOfUser(1),
    checkUsersOfMatch,
    checkUserMoving
]
exports.authenticate = true

exports.handler = controller(async (req, res) => {
    
    const userBoard = await findBoardByQuery({
        UserId: req._rt_auth_token._id,
        MatchId: req.params._id
    })

    if (!userBoard) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Tabuleiro não localizado!',
        'Finalize o posicionamento de suas embarcações antes de solicitar esta ação.'
    ))

    if (!userBoard.rightShot) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Movimento esgotado!',
        'Você não pode mais efetuar Tiros Certos nesta partida.'
    ))

    const opponentBoard = await findBoardByQuery({
        UserId: { $ne: req._rt_auth_token._id },
        MatchId: req.params._id
    })
    
    if (!opponentBoard) {
        return res.status(status.BAD_REQUEST).json(errorResponse(
            'Tabuleiro não localizado!',
            'Seu oponente ainda não posicionou suas embarcações.'
        ))
    }

    const remainingVessels = opponentBoard.vessels.filter(v => !!v.coordinates.find(c => !c.destroyed))

    if (!remainingVessels.length) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Sem embarcações restantes!',
        'Todas as embarcações adversárias já foram destruídas.'
    ))

    let random = remainingVessels.length > 1 
        ? Math.floor(Math.random() * remainingVessels.length) : 0

    const randomVessel = remainingVessels[random]

    const remainingCoordinates = randomVessel.coordinates.filter(c => !c.destroyed)

    let coordinate = remainingCoordinates[0]

    if (remainingCoordinates.length > 1) {

        random = Math.floor(Math.random() * remainingCoordinates.length)

        coordinate = remainingCoordinates[random]
    }

    coordinate.destroyed = true

    await updateBoard(opponentBoard._id, opponentBoard)
    await updateBoard(userBoard._id, {
        $inc: { rightShot: -1 }
    })

    const sanked = remainingCoordinates.length === 1
    const victory = remainingVessels.length === 1 && remainingCoordinates.length === 1
    let score = 0
    let coins = 0

    if (victory) {

        const loot = await calculateLoot(req.params._id, req._rt_auth_token._id)
        score = loot.score
        coins = loot.coins

        await updateUserInfo(req._rt_auth_token._id, {
            $inc: { score, coins, diamonds: -1 },
            playing: false
        })

        await updateUserInfo(opponentBoard.UserId, { playing: false })

        await endMatch(req.params._id)
    
    } else {

        await updateUserInfo(req._rt_auth_token._id, {
            $inc: { diamonds: -1 }
        })
    }
    
    runEvent('artemisia.attack', { 
        UserId: opponentBoard.UserId,
        row: coordinate.row,
        column: coordinate.column,
        hit: true,
        sanked,
        defeat: victory
    })
    
    return res.status(status.OK).json({ 
        row: coordinate.row,
        column: coordinate.column, 
        hit: true, 
        sanked, 
        victory, 
        coins, 
        score 
    })
})
