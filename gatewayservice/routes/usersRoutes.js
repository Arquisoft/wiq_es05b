const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:8001";
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";

module.exports = (app, axios, errorHandler) => {
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
      .catch((err) =>
        errorHandler(err, res, "An error occured while adding user")
      );
  });
};
