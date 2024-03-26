const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET || "a-very-secret-string"

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!field in req.body) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

module.exports = function (app, userRepository) {

  // Route for user login
  app.post('/login', async (req, res) => {
    try {
      // Check if required fields are present in the request body
      validateRequiredFields(req, ['username', 'password']);
  
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
}