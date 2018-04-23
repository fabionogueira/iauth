// @ts-check

const Session = require('./session')
const Token = require('./token')

let _config = {
    tokenExpireIn: '10min',
    tokenPublicKey: '',
    tokenPrivateKey: '',
    sessionPath: ''
}

module.exports = {
    get(){
        return _config
    },

    set(config){
        _config = config

        Token.keys(config.tokenPublicKey, config.tokenPrivateKey)
        Session.config({
            path: config.sessionPath
        })

        return this
    }
}
