const { checkUp } = require("../../../userhistory/repositories/saveRepository");

module.exports = {
  mongoose: null,
  uri: null,
  User: require("../auth-model"),
  init: function (mongoose, uri) {
    this.mongoose = mongoose;
    this.uri = uri;
  },
  checkUp: async function () {
    if (this.mongoose.connection.readyState != 1) {
      await this.mongoose.connect(this.uri);
    }
  },
  findUserByUsername: async function (username) {
    try {
      await this.checkUp()
      const user = await this.User.findOne({ username });
      return user;
    } catch (error) {
      throw error.message;
    }
  },
};
