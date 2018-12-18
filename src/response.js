// @ts-check

module.exports = {
    // 401 sample: {code: 'unsupported_over_http', message: 'IAuth only supports the calls over https'}
    error(res, definition, vars = {}){
        let json = {
            error: vars.error || definition.error || definition.code || definition.name || '0',
            message: vars.message || (definition.original && definition.original.message ? definition.original.message : definition.message)
        }

        Object.keys(vars).forEach(key => {
            json.message = json.message.split(`{${key}}`).join(vars[key])
        })

        res.status(definition.status || 401).json(json)
    },
    // : {
    //     authentication_failure: fn_error('Authentication Failure'),
    //     invalid_token: fn_error('Invalid token'),
    //     invalid_application_id: fn_error('Invalid parameter : application_id'),
    //     invalid_device_id: fn_error('Invalid parameter : device'),
    //     missing_application: fn_error('The request is missing a required parameter : application_id'),
    //     missing_device: fn_error('The request is missing a required parameter : device'),
    //     missing_password: fn_error('The request is missing a required parameter : password'),
    //     session_not_found: fn_error('Session not found'),
    //     session_token_not_found: fn_error('Token not found in session'),
    //     session_application_not_found: fn_error('Token not found in session'),
    //     token_invalidate_data: fn_error('Invalidate token data'),
    //     token_expired: fn_error('Token expired'),
    //     unsupported_over_http: fn_error('IAuth only supports the calls over https'),
    //     undefined_error: fn_error('Undefined error'),
    //     custom(res, definition, payload = {}){
    //         let json
    //         let status = payload.status || 401

    //         delete(payload.status)
            
    //         json = Object.assign({
    //             error_code: definition.code,
    //             error_description: definition.description
    //         }, payload)

    //         res.status(status).json(json)
    //     }
    // },

    // 200
    success(res, payload){
        res.status(200).json(payload || {})
    }
    
}
