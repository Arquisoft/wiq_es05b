const express = require('express');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const axios = require('axios');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

let authMiddleware = require('./middleware/AuthMiddleware')

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

require("./routes/routes")(app, axios)
require("./routes/gameRoutes")(app, axios, authMiddleware)

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
