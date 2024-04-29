const { fieldChecker } = require("cyt-utils")

module.exports = (i18next) => (req, res, next) => {
    const result = fieldChecker(["username", "password"], req.body);
    if(result) return next({ status: 400, error: `${i18next.t("error_missing_field")} '${result}'` });

    next()
}