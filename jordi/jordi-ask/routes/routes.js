let express = require('express');
let mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
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

    //Return questions without answer
    const answerLessQuestions = result.map(q => {
        const {answer, ...rest} = q;
        return rest;
    });

    res.json(answerLessQuestions);
});

router.post('/answer', async (req, res) => {
    const {id, answer} = req.body;

    await mongoose.connect(mongoUri);
    const idObj = new ObjectId(id);
    const question = await mongoose.connection.collection('questions').findOne({_id: idObj});    
    await mongoose.disconnect();

    if(answer === question.answer)
        res.json('true');
    else    
        res.json('false');
});

module.exports = router