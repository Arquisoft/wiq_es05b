const bcrypt = require("bcrypt");

module.exports = function (app, userRepository) {
  app.post("/adduser", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await userRepository.checkUser(username);
      if (user) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

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
