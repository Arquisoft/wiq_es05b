
let express = require('express');
let mongoose = require('mongoose');
let app = express();
let port = 8003;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';
mongoose.connect(mongoUri);

//Endpoints 
app.get('/questions/:category', function (req, res) {
    const category = req.params.category;
    mongoose.find({ category: category }, function (err, questions) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(questions);
        }
    });
});

// Run the server
var server = app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
