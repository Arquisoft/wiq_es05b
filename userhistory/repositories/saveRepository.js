module.exports = {
  mongoose: null,
  uri: null,
  collectionName: "saves",
  Save: require("../history-model"),

  init: function (mongoose, uri) {
    this.mongoose = mongoose;
    this.uri = uri;
  },
  checkUp: async function () {
    if (this.mongoose.connection.readyState != 1) {
      await this.mongoose.connect(this.uri);
    }
  },
  createSave: async function (userId, category) {
    try {
      await this.checkUp();
      const save = new this.Save({
        userId: userId,
        category: category,
        questions: [],
      });
      await save.save();
      return { message: "Save created successfully", id: save._id };
    } catch (error) {
      throw error.message;
    }
  },
  isValidObjectId: function (id) {
    return this.mongoose.Types.ObjectId.isValid(id);
  },
  addAnswer: async function (question, id, close) {
    try {
      await this.checkUp()
      const result = await this.Save.findById(id);
      if (!result) return { message: "Save not found" };
      if (result.finished) return { message: "Save is already finished" };
      result.questions.push(question);
      result.markModified("questions");
      if (close) {
        result.finished = true;
        result.markModified("finished");
      }
      await result.save();
      return { message: "Question added successfully" };
    } catch (e) {
      throw e.message;
    }
  },
  getUserSave: async function (userId, id) {
    try {
      await this.checkUp();
      const result = await this.Save.findOne({ userId: userId, _id: id });
      return result;
    } catch (e) {
      throw e.message;
    }
  },
  getUserSaves: async function (userId, page = -1, limit = -1) {
    const filter = { userId: userId, finished: true };
    const order = { createdAt: -1 };
    try {
      await this.checkUp();
      let result;
      const total = await this.Save.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);
      if (page > -1 && limit > -1)
        result = await this.Save.find(filter)
          .sort(order)
          .skip(page * limit)
          .limit(limit);
      else result = await this.Save.find(filter).sort(order);
      return {
        saves: result,
        maxPages: page > -1 && limit > -1 ? totalPages : 1,
      };
    } catch (e) {
      throw e.message;
    }
  },
  cleanStaleSaves: async function () {
    try {
      await this.checkUp();
      const result = await this.Save.deleteMany({
        finished: false,
        createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      });
      return result.deletedCount;
    } catch (e) {
      throw e.message;
    }
  },
  getRanking: async function (n, order = "totalPoints") {
    try {
      await this.checkUp();
      const result = await this.Save.aggregate([
        { $match: { finished: true } },
        { $unwind: "$questions" },
        {
          $addFields: {
            isCorrect: {
              $cond: [
                { $eq: ["$questions.answer", "$questions.correct"] },
                1,
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            userId: { $first: "$userId" },
            totalPoints: { $sum: "$questions.points" },
            totalTime: { $sum: "$questions.time" },
            totalQuestions: { $sum: 1 },
            totalCorrect: { $sum: "$isCorrect" },
            date: { $first: "$createdAt" },
            category: { $first: "$category" },
          },
        },
        {
          $project: {
            userId: 1,
            totalPoints: 1,
            totalTime: 1,
            date: 1,
            category: 1,
            correct: { $divide: ["$totalCorrect", "$totalQuestions"] },
          },
        },
        // FIXME: Always sort by totalPoints
        { $sort: { [order || "totalPoints"]: -1 } },
        { $limit: Number(n) },
      ]);
      return result;
    } catch (e) {
      throw e.message;
    }
  },
};
