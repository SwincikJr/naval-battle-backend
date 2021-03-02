const fs = require('fs')
const path = require('path')
const { validateAuthorization } = require('./jwt')
const { controller } = require('./controller')

const parseObject = (list, dir) =>
  list.reduce((acc, value) => {
    const obj = fs.readdirSync(`${dir}/${value}`)
    obj.forEach((a) =>
      acc.push({ object: a, root: `${value}`, dir: `${dir}/${value}/${a}` })
    )
    acc = acc.filter((a) => a.object !== 'rules.js')
    return acc
  }, [])

const generateRoute = (list, app) =>
  list.map((val) => {
    let args = [`/api${val.path}`]
    if (val.authenticate) args = args.concat(validateAuthorization)
    args = args.concat(val.middleware)
    args.push(controller(val.handler))
    app._router[val.method.toLowerCase()].apply(app._router, args)
  })

const orderByExpressRoutes = (list) => {
    const params = []
    const notParams = []
    for (let index = 0; index < list.length; index++) {
      const val = list[index]
      const c = require(val.dir)
      if (c.path.search(':') > 0) params.push(c)
      else notParams.push(c)
    }
    return [...notParams, ...params]
}

module.exports = (app) => {
    try {
      const dir = path.join(__dirname, '../controllers')
      const listRoutes = fs.readdirSync(dir)
      const parse = parseObject(listRoutes, dir)
      const orderByExpress = orderByExpressRoutes(parse)
      generateRoute(orderByExpress, app)
    } catch (error) {
      console.error(error)
      console.warn(`Error in generate modules routes express: ${error.message}`)
    }
}
