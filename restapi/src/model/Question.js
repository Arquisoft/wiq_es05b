
const mongoose = require('mongoose')

const QuestionsSchema = new mongoose.Schema({
        question: {
            type: String, required: true
        },
        answer: {
            type: String, required: true
        },
        option2: {
            type: String, required: true
        },
        option3: {
            type: String, required: true
        },
        option4: {
            type: String, required: true
        },
    },
    {collection:'Question'});

export const Question = mongoose.model('Question',QuestionsSchema,'Question');