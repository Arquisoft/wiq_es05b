module.exports = {
  mongoose: null,
  uri: null,
  collectionName: 'questions',

  init: function(mongoose, uri){
    this.mongoose = mongoose
    this.uri = uri
  }
}