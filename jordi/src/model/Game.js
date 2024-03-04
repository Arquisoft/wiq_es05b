import {Timestamp} from "mongodb";
import {User} from "./User";

const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({
        total: {
            type: Number, required: true
        },
        correct: {
            type: Number, required: true
        },
        start: {
            type: Timestamp, required: true
        },
        end: {
            type: Timestamp, required: true
        },
        user: {
            type: User, required: true
        },
        points: {
            type: Number, required: true
        },
    },
    {collection:'Game'});

export const Game = mongoose.model('Game',GameSchema,'Game');