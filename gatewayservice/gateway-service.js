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
app.use("/adduser", dataValidatorMiddleware)
app.use("/login", dataValidatorMiddleware)

require("./routes/routes")(app, axios)

const authMiddleware = require('./middleware/AuthMiddleware')
require("./routes/gameRoutes")(app, axios, authMiddleware)

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
