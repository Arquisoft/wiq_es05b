module.exports = {
  mongoose: null,
  uri: null,
  User: require("../user-model"),
  init: function (mongoose, uri) {
    this.mongoose = mongoose;
    this.uri = uri;
  },
  insertUser: async function (username, password) {
    try {
      await this.mongoose.connect(this.uri);
      const user = new this.User({
        username: username,
        password: password,
      });
      await user.save();
      return { message: "User created successfully" };
    } catch (error) {
      throw error.message;
    } finally {
      this.mongoose.connection && await this.mongoose.connection.close()
    }
  },
  checkUser: async function (username) {
    try {
      await this.mongoose.connect(this.uri);
      let result = await this
        .mongoose
        .connection
        .collection("users")
        .findOne({username: username})
      return result;
    } catch (error) {
      throw error.message;
    } finally {
      this.mongoose.connection && await this.mongoose.connection.close();
    }
  }
};
