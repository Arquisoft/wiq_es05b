module.exports = {
  mongoose: null,
  uri: null,
  User: require("../user-model"),
  init: function (mongoose, uri) {
    this.mongoose = mongoose;
    this.uri = uri;
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
      return { message: "User created successfully" };
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
  getUsers: async function (filter) {
    try {
      await this.checkUp()
      return await this.mongoose.connection.collection("users").find(filter).toArray()
    } catch (error) {
      throw error.message;
    }
  },
  checkValidId: function (id) {
    return !(!id || !this.mongoose.isValidObjectId(id));
  }
};
