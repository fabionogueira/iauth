#usage

``` javascript
const iauth = require('iauth')

//CONFIG
iauth.config.set({
    tokenExpireIn: '10min', // sample
    tokenPublicKey: 'my public key',
    tokenPrivateKey: 'my private key',
    sessionPath: 'path/to/sesions/directory'
})

// CREATING ACCESS TOKEN
let access_token = iauth.Token.create({ /* payload data */}, '1d' /* optional expireIn  */)
console.log(access_token)

// CREATING SESSION
iauth.Session.create('filename-unique', access_token, 'device-name', {
    // data for session
})

// CHANGING SESSION
let sessions = iauth.Session.read('filename-unique')
sessions['device-name'].newdata = 1
iauth.Session.write('filename-unique', sessions)

// READ SESSION
let session = iauth.Session.read('filename-unique')
console.log(session)

// TOKEN VALIDATION 
let valid = iauth.Token.validate(access_token)
console.log(session)

// TOKEN DECODER
let decoded = iauth.Token.decode(access_token)
console.log(decoded)

// SESSION DESTROY
iauth.Session.destroy('filename-unique', access_token, 'device-name')

// EXPRESS SAMPLE
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const iauth = require('iauth')

//CONFIG
iauth.config.set({
    tokenExpireIn: '10min', // sample
    tokenPublicKey: 'my public key',
    tokenPrivateKey: 'my private key',
    sessionPath: 'path/to/sesions/directory'
})

const app = express()

app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .post('/sign', (req, res) => {
        if (req.body.username == 'username' && req.body.password == 'password'){
            iauth.Response.error.authentication_failure(res, {
                message:'failure message'
            })
        } else {
            iauth.Response.success(res, { /* response payload */});
        }
    })

app.listen('8080', () => {
    console.log('iauth running in http://localhost:8080')
})

```
