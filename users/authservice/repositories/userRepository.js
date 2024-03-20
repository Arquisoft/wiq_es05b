module.exports = {
    mongoose: null,
    uri: null,
    User: require('../auth-model'),
    init: function (mongoose, uri) {
        this.mongoose = mongoose;
        this.uri = uri;
    },
    findUserByUsername: async function (username) {
        try {
            await this.mongoose.connect(this.uri);
            const user = await this
                .User
                .findOne({ username });
            await this.mongoose.connection.close();
            return user;
        } catch (error) { return error }
    }
}