const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

module.exports = function (req, res, next) {
    const token = req.body.token || req.headers['authorization'];

    if(!token) {
        return res.status(401).json({error: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // req.user = decoded;
        next();
    } catch(err) {
        return res.status(401).json({error: "Invalid token"});
    }
}
