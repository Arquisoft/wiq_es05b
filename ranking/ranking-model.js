
const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true
        },
        points: {
            type: Number, required: true
        },
        date: {
            type: Date, default: Date.now
        }
    },
);

const Record = mongoose.model('records',recordSchema);
module.exports = Record;