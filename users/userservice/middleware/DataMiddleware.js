const checkFieldsOn = (fields, obj) => {
    for (const field of fields)
        if (!obj[field]) return field;
}

module.exports = function (req, res, next) {
    const result = checkFieldsOn(["username", "password"], req.body);
    if(result) return next({ status: 400, error: `Missing field ${result}` });

    next()
}