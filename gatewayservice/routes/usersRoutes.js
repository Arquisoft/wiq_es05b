const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:8001";
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (app, axios, authTokenMiddleware) => {
  app.post("/adduser", async (req, res, next) => {
    axios
      .post(`${userServiceUrl}/adduser`, req.body)
      .then((response) => {
        axios
          .post(`${authServiceUrl}/login`, req.body)
          .then(({ data }) => {
            res.json({
              message: response.data.message,
              ...data
            });
          })
          .catch((error) => {
            let e = error.error || "Login service is having a nap right now"
            if (error.code && error.code.includes("ECONNREFUSED"))
              e = { error: "Service unavailable" }
            res.status(200).json({ message: response.data.message, error: e })
          })
      })
      .catch(() => next({ error: "An error occurred while adding user" }));
  });

  app.get("/user/:userId", authTokenMiddleware, (req, res, next) => {
    const { userId } = req.params
    axios
      .get(`${userServiceUrl}/user/${userId}`)
      .then(({ data }) => res.json(data))
      .catch(() => next({ error: "An error occurred while fetching user data" }))
  });

  app.get("/users/:filter", authTokenMiddleware, async (req, res, next) => {
    console.log("asjlfbajsbsaujbsabosafbfsai")
    let filter = req.params.filter;

    axios
      .get(`${userServiceUrl}/users/${filter}`)
      .then(({ data }) => {
        console.log(data);
        if (data.length === 0) return next({ status: 404, error: "No users found" });
        res.json(data);
      })
      .catch(() => next({ error: "An error occurred while fetching user data" }));
  });

};
