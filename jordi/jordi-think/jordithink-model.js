
const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
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
);

const Question = mongoose.model('questions',questionSchema);
module.exports = Question;