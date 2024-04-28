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
          .catch((error) =>{
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
      .catch(() => next({error: i18next.t("error_fetch_user")}))
  })
};
