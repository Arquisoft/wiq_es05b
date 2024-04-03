const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const errorHandler = (e, res, msg) => {
  let code = 500
  let error = msg || 'Internal Server Error'
  if(e.includes('ECONNREFUSED')) {
    code = 503
    error = 'Service Unavailable'
  }

  res.status(code).json({ error: error })
}

// TODO - Move to GH secret
const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

module.exports = function (app, userRepository) {

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if(!username) {
      res.status(400).json({ error: 'Missing username' });
      return;
    }
    if(!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    userRepository.findUserByUsername(username)
      .then(async result => {
        if (result && await bcrypt.compare(password, result.password)) {
          const token = jwt.sign({ userId: result._id }, JWT_SECRET, { expiresIn: '1h' });
          res.json({ token, username, userId: result._id});
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      })
      .catch(err => errorHandler(err, res));
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