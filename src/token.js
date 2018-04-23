// @ts-check

const jwt = require('jsonwebtoken');

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
     * @param {*} expiresIn 
     */
    static create(payload={}, expiresIn='1d'){
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
        return jwt.verify(token, this._publicKey)
    }

    /**
     * @param {string} token
     * @returns {any}
     */
    static decoder(token){
        return jwt.decode(token)
    }
}

module.exports = Token