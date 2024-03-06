
const questionModel = require('./questionModelFacade')

function getQuestionMock(){
    return questionModel.getQuestionMock();
}

module.exports = {getQuestionMock};