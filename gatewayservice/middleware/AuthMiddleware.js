const axios = require('axios');
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

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

  axios
    .get(`${authServiceUrl}/validate/${token}`)
    .then(({data}) => {
      if (data.valid) {
        req.body.userIdToken = data.data.userId;
        next();
      } else {
        res.status(401).json({error: "Invalid token"});
      }
    })
    .catch(() => res.status(500).json({error: "Error validating token"}))
}
