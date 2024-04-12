// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

const userRepository = require('./repositories/userRepository');

const app = express();
const port = 8001;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

app.use(require("./middleware/ReqLoggerMiddleware")(logger.info.bind(logger)))
app.use(require("./middleware/ResLoggerMiddleware")(logger.info.bind(logger)))

// Middleware to parse JSON in request body
app.use(bodyParser.json());

const dataMiddleware = require('./middleware/DataMiddleware')
app.use("/adduser", dataMiddleware)

userRepository.init(mongoose, mongoUri);
require('./routes/routes')(app, userRepository)

app.use(require("./middleware/ErrorHandlerMiddleware")(logger.error.bind(logger)))

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

server.on('close', () => mongoose.connection.close());

module.exports = server