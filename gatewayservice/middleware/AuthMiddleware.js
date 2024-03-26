const jwt = require('jsonwebtoken');

// TODO - Move to GH secret
const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

module.exports = function (req, res, next) {
    const token = req.body.token || req.headers['authorization'];

    if(!token) {
        return res.status(401).json({error: "No session token provided"});
    }

    try {
        jwt.verify(token, JWT_SECRET);
        next();
    } catch(err) {
        return res.status(401).json({error: "Invalid token"});
    }
}
