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

    userRepository.getUser({username})
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

  app.get("/user/:userId", (req, res) => {
    const { userId } = req.params;

    if(!userRepository.checkValidId(userId)) {
      res.status(400).json({ error: "Invalid id format" });
      return;
    }

    userRepository
      .getUser({ _id: userId })
      .then(user => {
        if(!user) {
          res.status(404).json({ error: "User not found" });
          return
        }
        const {_id, __v, password, ...output} = user
        res.json(output)
      })
      .catch(error => errorHandler(error, res, "An error occurred while fetching user data"));
  })
};
