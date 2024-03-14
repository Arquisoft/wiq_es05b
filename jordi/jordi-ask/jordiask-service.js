
let express = require('express');
let app = express();
let port = 8003;

let router = require("./routes/routes")

// Middleware to analyze request bodies 
app.use(express.json());

app.use("/", router)

// Run the server
app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
