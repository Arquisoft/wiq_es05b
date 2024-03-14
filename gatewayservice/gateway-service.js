const express = require('express');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

let router = require("./routes/routes")
let gameRouter = require("./routes/gameRoutes")

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use("/", router)
app.use("/game", gameRouter)

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
