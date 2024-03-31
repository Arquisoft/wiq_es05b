const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:8001";
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (app, axios, errorHandler, authTokenMiddleware) => {
  app.post("/adduser", async (req, res) => {
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
            let e = error.error || "Login service is having a nap right now"
            if (error.code && error.code.includes("ECONNREFUSED")) 
              e = { error: "Service unavailable" }
            res.status(200).json({ message: response.data.message, error: e })
          })
      })
      .catch((err) => errorHandler(err, res, "An error occurred while adding user"));
  });

  app.get("/user/:userId", authTokenMiddleware, (req, res) => {
    const { userId } = req.params
    axios
      .get(`${userServiceUrl}/user/${userId}`)
      .then(({ data }) => res.json(data))
      .catch((error) => errorHandler(error, res, "An error occurred while fetching user data"))
  })
};
