
const mongoose = require('mongoose')

const QuestionsSchema = new mongoose.Schema(
    {
        category: {
            type: String, required: true
        },
        statement: {
            type: String, required: true
        },
        answer: {
            type: String, required: true,
        },
        options: [{
            type: String, required: true,
        }]
    },
    {collection:'Question'}
);

const Question = mongoose.model('Question',QuestionsSchema,'Question');
module.exports = Question;