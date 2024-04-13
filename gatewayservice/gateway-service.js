const express = require('express');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const axios = require('axios');
const winston = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format');

const logger = winston.createLogger({
  level: 'debug',
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'debug'
    })
  ]
})

// Create the server
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use(require("./middleware/ReqLoggerMiddleware")(logger.info.bind(logger)))
app.use(require("./middleware/ResLoggerMiddleware")(logger.info.bind(logger)))

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Middleware instantiation
const dataValidatorMiddleware = require('./middleware/DataValidatorMiddleware')
const authMiddleware = require('./middleware/AuthMiddleware')
const authTokenMiddleware = require("./middleware/AuthTokenMiddleware")

// Routes middleware
app.use("/adduser", dataValidatorMiddleware)
app.use("/login", dataValidatorMiddleware)
app.use("/game", authMiddleware)
app.use("/history", authMiddleware)
app.use("/user", authMiddleware)

// Routes
require("./routes/routes")(app)
require("./routes/jordiRoutes")(app, axios)
require("./routes/usersRoutes")(app, axios, authTokenMiddleware)
require("./routes/authRoutes")(app, axios)
require("./routes/historyRoutes")(app, axios, authTokenMiddleware)

// Error handler middleware
app.use(require("./middleware/ErrorHandlerMiddleware")(logger.error.bind(logger)))

// Start the gateway service
const server = app.listen(port, () =>
  console.log(`Gateway Service listening at port ${port}`));

module.exports = server
