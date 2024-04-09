
module.exports = {
    
    mongoose: null,
    uri: null,
    collectionName: 'records',
    Record: require("../ranking-model"),

    init: function(mongoose, uri) {
        this.mongoose = mongoose;
        this.uri = uri;
    },

    getRanking: async function (n) {
        try {
            await this.mongoose.connect(this.uri);
            let result = this
                .mongoose
                .connection
                .collection(this.collectionName)
                .find()
            return result;
        } catch (error) {
            throw error.message
        } finally {
            await this.mongoose.disconect();
        }
    },

    insertRecord: async function (username, points) {
        try {

            await this.mongoose.connect(this.uri);

            const record = new this.Record({
                name: username,
                points: points
            });

            await record.save();

            return { message: 'Record inserted' };

        } catch (error) {
            console.log(error)
            throw error.message;
        } finally {
            await this.mongoose.disconnect();
        }
    }
}