const bcrypt = require("bcrypt");

module.exports = function (app, userRepository) {

  const i18next = app.get("i18next");

  app.post("/adduser", async (req, res, next) => {
    const { username, password } = req.body;

    userRepository.getUser({ username })
      .then(async user => {
        if (user) return next({ status: 400, error: i18next.t("error_user_exists") });

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

    if (!userRepository.checkValidId(userId)) return next({ status: 400, error: i18next.t("error_invalid_id") })

    userRepository
      .getUser({ _id: userId })
      .then(user => {
        if (!user) return next({ status: 404, error: i18next.t("error_user_not_found") })
        const { _id, __v, password, ...output } = user
        res.json(output)
      })
      .catch(() => next({ error: i18next.t("error_fetching_data") }));
  })

  app.get("/users/search/:filter", async (req, res, next) => {

    let filter;
    if (req.params.filter && req.params.filter === 'all')
      filter = null;
    else
      filter = { username: { $regex: req.params.filter, $options: "i" } }

    try {
      const users = await userRepository.getUsers(filter);
      console.log(users);
      res.json(users);
    } catch (error) {
      next({ error: "us: An error occurred while fetching user data: " + error })
    };
  })



};
