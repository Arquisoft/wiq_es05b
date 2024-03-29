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

const questionSchema = new mongoose.Schema({
  statement: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  answer: {
    type: Number,
    required: true,
  },
  correct: {
    type: Number,
    required: true,
  },
})

const Save = mongoose.model("Save", saveSchema);
const Question = mongoose.model("Question", questionSchema);

module.exports = Save;
module.exports = Question;
