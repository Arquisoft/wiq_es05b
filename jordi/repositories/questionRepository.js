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
                .distinct("categories");
            return result;
        } catch (error) {
            throw error.message
        } finally {
            await this.mongoose.disconnect();
        }
    },

    getQuestions: async function (category, n=10) {
        try {
            await this.mongoose.connect(this.uri);

            let result = await this
                .mongoose
                .connection
                .collection(this.collectionName)
                .aggregate([
                    { $match: { categories: category } },
                    { $sample: { size: parseInt(n) } }
                ])
                .toArray();

            for (let i = 0; i < result.length; i++) {
                const question = result[i];
                const options = await this.getDistinctOptions(question);
                question.options = options;
            }

            return result
        } catch (error) {
            throw error.message
        } finally {
            await this.mongoose.disconnect();
        }
    },

    getDistinctOptions: async function (question) {

        // FIXME: Make it distinct and exclude the answer
        // also make sure there are always 4 options at the end

        try {
            let result = (await this
                .mongoose
                .connection
                .collection(this.collectionName)
                .aggregate([
                    { $match: { categories: question.categories } },
                    { $sample: { size: 3 } },
                    { $project: { _id: 0, answer: 1 } },
                    { $group: { _id: null, options: { $addToSet: "$answer" } } },
                    { $unwind: "$options" },
                    { $project: { _id: 0, option: "$options" } }
                ])
                .toArray()).map(x => x.option);

                result.push(question.answer);
            
            return result;
        } catch (error) { throw error }
    },

    findQuestionById: async function (id) {
        try {
            await this.mongoose.connect(this.uri);
            const question = await this
                .mongoose
                .connection
                .collection(this.collectionName)
                .findOne({_id: new this.mongoose.Types.ObjectId(id)});
            return question;
        } catch (error) {
            throw error.message
        } finally {
            await this.mongoose.disconnect();
        }
    },
    checkValidId: function (id) {
        if(!id || !this.mongoose.isValidObjectId(id)) return false
        return true
    }
}