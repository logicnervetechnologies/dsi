const injest = require('./ingest.js')
const { read } = require('./types/types.js')


require('dotenv').config()
console.log("form_server")
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
// const cors = require('cors')

// app.use(cors({
//     origin:"http://localhost:3000",
//     credentials:true
// }))
app.use(express.json())

// user info routes
app.post('/ingest', pretendToken, injest.ingest)
app.post('/create', pretendToken, injest.create)
app.post('/read', pretendToken, read)


function pretendToken(req, res, next) {
    let user = {
        uid: req.body.fakeUID
    }
    req.user = user;
    console.log(req.user)
    next()
}

// authentication functions
function authenticateToken(req, res, next) {
    const authHeaderCookie = req.headers['cookie']
    const token = authHeaderCookie && convertCookieString(authHeaderCookie)['accessToken'] 
    req.user = null; 
    if (token == null) { 
        console.log("No auth token")
        return res.sendStatus(401) // check header
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        } //invalid token
        console.log(user.uid)
        req.user = user
        next()
    })
}
function convertCookieString(cookieStr) {
    var cookies = {}
    cookieStr.split("; ").map((sub) => {
        let k = sub.split('=')
        cookies[k[0]] = k[1]
    })
 //   console.log(cookies)
    return cookies
}

// start server
const PORT = process.env.HTTPPORT 
app.listen(PORT, () => {
    console.log("listenting on port:" + PORT)
})
// module.exports = { app }