const questionServiceUrl = process.env.JORDI_ASK_SERVICE_URL || "http://localhost:8003";

module.exports = (app, axios, errorHandler) => {
  app.post("/game/answer", (req, res) => {
    axios
      .post(`${questionServiceUrl}/answer`, req.body)
      .then((response) => res.status(response.status).send(response.data))
      .catch((error) =>
        errorHandler(error, res, "An error occured while fetching the answer")
      );
  });

  app.get("/categories", (_, res) => {
    axios
      .get(`${questionServiceUrl}/categories`)
      .then((response) => res.status(response.status).send(response.data))
      .catch((error) =>
        errorHandler(error, res, "An error occured while fetching the categories")
      );
  });

  // TODO - Check n is a number -> error 400
  // TODO - If no category is found -> error 404
  app.get("/questions/:category/:n", async (req, res) => {
      axios
        .get(`${questionServiceUrl}/questions/${req.params.category}/${req.params.n}`)
        .then((response) => res.status(response.status).send(response.data))
        .catch((error) =>
          errorHandler(error, res, "An error occured while fetching the questions")
        );
      
  });
};
