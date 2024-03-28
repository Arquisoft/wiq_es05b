const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 8005;

// TODO - Move to env
const pgUri = "postgres://postgres:jordishhh@localhost:5432/postgres";
const rankingRepository = require("./repositories/rankingRepository")

app.use(express.json())
require("./routes/routes")(app, rankingRepository)

app.listen(port, () => {
    console.log('Ranking listening on port ' + port);
});        

rankingRepository.init(Client, pgUri)
    .catch(error => {
        console.error(`Error initializing ranking repository: ${error}`)
    });
