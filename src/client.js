// @ts-check

const Token = require('./token')

class Client {
    /**
     * @param {*} options 
     */
    static grant(options = {}){
        let group, r
        let memberOf = this.memberOf()
        let rule = typeof(options.rule) == 'function' ? options.rule() : (options.rule === undefined ? true : options.rule)
        
        if (!options.memberOf){
            return allows()
        }

        if (Object.keys(options.memberOf).length==0){
            return allows()
        }

        for (group in memberOf){
            r = options.memberOf[group]
            
            if (typeof(r) == 'function'){
                r = r()
            }

            if (r){
                return allows()
            }
        }

        function allows(){
            if (!rule){
                return denied()
            }

            if (typeof(options.allows) == 'function'){
                options.allows()
            }        
            return true
        }
        function denied(){
            if (typeof(options.denied) == 'function'){
                options.denied()
            }
            return false
        }

        return denied()
    }

    /**
     * @param {string} token 
     * @param {function} next 
     */
    static setToken(token, next){
        let decoded
        let error = null

        this._decoded = null

        try {
            decoded = Token.validate(token)
            this._token = token
            this._decoded = Token.decoder(token)
        } catch (err) {
            error = err
        }
        
        if (next){
            next(error, decoded)
        }

        return error ? {error} : decoded
    }

    static getToken(){
        return this._token
    }
    
    static memberOf(){
        return this._decoded ? (this._decoded.memberOf || {}) : {}
    }

    /**
     * @param {object | function} options
     * @param {function} [callback]
     * @returns {function | any} 
     */
    static router(options, callback){
        options = arguments.length > 1 ? (options || {})  : {}
        callback= arguments.length > 1 ? callback : options

        function irouter(req, res){
            let token = req.headers['access_token'] || req.params.access_token || req.body.access_token
            
            Client.setToken(token, (error) => {
                if (error){
                    return res.status(401).json(error)
                }

                Client.grant({
                    memberOf: options.memberOf,
                    rule: options.rule,
                    allows: ()=>{
                        callback(req, res)        
                    },
                    denied: ()=>{
                        res.status(401).json({
                            name: 'UnauthorizedAccess',
                            message: 'Unauthorized Access'
                        })
                    }
                })
            })
        }

        return irouter
    }
}

module.exports = Client