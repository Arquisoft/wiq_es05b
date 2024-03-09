
const questionModel = require('./jordiModel')

function getQuestions(category, n) {
    return questionModel.getQuestionMock()
}

module.exports = {getQuestions};