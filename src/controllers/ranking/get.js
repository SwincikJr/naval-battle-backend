const { controller } = require('../../presenters/controller')
const { status } = require('../../presenters/http')

exports.path = '/ranking'
exports.method = 'get'
exports.middleware = []
exports.authenticate = true


exports.handler = controller(async (req, res) => {
    return res.status(status.OK).json({
        ranking:[{
            username: "Chewbacca",
            score: 1000
        },
        {
            username: "R2D2",
            score: 800
        },
        {
            username: "C3PO",
            score: 500
        }
        ],
        myScore:[{
            username: "PrinceLéia",
            score: 400
        }]
    })
})