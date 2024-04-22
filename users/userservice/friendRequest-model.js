const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    from: {
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    to: {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest
