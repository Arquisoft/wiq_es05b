const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship
