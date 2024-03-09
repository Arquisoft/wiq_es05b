const Question = require("./jordithink-model");

const axios = require('axios');

class WikidataQAManager {

    constructor(sparqlquery, statements, category) {
        this.sparqlquery = sparqlquery;
        this.statements = statements;
        this.category = category;
    }

    getCategory() {
        return this.category;
    }

    async generate() {

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(this.sparqlquery)}&format=json`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.results.bindings.length > 0) {
                
                const questions = [];

                data.results.bindings.forEach(q => {
    
                    const questionParam = q.question.value;
                    const answer = q.answer.value;
                    const statement = this.getStatement(questionParam);
                    const category = this.getCategory();

                    questions.push(new Question({
                        category: category,
                        statement: statement,
                        answer: answer,
                        options: [answer]
                    }));

                });

                questions.forEach(question => {

                    const rest = questions.filter(x => x != question)

                    const nums = this.getNRandomNumbers(rest.length, 3);
                    
                    nums.forEach(x => {

                        question.options.push(rest[x].options[0]);

                    })

                    question.options.sort(() => Math.random() - 0.5);

                });

                return questions;

            } else {
                throw new Error("No Data found")
            }
        } catch (error) {
            throw new Error("Error obtaining Data");
        }

    }

    getStatement(questionParam) {
        const statement = this.statements[Math.floor(Math.random() * this.statements.length)];
        // replace ?question with questionParam
        return statement.replace(/\?question/g, questionParam);
    }

    getNRandomNumbers(length, n) {
        const res = [];
        while (res.length < n) {
            const randomNum = Math.floor(Math.random() * Math.floor(length - 1));
            if (!res.includes(randomNum)) {
                res.push(randomNum);
            }
        }
        return res;
    }
    
}

module.exports = WikidataQAManager;