const axios = require('axios');

// Función para ejecutar la consulta SPARQL y obtener la capital de un país dado su nombre en Wikidata
async function getCountryCapital(countryName) {
    const sparqlQuery = `
        SELECT ?capital ?capitalLabel WHERE {
            ?country rdfs:label "${countryName}"@en.
            ?country wdt:P36 ?capital.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
    `;
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.results.bindings.length > 0) {
            const capitalName = data.results.bindings[0].capitalLabel.value;
            return capitalName;
        } else {
            return "No se encontró la capital";
        }
    } catch (error) {
        console.error("Error:", error);
        return "Error al obtener la capital";
    }
}

// Obtener la capital de un país especificado
const countryName = "Portugal"; // Aquí puedes cambiar el país deseado
getCountryCapital(countryName)
    .then(capital => {
        console.log(`La capital de ${countryName} es: ${capital}`);
    })
    .catch(error => {
        console.error("Error:", error);
    });
