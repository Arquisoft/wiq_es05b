
const WikidataQAFetcher = require('./WikidataQAFetcher');

capitals = new WikidataQAFetcher(
    `SELECT DISTINCT ?countryLabel ?capitalLabel WHERE {
        ?country wdt:P31 wd:Q6256;
            wdt:P36 ?capital;
            wdt:P1082 ?population;
            rdfs:label ?countryLabel.
        ?capital rdfs:label ?capitalLabel.
        FILTER(LANG(?countryLabel) = "en")
        FILTER(LANG(?capitalLabel) = "en")
        FILTER(?population > 30000000)
    }`
)

module.exports = capitals;