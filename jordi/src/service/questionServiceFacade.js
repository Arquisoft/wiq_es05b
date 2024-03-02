const mockService = require('./questionMockService');

function getQuestionMock() {
    return mockService.getQuestionMock();
}

module.exports = {getQuestionMock};