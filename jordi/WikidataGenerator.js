const Question = require("./jordi-model");

const axios = require('axios');

class WikidataGenerator {

    // Get Items: (https://www.wikidata.org/w/index.php?search=&search=&title=Special:Search&go=Go)
    // Get properties: (https://www.wikidata.org/wiki/Wikidata:List_of_properties)

    constructor(group) {

        this.setSparQlQuery(group);
        this.groupId = group.groupId;
        this.statements = group.statements;
        this.categories = group.categories;

    }

    setSparQlQuery(group) {
        const query = `
        SELECT DISTINCT ?question ?answer
        WHERE {
            <Body>
            <Filter>
        }
        `;

        const plainTextBody = `
        ?entity wdt:<Relation> wd:<QuestionItem>;
            wdt:<Answer> ?answer;
            rdfs:label ?question.
        `;

        const itemBody = `
        ?entity wdt:<Relation> wd:<QuestionItem>;
            wdt:<Answer> ?url;
            rdfs:label ?question.
            ?url rdfs:label ?answer.
        `;

        const relation = group.relation ? group.relation : "P31";
        const filter = group.filter ? group.filter : "FILTER(LANG(?question) = 'en') FILTER(LANG(?answer) = 'en')";

        this.sparqlquery = query
            .replace("<Body>", group.plainText ? plainTextBody : itemBody)
            .replace("<QuestionItem>", group.questionItem)
            .replace("<Answer>", group.answer)
            .replace("<Relation>", relation)
            .replace("<Filter>", filter);
    }

    async generate() {

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(this.sparqlquery)}&format=json`; // UwU Txoka Was Here

        const response = await axios.get(url);
        const data = response.data;
        if (0 < data.results.bindings.length) {
            
            const questions = [];

            data.results.bindings.forEach(q => {

                const questionParam = q.question.value;
                const answer = q.answer.value;

            questions.push(new Question({
                groupId: this.groupId,
                categories: this.categories,
                statements: this.fillStatements(questionParam),
                answer: answer
            }));

        });

        return questions;

        } else {
            throw new Error("No Data found")
        }

    }

    fillStatements(questionItem) {

        let filledStatements = [];

        for (let statement of this.statements) {
            filledStatements.push(statement.replace("<QuestionItem>", questionItem));
        }

        return filledStatements;

    }
    
}

module.exports = WikidataGenerator;