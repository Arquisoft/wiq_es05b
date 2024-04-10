const express = require('express');
const app = express();
const port = 8002;
const mongoose = require('mongoose');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

const userRepository = require('./repositories/userRepository');
userRepository.init(mongoose, mongoUri);

// Middleware to parse JSON in request body
app.use(express.json());

require('./routes/routes')(app, userRepository);

// Start the server
const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});

server.on('close', () => mongoose.connection.close());

module.exports = server
