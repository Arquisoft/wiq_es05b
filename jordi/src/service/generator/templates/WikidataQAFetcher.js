
const Question = require("../../../persistence/Question.js");

const axios = require('axios');

class Template {

    constructor(sparqlquery) {
        this.sparqlquery = sparqlquery;
    }

    getStatement(country) {
        const statements = [
            `The capital of ${country} is...`,
            `What is the capital of ${country}?`,
            `Select the capital of ${country}`
        ]
    
        return statements[Math.floor(Math.random() * statements.length)];
    }

    async generate(n) {

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(this.sparqlquery)}&format=json`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.results.bindings.length > 0) {

                const nums = getNRandomNumbers(data.results.bindings.length,n);
                const questions = [];

                nums.forEach(x => {
                    
                    const country = data.results.bindings[x].countryLabel.value;
                    const capital = data.results.bindings[x].capitalLabel.value;
                    questions.push(new Question ({
                        category: "Country",
                        statement: this.getStatement(country),
                        options: [capital]
                    }));
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
            throw new Error("Error obtaining data");
        }

    }

}

// Obtiene n números aleatorios dentro del rango de 0 a length - 1.
function getNRandomNumbers(length, n){
    const res = [];
    while(res.length < n){
        const randomNum = Math.floor(Math.random() * Math.floor(length - 1));
        if(!res.includes(randomNum)){
            res.push(randomNum);
        }
    }
    return res;
}

module.exports = Template;
