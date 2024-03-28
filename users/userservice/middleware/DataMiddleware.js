module.exports = function (req, res, next) {
    const { username, password } = req.body;

    if (!username) {
        res.status(400).json({ error: "Missing username" });
        return;
    }

    if (!password) {
        res.status(400).json({ error: "Missing password" });
        return;
    }

    next()
}