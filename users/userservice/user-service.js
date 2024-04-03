// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRepository = require('./repositories/userRepository');

const app = express();
const port = 8001;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';

// Middleware to parse JSON in request body
app.use(bodyParser.json());

const dataMiddleware = require('./middleware/DataMiddleware')
app.use("/adduser", dataMiddleware)

userRepository.init(mongoose, mongoUri);
require('./routes/routes')(app, userRepository)

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

module.exports = server