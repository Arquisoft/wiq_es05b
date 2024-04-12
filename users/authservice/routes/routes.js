const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// TODO - Move to GH secret
const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

const checkFieldsOn = (fields, obj) => {
  for (let field of fields)
    if (!obj[field]) return field;
  return null;
}

module.exports = function (app, userRepository) {

  app.post('/login', async (req, res, next) => {
    const value = checkFieldsOn(['username', 'password'], req.body)
    if(value) return next({status: 400, error: `Missing ${value}`})

    const { username, password } = req.body;

    userRepository.findUserByUsername(username)
      .then(async result => {
        if (result && await bcrypt.compare(password, result.password)) {
          const token = jwt.sign({ userId: result._id }, JWT_SECRET, { expiresIn: '4h' });
          res.json({ token, username, userId: result._id});
        } else {
          next({ status: 401, error: 'Invalid credentials' });
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