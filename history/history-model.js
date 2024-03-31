const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  questions: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  finished:{
    type: Boolean,
    default: false,
  },
});

const Save = mongoose.model("Save", saveSchema);

module.exports = Save;
