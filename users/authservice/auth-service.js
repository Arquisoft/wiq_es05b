const express = require('express');
const app = express();
const port = 8002;
const mongoose = require('mongoose');
const { loggerFactory, errorHandlerMiddleware, responseLoggerMiddleware, requestLoggerMiddleware, i18nextMiddleware, i18nextInitializer } = require("cyt-utils")
const promBundle = require('express-prom-bundle');
const i18next = require('i18next');

// Create a logger
const logger = loggerFactory()

i18nextInitializer(i18next, {
  en: require('./locals/en.json'),
  es: require('./locals/es.json'),
})

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

// Middleware to log requests and responses
app.use(requestLoggerMiddleware(logger.info.bind(logger), "Auth Service"))
app.use(responseLoggerMiddleware(logger.info.bind(logger), "Auth Service"))

app.set("i18next", i18next);
app.use(i18nextMiddleware(i18next))

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Initialize the user repository
const userRepository = require('./repositories/userRepository');
userRepository.init(mongoose, mongoUri);

// Middleware to parse JSON in request body
app.use(express.json());

// Routes
require('./authRoutes')(app, userRepository);

// Error handling middleware
app.use(errorHandlerMiddleware(logger.error.bind(logger), "Auth Service"))

// Start the server
const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});

server.on('close', () => mongoose.connection.close());

module.exports = server
