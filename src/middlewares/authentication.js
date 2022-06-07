const jwt = require("jsonwebtoken")
const secret = "Project 5"

let decodeToken = function (token) {
    return jwt.verify(token, secret, function (err, data) {
        if (err)
            return null
        else
            return data
    })   
}

const userAuthentication = function (req, res, next) {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(400).send({ status: false, message: "Token must be present" })
        token = token.split(' ')[1]
        let verifyToken = decodeToken(token)
        if (!verifyToken)
            return res.status(401).send({
                status: false,
                message: "Token is either Invalid or Expired."
            })
        req.decodedToken = verifyToken
        next()
    } catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

module.exports = { userAuthentication }