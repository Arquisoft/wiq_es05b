const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// TODO - Move to GH secret
const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

module.exports = function (app, userRepository) {

  // Route for user login
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      // Find the user by username in the database

      userRepository.findUserByUsername(username)
        .then(async result => {
          // Check if the user exists and verify the password
          if (result && await bcrypt.compare(password, result.password)) {
            // Generate a JWT token
            const token = jwt.sign({ userId: result._id }, JWT_SECRET, { expiresIn: '1h' });
            // Respond with the token and user information
            res.json({ token: token, username: username});
          } else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/validate/:token', (req, res) => {
    try {
      // Verify the token
      jwt.verify(req.params.token, JWT_SECRET);
      // Respond with the decoded token
      res.json({ valid: true });
    } catch (error) {
      res.json({ valid: false });
    }
  });
}