const express = require('express');
const promBundle = require('express-prom-bundle');
const axios = require('axios');
const { loggerFactory,  requestLoggerMiddleware,  responseLoggerMiddleware,  errorHandlerMiddleware } = require("cyt-utils")
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const logger = loggerFactory()

// Create the server
const app = express();
const port = 8000;

app.use(express.json());

app.use(requestLoggerMiddleware(logger.info.bind(logger), "Gateway Service"))
app.use(responseLoggerMiddleware(logger.info.bind(logger), "Gateway Service"))

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

// Open API
const openapiPath='./GatewayAPI.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}

// Error handler middleware
app.use(errorHandlerMiddleware(logger.error.bind(logger), "Gateway Service"))

// Start the gateway service
const server = app.listen(port, () =>
  console.log(`Gateway Service listening at port ${port}`));

module.exports = server
