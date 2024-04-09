
module.exports = {
    
    mongoose: null,
    uri: null,
    collectionName: 'questions',
    Record: require("../ranking-model"),

    init: function(mongoose, uri) {
        this.mongoose = mongoose;
        this.uri = uri;
    },

    getRanking: async function (n) {
        try {
            await this.mongoose.connect();
            let result = this
                .mongoose
                .connection
                .collection(this.collectionName)
                .find()
            return result.rows;
        } catch (error) {
            throw error.message
        } finally {
            await this.mongoose.disconect();
        }
    },

    insertRecord: async function (username, points) {
        try {

            await this.mongoose.connect();

            const record = new this.Record({
                name: username,
                points: points
            });

            record.save();

            return { message: 'Record inserted' };

        } catch (error) {
            throw error.message;
        } finally {
            await this.mongoose.disconnect();
        }
    }
}