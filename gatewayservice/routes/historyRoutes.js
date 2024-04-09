const historyService = process.env.HISTORY_SERVICE_URL || "http://localhost:8004";

module.exports = (app, axios, errorHandler, authMiddleware) => {
  app.get("/history/get/:userId", authMiddleware, (req, res) => {
    const { userId } = req.params
    const { page, limit } = req.query

    let url = `${historyService}/get/${userId}`

    if(!isNaN(parseInt(page)) && !isNaN(parseInt(limit))) {
      url += `?page=${page}&limit=${limit}`
    }

    axios
      .get(url)
      .then(response => res.status(response.status).json(response.data))
      .catch(error =>
        errorHandler(error, res, "An error occurred while fetching user history"))
  })

  app.get("/history/get/:userId/:id", authMiddleware, (req, res) => {
    const { userId, id } = req.params

    axios
      .get(`${historyService}/get/${userId}/${id}`)
      .then(response => res.status(response.status).json(response.data))
      .catch(error =>
        errorHandler(error, res, "An error occurred while fetching user history"))
  })

  app.post("/history/create", authMiddleware, (req, res) => {
    const { userId, category } = req.body

    axios
      .post(`${historyService}/create`, { userId, category })
      .then(response => res.status(response.status).json(response.data))
      .catch(error =>
        errorHandler(error, res, "An error occurred while creating the save"))
  })

  app.post("/history/add/:id", (req, res) => {
    const { id } = req.params
    const { last, statement, options, answer, correct, time, points } = req.body

    axios
      .post(`${historyService}/add/${id}`, { last, statement, options, answer, correct, time, points })
      .then(response => res.status(response.status).json(response.data))
      .catch(error =>
        errorHandler(error, res, "An error occurred while creating the save"))
  })

  app.get("/ranking/:n", (req, res) => {
    // Forward the get ranking request to the user service
    axios.get(`${rankingServiceUrl}/ranking/${req.params.n}`)
      .then(response => res.status(response.status).json(response.data))
      .catch(error => errorHandler(error, res, "An error occured while fetching the ranking"))
  })
}