
const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
    {
        groupId: {
            type: String, required: true
        },
        categories: [{
            type: String, required: true
        }],
        statements: [{
            type: String, required: true
        }],
        answer: {
            type: String, required: true,
        },
    },
);

const groupSchema = new mongoose.Schema(
    {
        groupId: {
            type: String, required: true, unique: true
        },
        questionItem: {
            type: String, required: true
        },
        answer: {
            type: String, required: true
        },
        statements: [{
            type: String, required: true
        }],
        categories: [{
            type: String, required: true
        }],
        plainText: {
            type: Boolean, required: false
        },
        filter: {
            type: String, required: false
        },
        relation: {
            type: String, required: false
        }
    },
);

const Question = mongoose.model('questions', questionSchema);
const Group = mongoose.model('groups', groupSchema);

module.exports = { Question, Group };