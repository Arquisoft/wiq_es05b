module.exports = {
  mongoose: null,
  uri: null,
  i18next: null,
  User: require("../user-model"),
  init: function (mongoose, uri, i18next) {
    this.mongoose = mongoose;
    this.uri = uri;
    this.i18next = i18next;
  },
  checkUp: async function () {
    if (this.mongoose.connection.readyState !== 1) {
      await this.mongoose.connect(this.uri);
    }
  },
  insertUser: async function (username, password) {
    try {
      await this.checkUp()
      const user = new this.User({
        username: username,
        password: password,
      });
      await user.save();
      return { message: this.i18next.t("user_created") };
    } catch (error) {
      throw error.message;
    }
  },
  getUser: async function (filter) {
    if ("_id" in filter) filter._id = new this.mongoose.Types.ObjectId(filter._id);
    try {
      await this.checkUp()
      return await this.mongoose.connection.collection("users").findOne(filter)
    } catch (error) {
      throw error.message;
    }
  },
  checkValidId: function (id) {
    return !(!id || !this.mongoose.isValidObjectId(id));
  }
};
