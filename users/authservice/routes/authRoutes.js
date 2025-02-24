const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fieldChecker } = require('cyt-utils');

// TODO - Move to GH secret
const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

module.exports = function (app, userRepository) {

  const i18next = app.get("i18next")

  app.post('/login', async (req, res, next) => {
    const value = fieldChecker(['username', 'password'], req.body)
    if(value) return next({status: 400, error: `${i18next.t("error_missing_field")} ${value}`})

    const { username, password } = req.body;

    userRepository.findUserByUsername(username)
      .then(async result => {
        if (result && await bcrypt.compare(password, result.password)) {
          const token = jwt.sign({ userId: result._id }, JWT_SECRET, { expiresIn: '4h' });
          res.json({ token, username, userId: result._id});
        } else {
          next({ status: 401, error: i18next.t("error_invalid_credentials") });
        }
      })
      .catch(err => next(err));
  });

  app.get('/validate/:token', (req, res) => {
    try {
      const {iat, exp, ...result} = jwt.verify(req.params.token, JWT_SECRET);
      res.json({ data: result, valid: true });
    } catch (error) {
      res.json({ valid: false });
    }
  });
}