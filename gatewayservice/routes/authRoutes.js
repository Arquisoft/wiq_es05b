const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (app, axios) => {

  app.post("/login", async (req, res, next) => {
    axios.post(`${authServiceUrl}/login`, req.body)
      .then(response => res.json(response.data))
      .catch(e => {
        console.log(e)
        if(e.code) return next(e.code)
        next({status: e.response.status, error: e.response.data})
      });
  });

  app.get("/validate/:token", (req, res, next) => {
    axios
      .get(`${authServiceUrl}/validate/${req.params.token}`)
      .then(({ data }) => res.json({valid: data.valid}))
      .catch(e => {
        if(e.code) return next(e.code)
        next({status: e.response.status, error: e.response.data})
      });
  });
};
