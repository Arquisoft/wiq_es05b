class Question {
    constructor(question, infolevel) {

        this.statement = question.statement;
        this.options = question.options;

        if (infolevel != 'WEBAPP') {
            this.answer = question.answer;
        }
    }

}