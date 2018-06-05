// @ts-check

const Session = require('./session')
const Token = require('./token')

/**
 * @typedef {Object} IConfig
 * @property {string} [tokenExpireIn='10min']
 * @property {string} [tokenPrivateKey]
 * @property {string} tokenPublicKey
 * @property {string} [sessionPath]
 */

/**
 * @type {IConfig}
 */
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

    /**
     * @param {IConfig} config 
     */
    set(config){
        _config = config

        Token.keys(config.tokenPublicKey, config.tokenPrivateKey)
        Session.config({
            path: config.sessionPath || './'
        })

        return this
    }
}
