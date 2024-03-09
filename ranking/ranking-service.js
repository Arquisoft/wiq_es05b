
let express = require('express');
let pg = require('pg');

let app = express();
let port = 8004;

const mongoUri = process.env.POSTGRES_URI || 'postgres://localhost:5432/ranking';

//Endpoints 
app.get("/ranking", async (req, res) => {

})

app.post('/score', async (req, res) => {

});

// Run the server
app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
