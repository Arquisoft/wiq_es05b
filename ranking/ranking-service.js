
let express = require('express');
let pg = require('pg');
import * as res from 'express/lib/response';

let app = express();
let port = 8005;

const pgUri = "postgres://postgres:jordishhh@localhost:5432/postgres";

//Endpoints 

// get top n ranking
app.get("/ranking/:n", async (req, res) => {
    let client = new pg.Client(pgUri);
    await client.connect();

    let result = await client.query('SELECT * FROM ranking ORDER BY points DESC LIMIT $1', [req.params.n]);
    
    res.send(result.rows);

    client.end();
});

// add record
app.post("/adduser", async (req, res) => {
    
    let client = new pg.Client(pgUri);
    await client.connect();

    let result = await client.query('INSERT INTO ranking (name, points) VALUES ($1)', [req.body.name, req.body.points]);

    res.send(result.rows);

    client.end(); 
    
});

// Run the server
app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
