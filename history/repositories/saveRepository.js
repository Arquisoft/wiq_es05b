module.exports = {
  mongoose: null,
  uri: null,
  collectionName: 'saves',
  Save: require('../history-model'),

  init: function(mongoose, uri){
    this.mongoose = mongoose
    this.uri = uri
  },

  createSave: async function(userId, category) {
    try {
      await this.mongoose.connect(this.uri);
      const save = new this.Save({
        userId: userId,
        category: category,
        questions: [],
      })
      await save.save()
      return { message: "Save created successfully" }
    } catch (error) {
      throw error.message
    } finally {
      this.mongoose.connection && await this.mongoose.disconnect();
    }
  },
  isValidObjectId: function(id) {
    return this.mongoose.Types.ObjectId.isValid(id)
  },
  findSave: async function(id) {
    try {
      await this.mongoose.connect(this.uri)
      const result = await this.Save.findById(id)
      return result
    } catch (e) {
      throw e.message
    } finally {
      this.mongoose.connection && await this.mongoose.disconnect()
    }
  },
  addAnswer: async function(question, id, close) {
    try {
      await this.mongoose.connect(this.uri)
      const result = await this.Save.findById(id)
      if (!result) return { message: "Save not found" }
      if(result.finished) return { message: "Save is already finished" }
      result.questions.push(question)
      result.markModified('questions')
      if(close) {
        result.finished = true
        result.markModified('finished')
      }
      await result.save()
      return { message: "Question added successfully" }
    } catch (e) {
      throw e.message
    } finally {
      this.mongoose.connection && await this.mongoose.disconnect()
    }
  },
  getUserSave: async function(userId, id) {
    try {
      await this.mongoose.connect(this.uri)
      const result = await this.Save.findOne({ userId: userId, _id: id })
      return result
    } catch (e) {
      throw e.message
    } finally {
      this.mongoose.connection && await this.mongoose.disconnect()
    }
  },
  getUserSaves: async function(userId, page=-1, limit=-1) {
    try {
      await this.mongoose.connect(this.uri)
      if(page === -1 || limit === -1) return await this.Save.find({ userId: userId }).sort({createdAt: -1})
      return await this.Save.find({ userId: userId }).sort({createdAt: -1}).skip(page * limit).limit(limit)

    } catch (e) {
      throw e.message
    } finally {
      this.mongoose.connection && await this.mongoose.disconnect()
    }
  }
}