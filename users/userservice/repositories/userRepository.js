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
      await this.mongoose.connection.close();
      return { message: "User created successfully" };
    } catch (error) {
      return error;
    }
  },
};
