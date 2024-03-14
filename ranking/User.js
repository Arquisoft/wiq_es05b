
const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
        username: {
            type: String, required: true
        },
        password: {
            type: String, required: true
        }
    },
    {collection:'User'});

export const User = mongoose.model('User',UsersSchema,'User');