let express = require('express');
let pg = require('pg');
// import * as res from 'express/lib/response';

let app = express();
let port = 8005;

let router = require("./routes/routes")

app.use("/", router)

// Run the server
app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
