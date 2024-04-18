const express = require('express');
const app = express();
const port = 8002;
const mongoose = require('mongoose');
const winston = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format');
const promBundle = require('express-prom-bundle');

// Create a logger
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

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

// Middleware to log requests and responses
app.use(require("./middleware/ReqLoggerMiddleware")(logger.info.bind(logger)))
app.use(require("./middleware/ResLoggerMiddleware")(logger.info.bind(logger)))

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Initialize the user repository
const userRepository = require('./repositories/userRepository');
userRepository.init(mongoose, mongoUri);

// Middleware to parse JSON in request body
app.use(express.json());

// Routes
require('./routes/routes')(app, userRepository);

// Error handling middleware
app.use(require("./middleware/ErrorHandlerMiddleware")(logger.error.bind(logger)))

// Start the server
const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});

server.on('close', () => mongoose.connection.close());

module.exports = server
