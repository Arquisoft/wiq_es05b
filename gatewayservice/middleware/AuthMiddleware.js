const jwt = require('jsonwebtoken');

// TODO - Move to GH secret
const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

module.exports = function (req, res, next) {
  let {token} = req.body

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const authHeaderParts = authHeader.split(' ');
      if (authHeaderParts.length === 2 && authHeaderParts[0].toLowerCase() === 'bearer') {
        token = authHeaderParts[1];
      } else {
        return res.status(401).json({error: "No session token provided"});
      }
    }
  }

  // TODO - Move this functionality to auth service (modify validate endpoint)
  try {
    const {userId} = jwt.verify(token, JWT_SECRET);
    req.body.userId = userId;
    next();
  } catch (err) {
    return res.status(401).json({error: "Invalid token"});
  }
}
