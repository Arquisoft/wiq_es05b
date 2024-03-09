const Question = require("../model/Question");

const axios = require('axios');

class Template {

    constructor(sparqlquery, statements, categories) {
        this.sparqlquery = sparqlquery;
        this.statements = statements;
        this.categories = categories;
    }

    async generate(n) {

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(this.sparqlquery)}&format=json`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.results.bindings.length > 0) {

                const nums = this.getNRandomNumbers(data.results.bindings.length, n);
                const questions = [];

                nums.forEach(pos => {
    
                    const questionParam = data.results.bindings[pos].question.value;
                    const answer = data.results.bindings[pos].answer.value;
                    const statement = this.getStatement(questionParam);
                    const categories = this.categories;

                    questions.push(new Question({
                        categories: [categories],
                        statement: statement,
                        answer: answer,
                        options: [answer]
                    }));

                });

                questions.forEach(question => {

                    const rest = questions.filter(x => x != question)

                    const nums = this.getNRandomNumbers(rest.length, 3);

                    console.log(nums);

                    nums.forEach(x => {

                        question.options.push(rest[x].options[0]);

                    })

                    question.options.sort(() => Math.random() - 0.5);

                });

                return questions;

            } else {
                throw new Error("No Data found")
                console.error(error);
            }
        } catch (error) {
            throw new Error("Error obtaining Data");
            console.error(error);
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

module.exports = Template;