const bcrypt = require("bcrypt");

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

module.exports = function (app, userRepository) {
  app.post("/adduser", async (req, res) => {
    try {
      // Check if required fields are present in the request body
      validateRequiredFields(req, ["username", "password"]);

      const { username, password } = req.body;

      // Encrypt the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      userRepository
        .insertUser(username, hashedPassword)
        .then((result) => res.json(result))
        .catch((error) => res.status(500).json(error));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};
