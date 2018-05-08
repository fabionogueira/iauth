// @ts-check

const fs = require('fs')

let session_path

/**
 * @class
 */
class Session {
    /**
     * @param {Object} options 
     */
    static config(options){
        session_path = options.path
        if (!fs.existsSync(session_path)){
            fs.mkdirSync(session_path)
        }
    }

    /**
     * Create new session
     * @param {string} id 
     * @param {string} token 
     * @param {string} client_device 
     * @param {object} content 
     */
    static create(id, token, client_device, content = null){
        let sessions = this.read(id) || {}
        let session = {
            token,
            created: new Date()
        }

        session = Object.assign({}, session, content)
        sessions[client_device] = session

        this.write(id, sessions)
    }

    /**
     * 
     * @param {string} id 
     * @param {string} token 
     * @param {string} client_device 
     */
    static destroy(id, token, client_device){
        let sessions = this.read(id) || {}
        let session = sessions[client_device]

        if (session && session.token == token){
            delete(sessions[client_device])
            this.write(id, sessions);

            return true
        }

        return false
    }

    /**
     * @param {string} id 
     */
    static read(id){
        /**
         * @type {any}
         */
        let data
        let obj
        let file = `${session_path}/${id}`
        
        
        // obtém o conteúdo do arquivo
        try{
            // cria o arquivo de sessão do usuário se não existir
            fs.closeSync(fs.openSync(file, 'a'))
            data = fs.readFileSync(file)
            obj = JSON.parse(data)
        }catch(_e){
            obj = null
        }

        return obj
    }

    /**
     * @param {string} id 
     * @param {any} sessions 
     */
    static write(id, sessions){
        let file = `${session_path}/${id}`
       
        try {
            // cria o arquivo de sessão do usuário se não existir
            fs.closeSync(fs.openSync(file, 'a'))
            fs.writeFileSync(file, JSON.stringify(sessions, null, 4))

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Session
