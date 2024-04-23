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

  app.get("/users/search/:filter", async (req, res, next) => {
    console.log("gw")
    let filter = req.params.filter;
    console.log(filter)

    axios
      .get(`${userServiceUrl}/users/search/${filter}`)
      .then(({ data }) => {
        console.log(data);
        res.json(data);
      })
      .catch((error) => next({ error: "gw: An error occurred while fetching user data: " + error}));
  });

  app.post("/users/social/sendrequest", async (req, res, next) => {

    axios
      .post(`${userServiceUrl}/social/sendrequest`, req.body)
      .then(({ data }) => {
        console.log(data);
        res.json(data);
      })
      .catch((error) => next({ error: "gw: An error occurred while creating friend request: " + error}));
  });

  app.get("/users/social/sentrequests/:userId", async (req, res, next) => {
    const { userId } = req.params;

    axios
      .get(`${userServiceUrl}/social/sentrequests/${userId}`)
      .then(({ data }) => {
        console.log(data);
        res.json(data);
      })
      .catch((error) => next({ error: "gw: An error occurred while fetching sent requests: " + error}));
  });

  app.get("/users/social/receivedrequests/:userId", async (req, res, next) => {
    const { userId } = req.params;

    axios
      .get(`${userServiceUrl}/social/receivedrequests/${userId}`)
      .then(({ data }) => {
        console.log(data);
        res.json(data);
      })
      .catch((error) => next({ error: "gw: An error occurred while fetching received requests: " + error}));
  });

  app.get("/users/social/acceptrequest/:fromId/:toId", async (req, res, next) => {
    const { fromId, toId } = req.params;

    axios
      .get(`${userServiceUrl}/social/acceptrequest/${fromId}/${toId}`)
      .then(({ data }) => {
        console.log(data);
        res.json(data);
      })
      .catch((error) => next({ error: "gw: An error occurred while accepting friend request: " + error}));
  });

  app.get("/users/social/friends/:userId", async (req, res, next) => {
    const { userId } = req.params;

    axios
      .get(`${userServiceUrl}/social/friends/${userId}`)
      .then(({ data }) => {
        console.log(data);
        res.json(data);
      })
      .catch((error) => next({ error: "gw: An error occurred while fetching friends: " + error}));
  });

};
