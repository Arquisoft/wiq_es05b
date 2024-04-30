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
        .distinct("categories"); } catch (error) { throw error.message; }
  },

  checkCategory: async function (category) {
    try {
      await this.checkUp();
      const result =  await this.mongoose.connection
        .collection(this.collectionName)
        .distinct("categories");
      return result.some((x) => x === category); } catch (error) { throw error.message; }
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

      return result; } catch (error) { throw error.message; }
  },

  insertQuestions: async function (questions) {
    try {
      await this.checkUp();
      await this.mongoose.connection
        .collection(this.collectionName)
        .insertMany(questions); } catch (error) { throw error.message; }
  },

  deleteQuestions: async function (groupId) {
    try {
      await this.checkUp();
      await this.mongoose.connection
        .collection(this.collectionName)
        .deleteMany({ groupId }); } catch (error) { throw error.message; }
  },

  removeQuestions: async function (filter, options) {

    console.log("XD")
    try {
      await this.checkUp();
      await this.mongoose.connection
        .collection(this.collectionName)
        .deleteMany(filter, options); } catch (error) { throw error.message; }
  },

  getDistinctOptions: async function (question) {
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

      return result; } catch (error) { throw error.message; }
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
