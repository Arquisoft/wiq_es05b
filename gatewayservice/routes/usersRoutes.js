const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:8001";
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (app, axios, authTokenMiddleware) => {

  const i18next = app.get("i18next")

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
            let e = error.error || i18next.t("error_login_service_unable")
            if (error.code && error.code.includes("ECONNREFUSED"))
              e = { error: i18next.t("error_service_unavailable") }
            res.json({ message: response.data.message, error: e })
          })
      })
      .catch(() => next({ error: i18next.t("error_adding_user") }));
  });

  app.get("/user/:userId", authTokenMiddleware, (req, res, next) => {
    const { userId } = req.params
    axios
      .get(`${userServiceUrl}/user/${userId}`)
      .then(({ data }) => res.json(data))
      .catch(() => next({ error: i18next.t("error_fetch_user") }))
  });

  app.get("/users/search/:filter", async (req, res, next) => {
    let filter = req.params.filter;

    axios
      .get(`${userServiceUrl}/users/search/${filter}`)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error: i18next.t("error_fetch_user") }));
  });

  app.post("/users/social/sendrequest", authTokenMiddleware, async (req, res, next) => {

    axios
      .post(`${userServiceUrl}/social/sendrequest`, req.body)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error: i18next.t("error_social_request") }));
  });

  app.get("/users/social/sentrequests/:userId", authTokenMiddleware, async (req, res, next) => {
    const { userId } = req.params;

    axios
      .get(`${userServiceUrl}/social/sentrequests/${userId}`)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error: i18next.t("error_social_fetch_requests") }));
  });

  app.get("/users/social/receivedrequests/:userId", authTokenMiddleware, async (req, res, next) => {
    const { userId } = req.params;

    axios
      .get(`${userServiceUrl}/social/receivedrequests/${userId}`)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error:  i18next.t("error_social_fetch_requests") }));
  });

  app.get("/users/social/acceptrequest/:fromId/:userId", authTokenMiddleware, async (req, res, next) => {
    const { fromId, userId } = req.params;

    axios
      .get(`${userServiceUrl}/social/acceptrequest/${fromId}/${userId}`)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error:  i18next.t("error_social_accept_request") }));
  });

  app.get("/users/social/friends/:userId", authTokenMiddleware, async (req, res, next) => {
    const { userId } = req.params;

    axios
      .get(`${userServiceUrl}/social/friends/${userId}`)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error:  i18next.t("error_social_fetch_friends") }));
  });

  app.post("/users/social/removefriend", authTokenMiddleware, async (req, res, next) => {
    axios
      .post(`${userServiceUrl}/social/removefriend`, req.body)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error: i18next.t("error_social_remove_friend") }));
  });

  app.post("/users/social/rejectrequest", authTokenMiddleware,  async (req, res, next) => {
    axios
      .post(`${userServiceUrl}/social/rejectrequest`, req.body)
      .then(({ data }) => {
        res.json(data);
      })
      .catch((error) => next({ error:  i18next.t("error_social_reject_request") }));
  });

};
