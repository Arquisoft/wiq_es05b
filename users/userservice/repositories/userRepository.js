const bcrypt = require('bcrypt');

module.exports = {
  mongoose: null,
  uri: null,
  i18next: null,
  User: require("../user-model"),
  init: function (mongoose, uri, i18next) {
    this.mongoose = mongoose;
    this.uri = uri;
    this.i18next = i18next;

    this.initAdminUser();
    this.initTestUser();

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
  //If not filter, return last 10 created users, otherwise return users that match the filter
  getUsers: async function (filter) {
    try {
      await this.checkUp()
      if (!filter)
        return await this.mongoose.connection.collection("users").find({}).sort({ createdAt: -1 }).limit(10).toArray();
      else
        return await this.mongoose.connection.collection("users").find(filter).toArray()
    } catch (error) {
      throw error.message;
    }
  },
  checkValidId: function (id) {
    return !(!id || !this.mongoose.isValidObjectId(id));
  },
  initAdminUser: function () {

    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    this.getUser({ username: "admin" }).then((user) => {
      if (!user) {
        bcrypt.hash(adminPassword, 10, async (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing admin password", err);
            return;
          }
          try {
            await this.insertUser("admin", hashedPassword);
            console.log("Admin user created successfully");
          } catch (error) {
            console.error("Error creating admin user", error);
          }
        });
      }
    });
  },
  initTestUser: function () {
    const testPassword = process.env.TEST_PASSWORD || "test";

    this.getUser({ username: "test" }).then((user) => {
      if (!user) {
        bcrypt.hash(testPassword, 10, async (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing test password", err);
            return;
          }
          try {
            await this.insertUser("test", hashedPassword);
            console.log("Test user created successfully");
          } catch (error) {
            console.error("Error creating test user", error);
          }
        });
      }
    });
  },
};
