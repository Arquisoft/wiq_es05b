const rankingServiceUrl = process.env.RANKING_SERVICE_URL || 'http://localhost:8005';

module.exports = (app, axios, errorHandler) => {
  app.get("/ranking/:n", (req, res) => {
    // Forward the get ranking request to the user service
    axios.get(`${rankingServiceUrl}/get/${req.params.n}`)
      .then(response => res.status(response.status).json(response.data))
      .catch(error => errorHandler(error, res, "An error occured while fetching the ranking"))
  });

  // TODO - Add to specification
  app.post("ranking/addScore", (req, res) => {
    // Forward the post add user request to the ranking service
    axios.post(`${rankingServiceUrl}/addScore`, req.body)
      .then(response => res.status(response.status).json(response.data))
      .catch(error => errorHandler(error, res, "An error occured while adding the record"))
  });
}
