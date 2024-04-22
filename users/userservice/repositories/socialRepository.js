module.exports = {
    mongoose: null,
    uri: null,
    request: require("../friendRequest-model"),
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
};
