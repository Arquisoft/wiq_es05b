let express = require('express');
let router = express.Router();

const pgUri = "postgres://postgres:jordishhh@localhost:5432/postgres";

// get top n ranking
router.get("/ranking/:n", async (req, res) => {
    let client = new pg.Client(pgUri);
    await client.connect();

    let result = await client.query('SELECT * FROM ranking ORDER BY points DESC LIMIT $1', [req.params.n]);
    
    res.send(result.rows);

    client.end();
});

// add record
router.post("/adduser", async (req, res) => {
    
    let client = new pg.Client(pgUri);
    await client.connect();

    let result = await client.query('INSERT INTO ranking (name, points) VALUES ($1)', [req.body.name, req.body.points]);

    res.send(result.rows);

    client.end(); 
    
});

module.exports = router