// @ts-check

const Token = require('./token')
const Response = require('./response')
const Session = require('./session')
const Client = require('./client')
const config = require('./config')

const iauth = {
    Response,
    Session,
    Token,
    Client,
    config
}

module.exports = iauth
