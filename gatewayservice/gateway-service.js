const express = require('express');
const promBundle = require('express-prom-bundle');
const axios = require('axios');
const cors = require('cors');
const { loggerFactory,  requestLoggerMiddleware,  responseLoggerMiddleware,  errorHandlerMiddleware } = require("cyt-utils")
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const i18next = require('i18next');

const logger = loggerFactory()

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: require('./locals/en.json'),
    es: require('./locals/es.json'),
  }
})

// Create the server
const app = express();
const port = 8000;

app.set("i18next", i18next)

app.use(express.json());
app.use(cors());

app.use(requestLoggerMiddleware(logger.info.bind(logger), "Gateway Service"))
app.use(responseLoggerMiddleware(logger.info.bind(logger), "Gateway Service"))

app.use(require("./middleware/i18nMiddleware")(i18next))

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Middleware instantiation
const dataValidatorMiddleware = require('./middleware/DataValidatorMiddleware')(i18next)
const authMiddleware = require('./middleware/AuthMiddleware')(i18next)
const authTokenMiddleware = require("./middleware/AuthTokenMiddleware")(i18next)

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
