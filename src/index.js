// @ts-check

const Token = require('./token')
const Response = require('./response')
const Session = require('./session')
const config = require('./config')

const iauth = {
    Response,
    Session,
    Token,
    config
}

module.exports = iauth
