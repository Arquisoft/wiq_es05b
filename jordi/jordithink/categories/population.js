const WikidataQAFetcher = require('../WikidataQAFetcher');

const sparqlquery = `
SELECT DISTINCT ?question ?answer WHERE {
    ?country wdt:P31 wd:Q6256;
        wdt:P1082 ?answer;
        rdfs:label ?question.
    FILTER(LANG(?question) = "en")
}
`

const statements = [
    `The population of ?question is...`,
    `What is the population of ?question?`,
    `Select the population of ?question`
]

const population = new WikidataQAFetcher(
    sparqlquery,
    statements,
    "Geography"
);

module.exports = population;