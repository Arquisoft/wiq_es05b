import {Rankings} from "./Ranking";

const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
        name: {
            type: String, required: true
        },
        lastName: {
            type: String, required: true
        },
        email: {
            type: String, required: true, unique: true
        },
        password: {
            type: String, required: true
        }
    },
    {collection:'User'});

export const User = mongoose.model('User',UsersSchema,'User');