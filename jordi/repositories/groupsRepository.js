const {Group} = require("../jordi-model");

module.exports = {

  mongoose: null,
  uri: null,
  collectionName: "groups",
  Group,
  i18next: null,

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

  findGroups: async function (filter, options) {
    try {
      await this.checkUp();
      const result = await this.mongoose.connection
        .collection(this.collectionName)
        .find(filter, options);
        return result.toArray()
    } catch (error) {
      throw error.message;
    }
  },

  insertGroup: async function (groupDto) {
    try {
      await this.checkUp()
      
      const group = new this.Group({
        groupId: groupDto.groupId,
        questionItem: groupDto.questionItem,
        answer: groupDto.answer,
        statements: groupDto.statements,
        categories: groupDto.categories,
        plainText: groupDto.plainText,
        filter: groupDto.filter,
        relation: groupDto.relation
      });

      await group.save();
      return { message: this.i18next.t("group_created") };

    } catch (error) {

      if (error.code === 11000) {
        throw { status: 409, error: this.i18next.t("error_group_exists") };
      }

      throw error.message;
    }
  },

  removeGroups: async function (filter, options) {
    try {
      await this.checkUp();
      await this.Group.deleteMany(filter, options);
      return { message: this.i18next.t("group_removed") };
    } catch (error) {
      throw error.message;
    }
  }

};
