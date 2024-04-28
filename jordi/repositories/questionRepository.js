const {Question} = require("../jordi-model");

module.exports = {

  mongoose: null,
  uri: null,
  collectionName: "questions",
  Question,

  init: function (mongoose, uri) {
    this.mongoose = mongoose;
    this.uri = uri;
  },

  checkUp: async function () {
    if (this.mongoose.connection.readyState !== 1) {
      await this.mongoose.connect(this.uri);
    }
  },

  getCategories: async function () {
    try {
      await this.checkUp();
      return await this.mongoose.connection
        .collection(this.collectionName)
        .distinct("categories");
    } catch (error) {
      throw error.message;
    }
  },

  checkCategory: async function (category) {
    try {
      await this.checkUp();
      return await this.mongoose.connection
        .collection(this.collectionName)
        .findOne({ categories: category });
    } catch (e) {
      throw e.message;
    }
  },

  getQuestions: async function (category, n = 10) {
    try {
      await this.checkUp();

      let result = await this.mongoose.connection
        .collection(this.collectionName)
        .aggregate([
          { $match: { categories: category } },
          { $sample: { size: parseInt(n) } },
        ])
        .toArray();

      for (let i = 0; i < result.length; i++) {
        const question = result[i];
        question.options = await this.getDistinctOptions(question);
      }

      return result;
    } catch (error) {
      throw error.message;
    }
  },

  insertQuestions: async function (questions) {
    try {
      await this.checkUp();
      await this.mongoose.connection
        .collection(this.collectionName)
        .insertMany(questions);
    } catch (error) {
      throw error.message;
    }
  },

  deleteQuestions: async function (groupId) {
    try {
      await this.checkUp();
      await this.mongoose.connection
        .collection(this.collectionName)
        .deleteMany({ groupId });
    } catch (error) {
      throw error.message;
    }
  },

  getDistinctOptions: async function (question) {
    // FIXME: Make it distinct and exclude the answer
    // also make sure there are always 4 options at the end

    try {
      await this.checkUp();
      let result = (
        await this.mongoose.connection
          .collection(this.collectionName)
          .aggregate([
            { $match: { categories: question.categories } },
            { $sample: { size: 3 } },
            { $project: { _id: 0, answer: 1 } },
            { $group: { _id: null, options: { $addToSet: "$answer" } } },
            { $unwind: "$options" },
            { $project: { _id: 0, option: "$options" } },
          ])
          .toArray()
      ).map((x) => x.option);

      result.push(question.answer);

      return result;
    } catch (error) {
      throw error;
    }
  },

  findQuestionById: async function (id) {
    try {
      await this.checkUp();
      return await this.mongoose.connection
        .collection(this.collectionName)
        .findOne({_id: new this.mongoose.Types.ObjectId(id)});
    } catch (error) {
      throw error.message;
    }
  },

  checkValidId: function (id) {
    return !(!id || !this.mongoose.isValidObjectId(id));
  },
};
