const axios = require('axios');
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (i18next) => (req, res, next) => {
  let {token} = req.body

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const authHeaderParts = authHeader.split(' ');
      if (authHeaderParts.length === 2 && authHeaderParts[0].toLowerCase() === 'bearer') {
        token = authHeaderParts[1];
      } else {
        return next({status: 401, error: i18next.t("error_no_session_token")})
      }
    }
  }

  axios
    .get(`${authServiceUrl}/validate/${token}`)
    .then(({data}) => {
      if (data.valid) {
        req.userIdToken = data.data.userId;
        return next();
      }
      next({status: 401, error: i18next.t("error_invalid_token")});
    })
    .catch(() => next({error: i18next.t("error_validating_token")}))
}
