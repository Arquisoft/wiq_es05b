const historyService = process.env.HISTORY_SERVICE_URL || "http://localhost:8006";

module.exports = (app, axios, errorHandler) => {
  app.get("/history/get/:userId", (req, res) => {
    const { userId } = req.params
    const { page, limit } = req.query
    const { userId: userIdBody } = req.body

    if (userIdBody && userIdBody !== userId) {
      res.status(401).json({ error: "You don't own this save" })
      return
    }

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

  app.get("/history/get/:userId/:id", (req, res) => {
    const { userId, id } = req.params
    const { userId: userIdBody } = req.body

    if (userIdBody && userIdBody !== userId) {
      res.status(401).json({ error: "You don't own this save" })
      return
    }

    axios
      .get(`${historyService}/get/${userId}/${id}`)
      .then(response => res.status(response.status).json(response.data))
      .catch(error =>
        errorHandler(error, res, "An error occurred while fetching user history"))
  })
}