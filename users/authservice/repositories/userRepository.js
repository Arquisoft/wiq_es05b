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
            return user;
        } catch (error) {
            throw error.message
        } finally {
            this.mongoose.connection && await this.mongoose.connection.close();
        }
    }
}