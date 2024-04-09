const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8005;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ranking';
const rankingRepository = require("./repositories/rankingRepository")

app.use(express.json())
require("./routes/routes")(app, rankingRepository)

app.listen(port, () => {
    console.log('Ranking listening on port ' + port);
});

rankingRepository.init(mongoose, mongoUri);
