// @ts-check

const jwt = require('jsonwebtoken');
const lzw = require('./lzw')

/**
 * @class
 */
class Token {
    /**
     * Set keys
     * @param {string} publicKey 
     * @param {string} privateKey 
     */
    static keys(publicKey, privateKey = null){
        this._publicKey = publicKey;
        this._privateKey = privateKey;
    }

    /**
     * Create new token
     * @param {*} payload 
     * @param {string} expiresIn 
     * @param {boolean} encode
     */
    static create(payload = {}, expiresIn='1d', encode=false){
        if (encode) {
            payload = {_:lzw.encode(JSON.stringify(payload))}
        }

        //cria o token com base na chave privada
        return jwt.sign(payload, this._privateKey, {
            "algorithm": 'RS256',
            "expiresIn": expiresIn //em segundos: 60*1=1min, 60*60=3600=1h, 3600*24=1d  
        });
    }

    /**
     * @param {string} token 
     */
    static validate(token) {
        //valida o token usando a chave pública

        /** @type {any} */
        let decoded = jwt.verify(token, this._publicKey)
        let json

        if (decoded && decoded._){
            json = JSON.parse(lzw.decode(decoded._))

            json.exp = decoded.exp
            json.iat = decoded.iat

            decoded = json
        }

        return decoded
    }

    /**
     * @param {string} token
     * @returns {*}
     */
    static decoder(token){
        /** @type {any} */
        let decoded = jwt.decode(token)
        let json

        if (decoded && decoded._){
            json = JSON.parse(lzw.decode(decoded._))

            json.exp = decoded.exp
            json.iat = decoded.iat

            decoded = json
        }

        return decoded
    }
}

module.exports = Token