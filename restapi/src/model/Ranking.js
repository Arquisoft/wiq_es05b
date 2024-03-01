import {User} from "./User";
import {Timestamp} from "mongodb";
import {Games} from "./Game";

const mongoose = require('mongoose')

const RankingsSchema = new mongoose.Schema({
        games: {
            type: Number, required: true
        },
        answered: {
            type: Number, required: true
        },
        correct: {
            type: Number, required: true
        },
        wrong: {
            type: Number, required: true
        },
        totalTime: {
            type: String, required: true
        },
        totalPoints: {
            type: Number, required: true
        },
        user: {
            type: User, required: true
        },
    },
    {collection:'Ranking'});

export const Ranking = mongoose.model('Ranking',RankingsSchema,'Ranking');