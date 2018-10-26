// @ts-check

let response = {
    // 401 sample: {error_code: 'unsupported_over_http', error_description: 'IAuth only supports the calls over https'}
    error: {
        authentication_failure: fn_error('Authentication Failure'),
        invalid_token: fn_error('Invalid token'),
        invalid_application_id: fn_error('Invalid parameter : application_id'),
        invalid_device_id: fn_error('Invalid parameter : device'),
        missing_application: fn_error('The request is missing a required parameter : application_id'),
        missing_device: fn_error('The request is missing a required parameter : device'),
        missing_password: fn_error('The request is missing a required parameter : password'),
        session_not_found: fn_error('Session not found'),
        session_token_not_found: fn_error('Token not found in session'),
        session_application_not_found: fn_error('Token not found in session'),
        token_invalidate_data: fn_error('Invalidate token data'),
        token_expired: fn_error('Token expired'),
        unsupported_over_http: fn_error('IAuth only supports the calls over https'),
        undefined_error: fn_error('Undefined error'),
        custom(res, definition, payload = {}){
            let json
            let status = payload.status || 401

            delete(payload.status)
            
            json = Object.assign({
                error_code: definition.code,
                error_description: definition.description
            }, payload)

            res.status(status).json(json)
        }
    },
    
    // 200
    success(res, payload){
        res.status(200).json(payload || {})
    }
    
}

for (let k in response.error){
    response.error[k].__name__ = k
}

/**
 * @param {string} description
 * @returns {Function}
 */
function fn_error(description){
    
    /**
     * @type {any} 
     */
    let fn = function(res, payload={}){
        let json
        let status = payload.status || 401

        delete(payload.status)
        
        json = Object.assign({
            error_code: fn.__name__,
            error_description: description
        }, payload)

        res.status(status).json(json)
    }

    return fn
}

module.exports = response
