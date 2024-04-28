const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (app, axios) => {

  const i18next = app.get("i18next");

  app.post("/login", async (req, res, next) => {
    axios.post(`${authServiceUrl}/login`, req.body)
      .then(response => res.json(response.data))
      .catch(() => next({error: i18next.t("error_unable_to_login")}));
  });

  app.get("/validate/:token", (req, res, next) => {
    axios
      .get(`${authServiceUrl}/validate/${req.params.token}`)
      .then(({ data }) => res.json({valid: data.valid}))
      .catch(() => next({error: i18next.t("error_validating_token")}));
  });
};
