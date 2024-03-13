
let express = require('express');
let app = express();
let port = 8003;

let router = require("./routes/routes")

app.use("/", router)

// Run the server
app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
