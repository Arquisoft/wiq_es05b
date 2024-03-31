const bcrypt = require("bcrypt");

const errorHandler = (e, res, msg) => {
  let code = 500;
  let error = msg || "Internal Server Error";
  if(e.includes("ECONNREFUSED")) {
    code = 503;
    error = "Service Unavailable";
  }

  res.status(code).json({ error: error });
}

module.exports = function (app, userRepository) {
  app.post("/adduser", async (req, res) => {
    const { username, password } = req.body;

    userRepository.checkUser(username)
      .then(async user => {
        if (user) {
          res.status(400).json({ error: "Username already exists" });
          return;
        }
    
        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
    
        userRepository
          .insertUser(username, hashedPassword)
          .then((result) => res.json(result))
          .catch((error) => errorHandler(error, res));
      })
      .catch(error => errorHandler(error, res));
  });
};
