const axios = require('axios');
const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:8001";

module.exports = (i18next) => (req, res, next) => {

    console.log(req.userIdToken)

    axios.get(userServiceUrl + "/user/" + req.userIdToken).then(user => {
        console.log(user)
        user.data.username === "admin" ? next() : next({ status: 403, error: i18next.t("error_not_admin")} )
    })

}
