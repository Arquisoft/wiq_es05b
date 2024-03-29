const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8006;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/history"

const saveRepository = require('./repositories/saveRepository');
const questionsRepository = require('./repositories/questionsRepository');

saveRepository.init(mongoose, MONGODB_URI);
questionsRepository.init(mongoose, MONGODB_URI);

app.use(express.json())

require('./routes/routes')(app, saveRepository, questionsRepository);

app.listen(port, () => {
    console.log(`History listening on port ${port}`);
});
