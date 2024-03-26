
const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
    {
        groupId: {
            type: String, required: true
        },
        statements: [{
            type: String, required: true
        }],
        answer: {
            type: String, required: true,
        },
        tags: [{
            type: String, required: true
        }],
    },
);

const Question = mongoose.model('questions',questionSchema);
module.exports = Question;