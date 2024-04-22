// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {loggerFactory, errorHandlerMiddleware, responseLoggerMiddleware, requestLoggerMiddleware} = require("cyt-utils")
const promBundle = require('express-prom-bundle');
const i18next = require('i18next');

// Create a logger
const logger = loggerFactory()

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: require('./locals/en.json'),
    es: require('./locals/es.json'),
  }
})

// Create Express app
const app = express();
const port = 8001;

app.set("i18next", i18next);

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
const userRepository = require('./repositories/userRepository');
mongoose.connect(mongoUri);

// Middleware to log requests and responses
app.use(requestLoggerMiddleware(logger.info.bind(logger), "User Service"))
app.use(responseLoggerMiddleware(logger.info.bind(logger), "User Service"))

app.use(require("./middleware/i18nMiddleware")(i18next));

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Routes middleware
const dataMiddleware = require('./middleware/DataMiddleware')(i18next)
app.use("/adduser", dataMiddleware)

// Initialize the repository
userRepository.init(mongoose, mongoUri);

// Routes
require('./routes/routes')(app, userRepository)

// Error handling middleware
app.use(errorHandlerMiddleware(logger.error.bind(logger), "User Service"))

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

server.on('close', () => mongoose.connection.close());

module.exports = server