module.exports = {
  mongoose: null,
  uri: null,
  User: require("../user-model"),
  init: function (mongoose, uri) {
    this.mongoose = mongoose;
    this.uri = uri;

    //Insert sample data
    if(process.env.DEV === "true") {
      console.log("Inserting sample data");
      this.insertSampleData();
    }

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
  getUser: async function (filter) {
    if ("_id" in filter) {
      filter._id = new this.mongoose.Types.ObjectId(filter._id);
    }
    try {
      await this.mongoose.connect(this.uri);
      let result = await this
        .mongoose
        .connection
        .collection("users")
        .findOne(filter)
      return result;
    } catch (error) {
      throw error.message;
    } finally {
      this.mongoose.connection && await this.mongoose.connection.close();
    }
  },
  checkValidId: function (id) {
    return !(!id || !this.mongoose.isValidObjectId(id));
  }
};
