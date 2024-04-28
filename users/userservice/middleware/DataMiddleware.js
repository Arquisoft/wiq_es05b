
// TODO - Move to npm package
const checkFieldsOn = (fields, obj) => {
    for (const field of fields)
        if (!obj[field]) return field;
}

module.exports = (i18next) => (req, res, next) => {
    const result = checkFieldsOn(["username", "password"], req.body);
    if(result) return next({ status: 400, error: `${i18next.t("error_missing_field")} '${result}'` });

    next()
}