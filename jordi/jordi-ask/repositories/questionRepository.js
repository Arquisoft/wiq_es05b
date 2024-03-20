module.exports = {
    mongoose: null,
    uri: null,
    collectionName: 'questions',

    init: function (mongoose, uri) {
        this.mongoose = mongoose;
        this.uri = uri;
    },

    getCategories: async function () {
        try {
            await this.mongoose.connect(this.uri);
            let result = await this
                .mongoose
                .connection
                .collection(this.collectionName)
                .distinct("category");
            await this.mongoose.disconnect();
            return result;
        } catch (error) { return {error: error} }
    },

    getQuestions: async function (category, n=10) {
        try {
            await this.mongoose.connect(this.uri);
            let result = await this
                .mongoose
                .connection
                .collection(this.collectionName)
                .find({category: category})
                .limit(parseInt(n))
                .toArray();
            await this.mongoose.disconnect();
            return result
        } catch (error) { return {error: error} }
    },

    findQuestionById: async function (id) {
        try {
            await this.mongoose.connect(this.uri);
            const question = await this
                .mongoose
                .connection
                .collection(this.collectionName)
                .findOne({_id: new this.mongoose.Types.ObjectId(id)});
            await this.mongoose.disconnect();
            return question;
        } catch (error) { return {error: error} }
    }
}