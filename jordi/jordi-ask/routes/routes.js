let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';

router.get("/categories", async (req, res) => {
    await mongoose.connect(mongoUri);
    let result = await mongoose.connection.collection('questions').distinct("category");
    await mongoose.disconnect();
    res.json(result);
})

router.get('/questions/:category', async (req, res) => {
    const category = req.params.category;
    await mongoose.connect(mongoUri);
    let result = await mongoose.connection.collection('questions').find({category: category}).toArray();

    await mongoose.disconnect();
    res.json(result);
});

module.exports = router