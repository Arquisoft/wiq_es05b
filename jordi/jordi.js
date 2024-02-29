
var express = require('express');
var app = express();
var port = 8003;

// Run the server

var server = app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});

export default server;