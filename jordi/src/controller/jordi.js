
var questionService = require('../service/questionServiceFacade');
var express = require('express');
var app = express();
var port = 8003;

//Endpoints 
app.get('/questions/mock', function (req, res) {
    const questions = questionService.getQuestionMock();
    res.json(questions);
});

// Run the server
var server = app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
