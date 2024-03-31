
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8003;

const questionsRepository = require('./repositories/questionRepository');
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';

questionsRepository.init(mongoose, mongoUri);

// Middleware to analyze request bodies 
app.use(express.json());

require("./routes/routes")(app, questionsRepository);

// Run the server
app.listen(port, function () {
    console.log('Jordi (Ask) listening on port ' + port);
});
