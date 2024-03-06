
const Question = require("../../persistence/Question");

const axios = require('axios');

class Template {

    constructor(sparqlquery, pushQuestion) {
        this.sparqlquery = sparqlquery;
        this.pushQuestion = pushQuestion;
    }

    async generate(n) {

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(this.sparqlquery)}&format=json`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.results.bindings.length > 0) {

                const nums = getNRandomNumbers(data.results.bindings.length, n);
                const questions = [];

                nums.forEach(x => {
                    this.pushQuestion(Question, questions, data, x)
                });

                questions.forEach(question => {

                    const rest = questions.filter(x => x != question)

                    const nums = getNRandomNumbers(rest.length, 3);

                    nums.forEach(x => {
                        question.options.push(rest[x].options[0]);
                    })

                });

                return questions;

            } else {
                throw new Error("No data found")
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error obtaining data");
        }

    }

    }

// Obtiene n números aleatorios dentro del rango de 0 a length - 1.
function getNRandomNumbers(length, n) {
    const res = [];
    while (res.length < n) {
        const randomNum = Math.floor(Math.random() * Math.floor(length - 1));
        if (!res.includes(randomNum)) {
            res.push(randomNum);
        }
    }
    return res;
}

module.exports = Template;
