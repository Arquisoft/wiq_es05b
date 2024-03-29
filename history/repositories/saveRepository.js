module.exports = {
  mongoose: null,
  uri: null,
  collectionName: 'saves',

  init: function(mongoose, uri){
    this.mongoose = mongoose
    this.uri = uri
  },
}