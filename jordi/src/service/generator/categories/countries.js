const WikidataQAFetcher = require('../WikidataQAFetcher');

const sparqlquery = `
SELECT DISTINCT ?question ?answer WHERE {
    ?country wdt:P31 wd:Q6256;
        wdt:P36 ?capital;
        wdt:P1082 ?population;
        rdfs:label ?answer.
    ?capital rdfs:label ?question.
    FILTER(LANG(?question) = "en")
    FILTER(LANG(?answer) = "en")
    FILTER(?population > 30000000)
}
`

const statements = [
    `?question belongs to...`,
    `?question is the capital city of...`,
    `Which country has ?question as the capital city?`
]

capitals = new WikidataQAFetcher(
    sparqlquery,
    statements,
    "Geography"
);

module.exports = capitals;