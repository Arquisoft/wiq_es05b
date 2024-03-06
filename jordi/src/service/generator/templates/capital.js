const Question = require("../../../persistence/Question.js");

const axios = require('axios');

class Capital {
    
    constructor(country, capital) {
        this.country = country;
        this.capital = capital;
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
        
        const sparqlQuery = `SELECT DISTINCT ?countryLabel ?capitalLabel WHERE {
            ?country wdt:P31 wd:Q6256;
                wdt:P36 ?capital;
                wdt:P1082 ?population;
                rdfs:label ?countryLabel.
            ?capital rdfs:label ?capitalLabel.
            FILTER(LANG(?countryLabel) = "en")
            FILTER(LANG(?capitalLabel) = "en")
            FILTER(?population > 30000000)
        }`;

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.results.bindings.length > 0) {

                const nums = getRandomNumbers(data.results.bindings.length,n);
                const questions = [];

                nums.forEach(x => {
                    const country = data.results.bindings[x].countryLabel.value;
                    const capital = data.results.bindings[x].capitalLabel.value;
                    questions.push(new Question ({
                        category: "Country",
                        statement: this.getStatement(country),
                        answer: capital,
                    }));
                    console.log(`La capital de ${pais} es: ${capi}`);
                });
                
                // TODO: mirar si esto funciona
                questions.forEach(question => { 
                    
                    const rest = questions.filter(x => x != question)

                    const nums = getRandomNumbers(rest.length, 3);

                    nums.forEach(x => {
                        question.options(rest[x].answer);
                    })

                });

                return questions;
            } else {
                return "No se encontró la capital";
            }
        } catch (error) {
            console.error("Error:", error);
            return "Error al obtener la capital";
        }

    }

}

// Obtiene n números aleatorios dentro del rango de 0 a length - 1.
function getRandomNumbers(length, n){
    const res = [];
    while(res.length < n){
        const randomNum = Math.floor(Math.random() * Math.floor(length - 1));
        if(!res.includes(randomNum)){
            res.push(randomNum);
        }
    }
    return res;
}

Capital.generate();