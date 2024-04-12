const bcrypt = require("bcrypt");

module.exports = function (app, userRepository) {
  app.post("/adduser", async (req, res, next) => {
    const { username, password } = req.body;

    userRepository.getUser({username})
      .then(async user => {
        if (user) {
          next({ status: 400, error: "Username already exists" });
          return;
        }
    
        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
    
        userRepository
          .insertUser(username, hashedPassword)
          .then((result) => res.json(result))
          .catch((error) => next(error));
      })
      .catch(error => next(error));
  });

  app.get("/user/:userId", (req, res, next) => {
    const { userId } = req.params;

    if(!userRepository.checkValidId(userId)) {
      next({ status: 400, error: "Invalid id format" })
      return;
    }

    userRepository
      .getUser({ _id: userId })
      .then(user => {
        if(!user) {
          next({ status: 404, error: "User not found" })
          return
        }
        const {_id, __v, password, ...output} = user
        res.json(output)
      })
      .catch(() => {
        next({ error: "An error occurred while fetching user data" })
      });
  })
};
