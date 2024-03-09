
let express = require('express');
let mongoose = require('mongoose');
let app = express();
let port = 8003;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';

//Endpoints 
app.get("/categories", async (req, res) => {
    await mongoose.connect(mongoUri);
    console.log("before")
    let result = await mongoose.connection.collection('questions').distinct("category");
    await mongoose.disconnect();
    res.json(result);
})

app.get('/questions/:category', async (req, res) => {
    const category = req.params.category;
    await mongoose.connect(mongoUri);
    let result = await mongoose.connection.collection('questions').find({category: category}).toArray();

    await mongoose.disconnect();
    res.json(result);
});

// Run the server
app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
});
