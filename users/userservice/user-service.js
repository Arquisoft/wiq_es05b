// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {loggerFactory, errorHandlerMiddleware, responseLoggerMiddleware, requestLoggerMiddleware} = require("cyt-utils")
const promBundle = require('express-prom-bundle');

// Create a logger
const logger = loggerFactory()

// Create Express app
const app = express();
const port = 8001;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
const userRepository = require('./repositories/userRepository');
mongoose.connect(mongoUri);

// Middleware to log requests and responses
app.use(requestLoggerMiddleware(logger.info.bind(logger), "User Service"))
app.use(responseLoggerMiddleware(logger.info.bind(logger), "User Service"))

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Routes middleware
const dataMiddleware = require('./middleware/DataMiddleware')
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