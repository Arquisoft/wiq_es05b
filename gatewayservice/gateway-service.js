const express = require('express');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const axios = require('axios');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

const dataValidatorMiddleware = require('./middleware/DataValidatorMiddleware')
const authMiddleware = require('./middleware/AuthMiddleware')
const errorHandler = require('./handler/errorHandler')
const authTokenMiddleware = require("./middleware/AuthTokenMiddleware")

app.use("/adduser", dataValidatorMiddleware)
app.use("/login", dataValidatorMiddleware)
app.use("/game", authMiddleware)
app.use("/history", authMiddleware)
app.use("/user", authMiddleware)

require("./routes/routes")(app)
require("./routes/jordiaRoutes")(app, axios, errorHandler)
require("./routes/rankingRoutes")(app, axios, errorHandler)
require("./routes/usersRoutes")(app, axios, errorHandler, authTokenMiddleware)
require("./routes/authRoutes")(app, axios, errorHandler)
require("./routes/historyRoutes")(app, axios, errorHandler, authTokenMiddleware)

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
