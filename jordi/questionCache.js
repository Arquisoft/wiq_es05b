module.exports = {
    questions: {},
    storeQuestion(question){
        if(question && Object.keys(this.questions).length >= 1000) {
            const keys = Object.keys(this.questions);
            delete this.questions[keys[0]];
        }
        this.questions[question._id] = question;
    },
    getQuestion(id){
        return this.questions[id];
    }
};
