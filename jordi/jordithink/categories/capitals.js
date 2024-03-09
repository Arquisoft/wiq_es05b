const WikidataQAFetcher = require('../WikidataQAFetcher');

const sparqlquery = `
SELECT DISTINCT ?question ?answer WHERE {
    ?country wdt:P31 wd:Q6256;
        wdt:P36 ?capital;
        wdt:P1082 ?population;
        rdfs:label ?question.
    ?capital rdfs:label ?answer.
    FILTER(LANG(?question) = "en")
    FILTER(LANG(?answer) = "en")
    FILTER(?population > 30000000)
}
`

const statements = [
    `The capital of ?question is...`,
    `What is the capital of ?question?`,
    `Select the capital of ?question`
]

capitals = new WikidataQAFetcher(
    sparqlquery,
    statements,
    ["Geography", "Countries"]
);

module.exports = capitals;