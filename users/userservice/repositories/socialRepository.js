const { get } = require("mongoose");

module.exports = {
    mongoose: null,
    uri: null,
    request: require("../friendRequest-model"),
    friendship: require("../friendship-model"),
    init: function (mongoose, uri) {
        this.mongoose = mongoose;
        this.uri = uri;
    },
    checkUp: async function () {
        if (this.mongoose.connection.readyState !== 1) {
            await this.mongoose.connect(this.uri);
        }
    },
    insertRequest: async function (fromName,fromId, toId) {
        try {
            await this.checkUp()
            const newRequest = new this.request({
                from: {username: fromName, userId: new this.mongoose.Types.ObjectId(fromId)},
                to: {userId: new this.mongoose.Types.ObjectId(toId)}
            });
            await newRequest.save();
            return { message: "Friend request added successfully" };
        } catch (error) {
            throw error.message;
        }
    },
    getSentRequests: async function (userId) {
        try {
            await this.checkUp()
            return await this.request.find({ "from.userId": new this.mongoose.Types.ObjectId(userId) });
        } catch (error) {
            throw error.message;
        }
    },
    getReceivedRequests: async function (userId) {
        try {
            await this.checkUp()
            return await this.request.find({ "to.userId": new this.mongoose.Types.ObjectId(userId) });
        } catch (error) {
            throw error.message;
        }
    },
    deleteRequest: async function (fromId, toId) {
        try {
            await this.checkUp()
            await this.request.deleteOne({ "from.userId": new this.mongoose.Types.ObjectId(fromId), "to.userId": new this.mongoose.Types.ObjectId(toId) });
            return { message: "Friend request deleted successfully" };
        } catch (error) {
            throw error.message;
        }
    },
    insertFriendship: async function (userId1, userId2) {
        try {
            await this.checkUp()
            const newFriendship = new this.friendship({
                users: [new this.mongoose.Types.ObjectId(userId1), new this.mongoose.Types.ObjectId(userId2)]
            });
            await newFriendship.save();
            return { message: "Friendship added successfully" };
        } catch (error) {
            throw error.message;
        }
    },
};
