const WikidataQAFetcher = require('../WikidataQAFetcher');

const sparqlquery = `
SELECT DISTINCT ?countryLabel ?capitalLabel WHERE {
    ?country wdt:P31 wd:Q6256;
        wdt:P36 ?capital;
        wdt:P1082 ?population;
        rdfs:label ?countryLabel.
    ?capital rdfs:label ?capitalLabel.
    FILTER(LANG(?countryLabel) = "en")
    FILTER(LANG(?capitalLabel) = "en")
    FILTER(?population > 30000000)
}
`

function getStatement(country) {
    const statements = [
        `The capital of ${country} is...`,
        `What is the capital of ${country}?`,
        `Select the capital of ${country}`
    ]

    return statements[Math.floor(Math.random() * statements.length)];
}


capitals = new WikidataQAFetcher(
    sparqlquery,
    getStatement
);

module.exports = capitals;