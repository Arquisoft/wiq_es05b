const WikidataQAFetcher = require('../WikidataQAFetcher');

// Fix: common languages repeat themselves across several questions

const sparqlquery = `
SELECT DISTINCT ?question ?answer WHERE {
    ?country wdt:P31 wd:Q6256;
        wdt:P37 ?language;
        rdfs:label ?question.
    ?country2 wdt:P31 wd:Q6256;
        wdt:P37 ?language2;
        rdfs:label ?question.
    ?language rdfs:label ?answer.
    FILTER(LANG(?question) = "en")
    FILTER(LANG(?answer) = "en")
    FILTER(?language != ?language2)
}
`;

const statements = [
    `The official language of ?question is...`,
    `What is the official language of ?question?`,
    `Select the official language of ?question`
];

const languages = new WikidataQAFetcher(
    sparqlquery,
    statements,
    ["Geography", "Languages"]
);

module.exports = languages;