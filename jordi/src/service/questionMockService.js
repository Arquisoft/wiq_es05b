const questionModel = require('../model/questionModelFacade')

function getQuestionMock(){
    return questionModel.getQuestionMock();
}

module.exports = {getQuestionMock};