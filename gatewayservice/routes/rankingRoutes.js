const rankingServiceUrl = process.env.RANKING_SERVICE_URL || 'http://localhost:8005';

module.exports = (app, axios, errorHandler) => {
  app.get("/ranking/:n", (req, res) => {
      // Forward the get ranking request to the user service
      axios.get(`${rankingServiceUrl}/ranking/${req.params.n}`)
        .then(response => res.status(response.status).json(response.data))
        .catch(error => errorHandler(error, res, "An error occured while fetching the ranking"))
  })
};
