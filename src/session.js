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
    static config(options) {
        session_path = options.path
        if (!fs.existsSync(session_path)) {
            fs.mkdirSync(session_path)
        }
    }

    /**
    * Create new session
    * @param {string} id
    * @param {string} token
    * @param {object} content
    */
    static create(id, token, content = null) {
        //let session = this.read(file) || {}
        let session = {
            token,
            created: new Date()
        }

        session = Object.assign({}, session, content)

        this.write(id, session)
    }

    /**
    *
    * @param {string} id
    * @param {string} token
    */
    static destroy(id, token) {
        let session = this.read(id)

        if (session && session.token == token) {
            this.write(id, {});

            return true
        }

        return false
    }

    /**
    * @param {string} id
    */
    static get(id) {
        /** @type {any} */
        let data, session
        let path = `${session_path}/${id}`
        
        if (id && fs.existsSync(path)){
            // obtém o conteúdo do arquivo
            try {
                data = fs.readFileSync(path)
                session = JSON.parse(data)

            } catch (_e) {
                session = null
            }
        }

        return session
    }

    /**
    * @param {string} file
    */
    static read(file) {
        /**
        * @type {any}
        */
        let data
        let session
        let path = `${session_path}/${file}`

        // obtém o conteúdo do arquivo
        try {
            // cria o arquivo de sessão do usuário se não existir
            fs.closeSync(fs.openSync(path, 'a'))
            data = fs.readFileSync(path)
            session = JSON.parse(data)
        } catch (_e) {
            session = null
        }

        return session
    }

    /**
    * @param {string} file
    * @param {any} sessionData
    */
    static write(file, sessionData) {
        let path = `${session_path}/${file}`
        try {
            // cria o arquivo de sessão do usuário se não existir
            fs.closeSync(fs.openSync(path, 'a'))
            fs.writeFileSync(path, JSON.stringify(sessionData, null, 4))

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Session
