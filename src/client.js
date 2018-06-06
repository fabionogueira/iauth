// @ts-check

const request = require("request")
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

    /**
     * @param {{method?: string, memberOf?: any, rule?: string, preserveHeaders?:boolean, request?: Function, response?:Function, options?:{}, url: string, headers:{}, requireAuthentication:boolean}} options 
     */
    static proxy(options){
        options.method = options.method || 'get'
        options.method = options.method.toLowerCase()
        options.requireAuthentication = options.requireAuthentication == undefined ? true : options.requireAuthentication 
        options.preserveHeaders = options.preserveHeaders == undefined ? true : options.preserveHeaders

        function irouter(req, res){
            let params = (req.originalUrl.split('?')[1] || '').split('&').reduce(function(map, obj){ var a=obj.split('='); map[a[0]]=a[1]; return map }, {})
            let token = req.headers['access_token'] || params.access_token || req.body.access_token || req.query.access_token || req.query.token
            
            if (options.requireAuthentication){
                Client.setToken(token, error => {
                    if (error){
                        return res.status(401).json(error)
                    }

                    Client.grant({
                        memberOf: options.memberOf,
                        rule: options.rule,
                        allows: ()=>{
                            doProxy(req, res)
                        },
                        denied: ()=>{
                            res.status(401).json({
                                name: 'UnauthorizedAccess',
                                message: 'Unauthorized Access'
                            })
                        }
                    })
                })
            } else {
                doProxy(req, res)
            }
        }

        function doProxy(req, res){
            let i
            let params = (req.originalUrl.split('?')[1] || '')
            let requestOptions = {
                url    : options.url + (params ? `?${params}` : ''), 
                method : options.method,
                headers: {},
                body   : req.body
            }
            
            if (options.headers){
                for (i in options.headers) {
                    requestOptions.headers[i] = req.headers[i] === undefined ? options.headers[i] : req.headers[i]
                }
            } else {
                requestOptions.headers = req.headers
            }

            Object.keys(requestOptions.headers).forEach(item => {
                if (requestOptions.headers[item]===undefined || requestOptions.headers[item]=='undefined' || 
                    requestOptions.headers[item]===null || requestOptions.headers[item]=='null'){
                    delete(requestOptions.headers[item])
                }
            })

            if (options.options){
                Object.keys(options.options).forEach(key => {
                    requestOptions[key] = options.options[key]
                })
            }

            if (!requestOptions.gzip && requestOptions.body){
                requestOptions.json = true
            }

            if (Object.keys(requestOptions.body).length==0){
                delete(requestOptions.body)
            }

            // data = typeof(options.request)=='function' ? options.request(data || {}) : (data || r.request);
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      
            function complete(err, response){
                let i

                if (response && options.preserveHeaders){
                    for (i in response.headers){
                        res.set(i, response.headers[i])
                    }
    
                    res.status(response.statusCode)
                }

                if (options.response){
                    options.response(err, response, (newBody) => {
                        res.send(newBody ? newBody : response ? response.body : err)
                    })

                } else {
                    res.send(response ? response.body : err)
                }

            }

            request(requestOptions, complete);
        }

        return irouter
    }
}

module.exports = Client