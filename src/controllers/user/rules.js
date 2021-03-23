const { body } = require('express-validator')
const { controller } = require('../../presenters/controller')
const TokenGenerator = require('uuid-token-generator')
const { findUserByEmail, findUserByUsername } = require('../../database/repository/user')
const { status } = require('../../presenters/http')
const { errorResponse } = require('../../presenters/handle')
const { hash } = require('../../presenters/encryptation')
const { sendMailTemplate } = require('../../presenters/email')
const { findUserByEmailAndActivationKey, findUserByEmailOrUsername } = require('../../database/repository/user')

exports.validateUserBody = [
    body('email').isEmail(),
    body('username').trim().isString().notEmpty(),
    body('password').trim().isString().notEmpty()
]

exports.validateActivateBody = [
    body('email').isEmail(),
    body('activation_key').trim().isString().notEmpty()
]

exports.validateRecoveryBody = [
    body('login').trim().isString().notEmpty()
]

exports.generateActivationKey = controller((req, _, next) => {
    req.body.activation_key = (new TokenGenerator(256, TokenGenerator.BASE62)).generate();
    return next()
})

exports.checkEmail = controller(async ({ body: { email } }, res, next) => {
    const user = await findUserByEmail(email)
    if (user) return res.status(status.BAD_REQUEST).json(errorResponse(
        'E-mail em uso!',
        'O endereço de e-mail informado já se encontra vincludado à outra conta.'
    ))
    return next()
})

exports.checkUsername = controller(async ({ body: { username } }, res, next) => {
    const user = await findUserByUsername(username)
    if (user) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Nome de usuário em uso!',
        'O nome de usuário informado já se encontra em uso.'
    ))
    return next()
})

exports.encryptPassword = controller((req, _, next) => {
    req.body.password = hash(req.body.password)
    return next()
})

exports.sendActivationEmail = (email, activation_key) => {
    const { BASE_URL_FRONT } = process.env
    const url = `${BASE_URL_FRONT}/user/activate?e=${email}&k=${activation_key}`
    return sendMailTemplate(
        email, 
        'Artemísia: Ativação de Conta', 
        'html',
        'activation',
        url
    )
}

const validProperties = ['email', 'username']

exports.checkExistsQuery = controller(({ query: { property, value } }, res, next) => {
    if (!property || !value || !validProperties.find(v => v === property)) 
        return res.status(status.BAD_REQUEST).json(errorResponse(
            'Parâmetros inválidos!',
            'Os parâmetros informados para consulta são inválidos.'
        ))
    return next()
})

exports.checkUser = controller(async (req, res, next) => {
    const { email, activation_key } = req.body
    const user = await findUserByEmailAndActivationKey(email, activation_key)
    if (!user) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Usuário não localizado!',
        'Não foi possível localizar o usuário para a confirmação de e-mail.'
    ))
    if (user.activated) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Já confirmado!',
        'O endereço de e-mail já se encontra confirmado.'
    ))
    req.body._id = user._id
    return next()
})

exports.checkLogin = controller(async (req, res, next) => {
    const user = await findUserByEmailOrUsername(req.body.login)
    if (!user) return res.status(status.BAD_REQUEST).json(errorResponse(
        'Usuário não encontrado!',
        'Nenhum usuário foi encontrado com o e-mail ou nickname fornecido.'
    ))
    req.body._id = user._id
    req.body.email = user.email
    return next()
})

exports.sendRecoveryMail = (email, activation_key) => {
    const { BASE_URL_FRONT } = process.env
    const url = `${BASE_URL_FRONT}/password/activate?e=${email}&k=${activation_key}`
    return sendMailTemplate(
        email, 
        'Artemísia: Recuperação de Senha', 
        'html',
        'recovery',
        url
    )
}
