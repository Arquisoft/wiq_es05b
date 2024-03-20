const express = require('express');
const pg = require('pg');

const app = express();
const port = 8005;

const pgUri = "postgres://postgres:jordishhh@localhost:5432/postgres";

const rankingRepository = require("./repositories/rankingRepository")
rankingRepository.init(new pg.Client(pgUri))

app.use(express.json())

require("./routes/routes")(app, rankingRepository)

// Run the server
app.listen(port, () => {
    console.log('Ranking listening on port ' + port);
});
