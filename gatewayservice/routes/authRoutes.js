const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (app, axios, errorHandler) => {
  app.post("/login", async (req, res) => {
    axios.post(`${authServiceUrl}/login`, req.body)
      .then(response => {
        res.json(response.data);  
      })
      .catch(error => errorHandler(error, res), "Unable to login");
  });

  app.get("/validate/:token", (req, res) => {
    axios
      .get(`${authServiceUrl}/validate/${req.params.token}`)
      .then(({ data }) => res.json(data))
      .catch((error) => errorHandler(error, res), "Unable to validate token");
  });
};
